"""
Standardized API response envelopes.

All API responses follow a consistent envelope:
- Success: {"success": true, "data": ..., "meta": {...}}
- Error: RFC 7807 Problem Details format
"""
from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class PaginationMeta(BaseModel):
    """Pagination metadata included in list responses."""
    model_config = ConfigDict(frozen=True)

    page: int
    page_size: int
    total_items: int
    total_pages: int
    has_next: bool
    has_previous: bool


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response envelope."""
    success: bool = True
    data: T
    message: str | None = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated list response envelope."""
    success: bool = True
    data: list[T]
    meta: PaginationMeta


class ErrorResponse(BaseModel):
    """RFC 7807 Problem Details error response."""
    success: bool = False
    error_code: str
    message: str
    details: dict[str, Any] = {}
    request_id: str | None = None


def success(data: Any, message: str | None = None) -> dict[str, Any]:
    """Build a success response dict."""
    return {"success": True, "data": data, "message": message}


def paginated(
    data: list[Any],
    page: int,
    page_size: int,
    total_items: int,
) -> dict[str, Any]:
    """Build a paginated response dict."""
    total_pages = max(1, -(-total_items // page_size))  # Ceiling division
    return {
        "success": True,
        "data": data,
        "meta": {
            "page": page,
            "page_size": page_size,
            "total_items": total_items,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        },
    }
