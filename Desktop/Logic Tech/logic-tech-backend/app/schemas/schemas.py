from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum


# ─── Enums ──────────────────────────────────────────────────────────────────

class UserRole(str, Enum):
    ADMIN = "admin"
    STAFF = "staff"
    CLIENT = "client"
    CONSULTANT = "consultant"


class ProjectStatus(str, Enum):
    PLANNING = "planning"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class MaintenancePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MaintenanceStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    PAID = "paid"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    user: Optional["UserResponse"] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


# ─── User Schemas ─────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.CLIENT
    phone: Optional[str] = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    role: UserRole
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Client Schemas ───────────────────────────────────────────────────────────

class ClientCreate(BaseModel):
    company_name: str
    contact_person: str
    email: EmailStr
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None
    user_id: Optional[str] = None   # link to an existing user account


class ClientUpdate(BaseModel):
    company_name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    address: Optional[str] = None


class ClientResponse(BaseModel):
    id: str
    company_name: str
    contact_person: str
    email: str
    phone: Optional[str]
    website: Optional[str]
    address: Optional[str]
    user_id: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ─── Project Schemas ──────────────────────────────────────────────────────────

class ProjectCreate(BaseModel):
    title: str
    description: str
    budget: float
    category: Optional[str] = None
    deadline: Optional[datetime] = None
    client_company_id: Optional[str] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    assigned_staff_id: Optional[str] = None
    consultant_id: Optional[str] = None  # backward compat
    budget: Optional[float] = None
    deadline: Optional[datetime] = None
    category: Optional[str] = None


class ProjectProgressUpdate(BaseModel):
    progress: int

    @field_validator("progress")
    @classmethod
    def validate_progress(cls, v: int) -> int:
        if not 0 <= v <= 100:
            raise ValueError("Progress must be between 0 and 100")
        return v


class ProjectResponse(BaseModel):
    id: str
    title: str
    description: str
    client_id: str
    client_company_id: Optional[str]
    assigned_staff_id: Optional[str]
    consultant_id: Optional[str]
    budget: float
    deadline: Optional[datetime]
    progress: int
    status: ProjectStatus
    category: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Task Schemas ─────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    order: Optional[int] = 0


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    order: Optional[int] = None


class TaskResponse(BaseModel):
    id: str
    project_id: str
    title: str
    description: Optional[str]
    status: TaskStatus
    is_done: bool
    order: int
    assigned_to: Optional[str]
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Maintenance Schemas ──────────────────────────────────────────────────────

class MaintenanceCreate(BaseModel):
    client_id: str
    website: str
    issue: str
    priority: MaintenancePriority = MaintenancePriority.MEDIUM


class MaintenanceUpdate(BaseModel):
    website: Optional[str] = None
    issue: Optional[str] = None
    priority: Optional[MaintenancePriority] = None
    status: Optional[MaintenanceStatus] = None
    assigned_developer_id: Optional[str] = None
    resolution_notes: Optional[str] = None


class MaintenanceResponse(BaseModel):
    id: str
    client_id: str
    website: str
    issue: str
    priority: MaintenancePriority
    status: MaintenanceStatus
    assigned_developer_id: Optional[str]
    resolution_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Service Schemas ──────────────────────────────────────────────────────────

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    is_active: Optional[bool] = None


class ServiceResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: Optional[float]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Invoice Schemas ──────────────────────────────────────────────────────────

class InvoiceLineItem(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float


class InvoiceCreate(BaseModel):
    client_id: str
    project_id: Optional[str] = None
    amount: float
    tax: float = 0.0
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    line_items: Optional[List[InvoiceLineItem]] = None


class InvoiceUpdate(BaseModel):
    status: Optional[InvoiceStatus] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    paid_at: Optional[datetime] = None


class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    client_id: str
    project_id: Optional[str]
    amount: float
    tax: float
    total_amount: float
    status: InvoiceStatus
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    notes: Optional[str]
    line_items: Optional[List[Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─── Notification Schemas ─────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    notif_type: str
    is_read: bool
    link: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Message Schemas ──────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    recipient_id: str
    content: str
    project_id: Optional[str] = None


class MessageResponse(BaseModel):
    id: str
    sender_id: str
    recipient_id: str
    project_id: Optional[str]
    content: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Consultant Schemas (backward compat) ────────────────────────────────────

class ConsultantProfileCreate(BaseModel):
    specialization: str
    bio: Optional[str] = None
    hourly_rate: float


class ConsultantProfileResponse(BaseModel):
    id: str
    user_id: str
    specialization: str
    bio: Optional[str]
    hourly_rate: float
    rating: float
    total_reviews: int
    is_verified: bool

    class Config:
        from_attributes = True


# Update forward ref
TokenResponse.model_rebuild()
