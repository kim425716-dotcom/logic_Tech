from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import logging

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_staff_or_admin
from app.core.notifications import push_project_update, schedule_coroutine
from app.schemas.schemas import (
    ProjectCreate, ProjectUpdate, ProjectProgressUpdate, ProjectResponse,
)
from app.models.models import Project, User, UserRole, ProjectStatus
from app.services.email_service import send_project_update_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["Projects"])


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _project_dict(project: Project) -> dict:
    return {
        "id": project.id,
        "title": project.title,
        "status": project.status.value if hasattr(project.status, "value") else project.status,
        "progress": project.progress,
    }


def _notify_change(project: Project, title: str, message: str) -> None:
    user_ids = {project.client_id, project.assigned_staff_id, project.consultant_id}
    user_ids.discard(None)
    if user_ids:
        schedule_coroutine(push_project_update(user_ids, _project_dict(project), title, message))


# ─── List Projects ────────────────────────────────────────────────────────────

@router.get("/", response_model=List[ProjectResponse])
def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    status_filter: Optional[ProjectStatus] = Query(None, alias="status"),
    client_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List projects. Clients only see their own; staff/admins see all."""
    query = db.query(Project)

    # Clients only see their own projects
    if current_user.role == UserRole.CLIENT:
        query = query.filter(Project.client_id == current_user.id)
    elif client_id:
        query = query.filter(Project.client_id == client_id)

    if status_filter:
        query = query.filter(Project.status == status_filter)

    return query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()


# ─── My Projects ──────────────────────────────────────────────────────────────

@router.get("/my", response_model=List[ProjectResponse])
def my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all projects associated with the logged-in user (as client or assigned staff)."""
    return (
        db.query(Project)
        .filter(
            (Project.client_id == current_user.id)
            | (Project.assigned_staff_id == current_user.id)
        )
        .order_by(Project.created_at.desc())
        .all()
    )


# ─── Get Project ──────────────────────────────────────────────────────────────

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Clients can only see their own projects
    if current_user.role == UserRole.CLIENT and project.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return project


# ─── Create Project ───────────────────────────────────────────────────────────

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new project. Clients create for themselves; staff/admins can create for any client."""
    new_project = Project(
        id=str(uuid.uuid4()),
        title=project_data.title,
        description=project_data.description,
        client_id=current_user.id,
        client_company_id=project_data.client_company_id,
        budget=project_data.budget,
        category=project_data.category,
        deadline=project_data.deadline,
        status=ProjectStatus.PLANNING,
        progress=0,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    _notify_change(new_project, "New Project Created", f'"{new_project.title}" has been created.')

    try:
        send_project_update_email(
            to_email=current_user.email,
            name=current_user.name,
            project_title=new_project.title,
            project_status=new_project.status.value,
            project_id=new_project.id,
        )
    except Exception as e:
        logger.warning(f"Project creation email failed: {e}")

    logger.info(f"Project '{new_project.title}' created by {current_user.email}")
    return new_project


# ─── Update Project ───────────────────────────────────────────────────────────

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Update a project — staff/admin only."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = project_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    db.commit()
    db.refresh(project)
    _notify_change(project, "Project Updated", f'"{project.title}" has been updated.')
    logger.info(f"Project '{project.title}' updated by {current_user.email}")
    return project


# ─── Update Progress ──────────────────────────────────────────────────────────

@router.patch("/{project_id}/progress", response_model=ProjectResponse)
def update_progress(
    project_id: str,
    progress_data: ProjectProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Update project progress percentage (0–100) — staff/admin only."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project.progress = progress_data.progress
    # Auto-complete if 100%
    if progress_data.progress == 100:
        project.status = ProjectStatus.COMPLETED

    db.commit()
    db.refresh(project)
    _notify_change(project, "Progress Updated", f'"{project.title}" is now {project.progress}% complete.')
    return project


# ─── Delete Project ───────────────────────────────────────────────────────────

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Delete a project — admin only."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    title = project.title
    db.delete(project)
    db.commit()
    logger.info(f"Project '{title}' deleted by {current_user.email}")
