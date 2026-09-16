from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import logging

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, require_staff_or_admin
from app.schemas.schemas import ClientCreate, ClientUpdate, ClientResponse
from app.models.models import Client, User

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/clients", tags=["Clients"])


# ─── List Clients ─────────────────────────────────────────────────────────────

@router.get("/", response_model=List[ClientResponse])
def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """List all client companies — staff/admin only."""
    query = db.query(Client)

    if is_active is not None:
        query = query.filter(Client.is_active == is_active)
    if search:
        query = query.filter(
            (Client.company_name.ilike(f"%{search}%"))
            | (Client.contact_person.ilike(f"%{search}%"))
            | (Client.email.ilike(f"%{search}%"))
        )

    return query.order_by(Client.created_at.desc()).offset(skip).limit(limit).all()


# ─── Get Client ───────────────────────────────────────────────────────────────

@router.get("/{client_id}", response_model=ClientResponse)
def get_client(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a client company record by ID."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return client


# ─── Create Client ────────────────────────────────────────────────────────────

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(
    client_data: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Create a new client company record — staff/admin only."""
    new_client = Client(
        id=str(uuid.uuid4()),
        company_name=client_data.company_name,
        contact_person=client_data.contact_person,
        email=client_data.email,
        phone=client_data.phone,
        website=client_data.website,
        address=client_data.address,
        user_id=client_data.user_id,
        created_by=current_user.id,
    )
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    logger.info(f"Client '{new_client.company_name}' created by {current_user.email}")
    return new_client


# ─── Update Client ────────────────────────────────────────────────────────────

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: str,
    client_data: ClientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    """Update a client company record — staff/admin only."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    update_data = client_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(client, key, value)

    db.commit()
    db.refresh(client)
    logger.info(f"Client '{client.company_name}' updated by {current_user.email}")
    return client


# ─── Deactivate Client ────────────────────────────────────────────────────────

@router.patch("/{client_id}/deactivate")
def deactivate_client(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Soft-delete (deactivate) a client company — admin only."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    client.is_active = False
    db.commit()
    logger.info(f"Client '{client.company_name}' deactivated by {current_user.email}")
    return {"detail": f"Client '{client.company_name}' has been deactivated"}


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(
    client_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """Hard-delete a client — admin only."""
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    db.delete(client)
    db.commit()
    logger.info(f"Client '{client.company_name}' deleted by {current_user.email}")
