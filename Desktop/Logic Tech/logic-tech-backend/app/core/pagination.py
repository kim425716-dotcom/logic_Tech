"""
Pagination utilities for API list endpoints.

Supports offset-based pagination with configurable page size limits.
All list endpoints should use PaginationParams as a FastAPI dependency.
"""
from __future__ import annotations

from fastapi import Query

from app.core.config import settings


class PaginationParams:
    """
    FastAPI dependency class for pagination parameters.

    Usage:
        @router.get("/")
        async def list_items(pagination: PaginationParams = Depends()):
            offset = pagination.offset
            limit = pagination.page_size
    """

    def __init__(
        self,
        page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
        page_size: int = Query(
            default=settings.DEFAULT_PAGE_SIZE,
            ge=1,
            le=settings.MAX_PAGE_SIZE,
            description="Items per page",
        ),
    ) -> None:
        self.page = page
        self.page_size = page_size

    @property
    def offset(self) -> int:
        """Calculate the SQL OFFSET value."""
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Alias for page_size, used with SQLAlchemy LIMIT."""
        return self.page_size
