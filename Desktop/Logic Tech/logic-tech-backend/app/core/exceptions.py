"""
Domain exception hierarchy for Logic Tech.

All business logic exceptions inherit from AppException, which carries
an HTTP status code, error code, and user-facing message. This allows
the global exception handler to produce consistent RFC 7807 responses.
"""
from __future__ import annotations

from http import HTTPStatus


class AppException(Exception):
    """Base exception for all application-level errors."""

    def __init__(
        self,
        message: str,
        status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR,
        error_code: str = "INTERNAL_ERROR",
        details: dict | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}


# ── 400 Bad Request ───────────────────────────────────────────────────────────

class ValidationError(AppException):
    """Input validation failed."""
    def __init__(self, message: str, details: dict | None = None) -> None:
        super().__init__(message, 400, "VALIDATION_ERROR", details)


class DuplicateError(AppException):
    """Resource already exists."""
    def __init__(self, resource: str, field: str = "id") -> None:
        super().__init__(
            f"{resource} with this {field} already exists.",
            409, "DUPLICATE_ERROR", {"resource": resource, "field": field},
        )


# ── 401 Unauthorized ──────────────────────────────────────────────────────────

class AuthenticationError(AppException):
    """Authentication failed."""
    def __init__(self, message: str = "Authentication required.") -> None:
        super().__init__(message, 401, "AUTHENTICATION_ERROR")


class InvalidCredentialsError(AppException):
    """Invalid email/password combination."""
    def __init__(self) -> None:
        super().__init__("Invalid email or password.", 401, "INVALID_CREDENTIALS")


class TokenExpiredError(AppException):
    """JWT token has expired."""
    def __init__(self) -> None:
        super().__init__("Token has expired.", 401, "TOKEN_EXPIRED")


class TokenInvalidError(AppException):
    """JWT token is invalid or malformed."""
    def __init__(self) -> None:
        super().__init__("Invalid token.", 401, "TOKEN_INVALID")


class TokenRevokedError(AppException):
    """Token has been revoked (logout/rotation)."""
    def __init__(self) -> None:
        super().__init__("Token has been revoked.", 401, "TOKEN_REVOKED")


# ── 403 Forbidden ─────────────────────────────────────────────────────────────

class PermissionDeniedError(AppException):
    """User lacks permission for this action."""
    def __init__(self, action: str = "perform this action") -> None:
        super().__init__(
            f"You do not have permission to {action}.",
            403, "PERMISSION_DENIED",
        )


class AccountLockedError(AppException):
    """Account is locked due to too many failed attempts."""
    def __init__(self, minutes_remaining: int | None = None) -> None:
        msg = "Account temporarily locked due to too many failed login attempts."
        if minutes_remaining:
            msg += f" Try again in {minutes_remaining} minutes."
        super().__init__(msg, 403, "ACCOUNT_LOCKED", {"minutes_remaining": minutes_remaining})


class EmailNotVerifiedError(AppException):
    """Email address has not been verified."""
    def __init__(self) -> None:
        super().__init__("Please verify your email address.", 403, "EMAIL_NOT_VERIFIED")


# ── 404 Not Found ─────────────────────────────────────────────────────────────

class NotFoundError(AppException):
    """Requested resource does not exist."""
    def __init__(self, resource: str, identifier: str | None = None) -> None:
        detail = f" with id '{identifier}'" if identifier else ""
        super().__init__(
            f"{resource}{detail} not found.",
            404, "NOT_FOUND", {"resource": resource},
        )


# ── 409 Conflict ──────────────────────────────────────────────────────────────

class ConflictError(AppException):
    """Operation conflicts with current resource state."""
    def __init__(self, message: str) -> None:
        super().__init__(message, 409, "CONFLICT_ERROR")


# ── 422 Unprocessable Entity ──────────────────────────────────────────────────

class BusinessRuleError(AppException):
    """Business rule violation."""
    def __init__(self, message: str) -> None:
        super().__init__(message, 422, "BUSINESS_RULE_ERROR")


# ── 429 Too Many Requests ─────────────────────────────────────────────────────

class RateLimitExceededError(AppException):
    """Rate limit exceeded."""
    def __init__(self, retry_after: int = 60) -> None:
        super().__init__(
            "Too many requests. Please slow down.",
            429, "RATE_LIMIT_EXCEEDED", {"retry_after": retry_after},
        )
