from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import logging

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_staff_or_admin
from app.schemas.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.models.models import Task, Project, User, UserRole, TaskStatus

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Tasks"])


def _get_project_or_404(project_id: str, db: Session) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


# ─── List Tasks ───────────────────────────────────────────────────────────────

@router.get("/projects/{project_id}/tasks", response_model=List[TaskResponse])
def list_tasks(
    project_id: str,
    status_filter: Optional[TaskStatus] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all tasks for a project. Clients can only see tasks in their own projects."""
    project = _get_project_or_404(project_id, db)

    if current_user.role == UserRole.CLIENT and project.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    query = db.query(Task).filter(Task.project_id == project_id)
    if status_filter:
        query = query.filter(Task.status == status_filter)

    return query.order_by(Task.order.asc(), Task.created_at.asc()).all()


# ─── Create Task ──────────────────────────────────────────────────────────────

@router.post(
    "/projects/{project_id}/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    project_id: str,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Create a task for a project — staff/admin only."""
    _get_project_or_404(project_id, db)

    new_task = Task(
        id=str(uuid.uuid4()),
        project_id=project_id,
        title=task_data.title,
        description=task_data.description,
        assigned_to=task_data.assigned_to,
        due_date=task_data.due_date,
        order=task_data.order or 0,
        status=TaskStatus.TODO,
        is_done=False,
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    logger.info(f"Task '{new_task.title}' created in project {project_id} by {current_user.email}")
    return new_task


# ─── Update Task ──────────────────────────────────────────────────────────────

@router.put("/projects/{project_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    project_id: str,
    task_id: str,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Update a task — staff/admin only."""
    _get_project_or_404(project_id, db)
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)

    # Sync is_done with status
    if "status" in update_data:
        task.is_done = (task.status == TaskStatus.DONE)

    db.commit()
    db.refresh(task)
    return task


# ─── Toggle Task Done ─────────────────────────────────────────────────────────

@router.patch("/projects/{project_id}/tasks/{task_id}/toggle", response_model=TaskResponse)
def toggle_task(
    project_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Toggle a task between done ↔ todo. Any authenticated user can toggle."""
    _get_project_or_404(project_id, db)
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    task.is_done = not task.is_done
    task.status = TaskStatus.DONE if task.is_done else TaskStatus.TODO
    db.commit()
    db.refresh(task)
    logger.info(
        f"Task '{task.title}' toggled to {'done' if task.is_done else 'todo'} by {current_user.email}"
    )
    return task


# ─── Delete Task ──────────────────────────────────────────────────────────────

@router.delete(
    "/projects/{project_id}/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    project_id: str,
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Delete a task — staff/admin only."""
    _get_project_or_404(project_id, db)
    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    db.delete(task)
    db.commit()
    logger.info(f"Task '{task.title}' deleted by {current_user.email}")
