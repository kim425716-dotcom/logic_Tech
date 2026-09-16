"""
Generic Base Repository using SQLAlchemy 2.0.

Provides standard CRUD operations for all models.
Subclasses should inherit from BaseRepository and specify their model.
"""
from __future__ import annotations

import uuid
from typing import Any, Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Base repository providing generic CRUD operations.

    Args:
        model: The SQLAlchemy model class.
        session: The async database session.
    """

    def __init__(self, model: type[ModelType], session: AsyncSession) -> None:
        self.model = model
        self.session = session

    async def get_by_id(self, id: uuid.UUID | str) -> ModelType | None:
        """Fetch a single record by its primary key ID."""
        if isinstance(id, str):
            id = uuid.UUID(id)
        stmt = select(self.model).where(self.model.id == id)
        # If the model has soft delete, only return active records
        if hasattr(self.model, "is_deleted"):
            stmt = stmt.where(self.model.is_deleted == False)

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(
        self,
        *,
        offset: int = 0,
        limit: int = 100,
        include_deleted: bool = False,
    ) -> list[ModelType]:
        """Fetch a paginated list of records."""
        stmt = select(self.model)

        if hasattr(self.model, "is_deleted") and not include_deleted:
            stmt = stmt.where(self.model.is_deleted == False)

        stmt = stmt.offset(offset).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count(self, include_deleted: bool = False) -> int:
        """Count total records."""
        stmt = select(func.count()).select_from(self.model)

        if hasattr(self.model, "is_deleted") and not include_deleted:
            stmt = stmt.where(self.model.is_deleted == False)

        result = await self.session.execute(stmt)
        return result.scalar_one() or 0

    def add(self, obj: ModelType) -> ModelType:
        """Add a new record to the session (requires commit)."""
        self.session.add(obj)
        return obj

    async def delete(self, obj: ModelType) -> None:
        """
        Soft delete if supported, otherwise hard delete.
        """
        if hasattr(obj, "soft_delete"):
            obj.soft_delete()  # type: ignore
        else:
            await self.session.delete(obj)
