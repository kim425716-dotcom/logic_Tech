"""
Security utilities: password hashing, JWT token creation and verification.

Security decisions:
- Argon2id: memory-hard, OWASP-recommended, resistant to GPU/ASIC attacks
- Short-lived JWT access tokens (15 min) + rotating refresh tokens (7 days)
- JTI (JWT ID) on every token for blocklist-based revocation
- Refresh token families: detects replay attacks and revokes all family tokens
"""
from __future__ import annotations

import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

import structlog
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from jose import JWTError, jwt

from app.core.config import settings

logger = structlog.get_logger(__name__)

# Argon2id hasher — OWASP recommended parameters
_hasher = PasswordHasher(
    time_cost=3,        # Number of iterations
    memory_cost=65536,  # 64 MB memory usage
    parallelism=4,      # Number of parallel threads
    hash_len=32,        # Output hash length
    salt_len=16,        # Salt length
)


# ── Password Hashing ─────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash a plaintext password using Argon2id."""
    return _hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against an Argon2id hash.

    Returns False instead of raising on mismatch to prevent timing oracle attacks.
    """
    try:
        return _hasher.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def password_needs_rehash(hashed_password: str) -> bool:
    """Check if a password hash needs to be upgraded (Argon2id parameters changed)."""
    return _hasher.check_needs_rehash(hashed_password)


# ── JWT Tokens ────────────────────────────────────────────────────────────────

def create_access_token(
    subject: str,
    role: str,
    extra_claims: dict[str, Any] | None = None,
) -> tuple[str, str]:
    """
    Create a signed JWT access token.

    Returns (token_string, jti) where jti is the unique token identifier
    used for revocation via the blocklist.
    """
    jti = secrets.token_urlsafe(32)
    now = datetime.now(UTC)
    expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: dict[str, Any] = {
        "sub": subject,          # Subject: user ID
        "role": role,            # User role for RBAC
        "jti": jti,              # JWT ID for revocation
        "iat": now,              # Issued at
        "exp": expire,           # Expiry
        "type": "access",
    }
    if extra_claims:
        payload.update(extra_claims)

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, jti


def decode_access_token(token: str) -> dict[str, Any] | None:
    """
    Decode and verify a JWT access token.

    Returns the payload dict if valid, None if invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"verify_exp": True},
        )
        if payload.get("type") != "access":
            logger.warning("token.invalid_type", token_type=payload.get("type"))
            return None
        return payload
    except JWTError as exc:
        logger.debug("token.decode_failed", error=str(exc))
        return None


# ── Refresh Tokens ────────────────────────────────────────────────────────────

def generate_refresh_token() -> tuple[str, str]:
    """
    Generate a cryptographically secure refresh token.

    Returns (raw_token, token_hash) where:
    - raw_token is sent to the client (never stored)
    - token_hash is stored in the database
    """
    raw_token = secrets.token_urlsafe(64)
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    return raw_token, token_hash


def hash_refresh_token(raw_token: str) -> str:
    """Hash a raw refresh token for database storage/lookup."""
    return hashlib.sha256(raw_token.encode()).hexdigest()


# ── One-Time Tokens (Email Verification / Password Reset) ─────────────────────

def create_email_token(email: str, token_type: str = "verify") -> str:
    """Create a short-lived JWT token for email verification or password reset."""
    expire_minutes = (
        settings.PASSWORD_RESET_EXPIRE_MINUTES
        if token_type == "reset"
        else settings.EMAIL_VERIFICATION_EXPIRE_HOURS * 60
    )
    expire = datetime.now(UTC) + timedelta(minutes=expire_minutes)
    payload = {
        "sub": email,
        "type": token_type,
        "exp": expire,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_email_token(token: str, expected_type: str) -> str | None:
    """
    Decode a one-time email token.

    Returns the email address if valid, None if invalid/expired/wrong type.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != expected_type:
            return None
        return payload.get("sub")
    except JWTError:
        return None
