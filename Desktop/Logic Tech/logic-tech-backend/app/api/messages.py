from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.schemas import MessageCreate, MessageResponse
from app.models.models import Message, User
from app.services.email_service import send_new_message_email
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/", response_model=List[MessageResponse])
def list_messages(
    user_id: str,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get messages for a user"""
    messages = db.query(Message).filter(
        (Message.sender_id == user_id) | (Message.recipient_id == user_id)
    ).offset(skip).limit(limit).all()
    return messages


@router.get("/{message_id}", response_model=MessageResponse)
def get_message(message_id: str, db: Session = Depends(get_db)):
    """Get a specific message"""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    return message


@router.post("/", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    sender_id: str,
    db: Session = Depends(get_db)
):
    """Send a new message"""
    new_message = Message(
        id=str(uuid.uuid4()),
        sender_id=sender_id,
        recipient_id=message_data.recipient_id,
        project_id=message_data.project_id,
        content=message_data.content,
        is_read=False
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    # Send email notification to recipient
    try:
        sender = db.query(User).filter(User.id == sender_id).first()
        recipient = db.query(User).filter(User.id == message_data.recipient_id).first()
        if sender and recipient:
            send_new_message_email(
                to_email=recipient.email,
                recipient_name=recipient.name,
                sender_name=sender.name,
                message_preview=message_data.content,
            )
    except Exception as e:
        logger.warning(f"New message email notification failed: {e}")

    return new_message


@router.put("/{message_id}/read")
def mark_message_read(message_id: str, db: Session = Depends(get_db)):
    """Mark a message as read"""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    message.is_read = True
    db.commit()
    db.refresh(message)
    
    return message


@router.delete("/{message_id}")
def delete_message(message_id: str, db: Session = Depends(get_db)):
    """Delete a message"""
    message = db.query(Message).filter(Message.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    db.delete(message)
    db.commit()
    
    return {"detail": "Message deleted"}
