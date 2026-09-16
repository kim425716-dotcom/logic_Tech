"""
Database engine, session factory, and dependency injection.
"""
from __future__ import annotations

from typing import Generator
import structlog
from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

from app.core.config import settings

logger = structlog.get_logger(__name__)


class Base(DeclarativeBase):
    """SQLAlchemy declarative base with type annotation support."""
    pass


db_url = str(settings.DATABASE_URL or "sqlite:///./logic_tech.db")
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    echo=settings.SQLALCHEMY_ECHO,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency providing a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


get_async_session = get_db


def check_database_connection() -> bool:
    """Health check: verify database connectivity."""
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.error("database.health_check.failed", error=str(exc))
        return False

