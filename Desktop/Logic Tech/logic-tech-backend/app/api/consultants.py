from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.schemas import ConsultantProfileCreate, ConsultantProfileResponse
from app.models.models import ConsultantProfile
import uuid

router = APIRouter(prefix="/consultants", tags=["Consultants"])


@router.get("/", response_model=List[ConsultantProfileResponse])
def list_consultants(
    skip: int = 0,
    limit: int = 10,
    specialization: str = None,
    min_rating: float = 0,
    db: Session = Depends(get_db)
):
    """List all consultants with optional filtering"""
    query = db.query(ConsultantProfile)
    
    if specialization:
        query = query.filter(ConsultantProfile.specialization.ilike(f"%{specialization}%"))
    
    if min_rating > 0:
        query = query.filter(ConsultantProfile.rating >= min_rating)
    
    # Order by rating descending
    consultants = query.order_by(ConsultantProfile.rating.desc()).offset(skip).limit(limit).all()
    return consultants


@router.get("/{consultant_id}", response_model=ConsultantProfileResponse)
def get_consultant(consultant_id: str, db: Session = Depends(get_db)):
    """Get consultant by ID"""
    consultant = db.query(ConsultantProfile).filter(ConsultantProfile.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    return consultant


@router.post("/", response_model=ConsultantProfileResponse)
def create_consultant_profile(
    profile_data: ConsultantProfileCreate,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Create a consultant profile"""
    
    # Check if profile already exists
    existing = db.query(ConsultantProfile).filter(ConsultantProfile.user_id == user_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Consultant profile already exists for this user"
        )
    
    new_profile = ConsultantProfile(
        id=str(uuid.uuid4()),
        user_id=user_id,
        specialization=profile_data.specialization,
        bio=profile_data.bio,
        hourly_rate=profile_data.hourly_rate,
        rating=0.0,
        total_reviews=0,
        is_verified=False
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return new_profile


@router.put("/{consultant_id}", response_model=ConsultantProfileResponse)
def update_consultant_profile(
    consultant_id: str,
    profile_data: ConsultantProfileCreate,
    db: Session = Depends(get_db)
):
    """Update consultant profile"""
    consultant = db.query(ConsultantProfile).filter(ConsultantProfile.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    update_data = profile_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(consultant, key, value)
    
    db.commit()
    db.refresh(consultant)
    
    return consultant


@router.post("/{consultant_id}/verify")
def verify_consultant(consultant_id: str, db: Session = Depends(get_db)):
    """Verify a consultant (admin only)"""
    consultant = db.query(ConsultantProfile).filter(ConsultantProfile.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    consultant.is_verified = True
    db.commit()
    db.refresh(consultant)
    
    return {"detail": "Consultant verified", "consultant": consultant}


@router.post("/{consultant_id}/rate")
def rate_consultant(
    consultant_id: str,
    rating: float,
    db: Session = Depends(get_db)
):
    """Rate a consultant"""
    if not (0 <= rating <= 5):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 0 and 5"
        )
    
    consultant = db.query(ConsultantProfile).filter(ConsultantProfile.id == consultant_id).first()
    
    if not consultant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultant not found"
        )
    
    # Update average rating
    total_rating = (consultant.rating * consultant.total_reviews) + rating
    consultant.total_reviews += 1
    consultant.rating = total_rating / consultant.total_reviews
    
    db.commit()
    db.refresh(consultant)
    
    return {"detail": "Consultant rated", "new_rating": consultant.rating}
