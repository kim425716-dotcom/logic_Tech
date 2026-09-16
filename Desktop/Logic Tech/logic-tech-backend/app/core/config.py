"""
Configuration management using Pydantic Settings v2.

All settings are loaded from environment variables with strong validation.
This is the single source of truth for all application configuration.
"""
from __future__ import annotations

import secrets
from enum import Enum
from functools import lru_cache
from typing import Any

from pydantic import AnyHttpUrl, EmailStr, PostgresDsn, RedisDsn, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    """Application runtime environment enumeration."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables and .env file.

    All fields have sensible defaults for local development. In production,
    sensitive fields (SECRET_KEY, POSTGRES_PASSWORD, etc.) MUST be overridden
    via environment variables — never committed to version control.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = "Logic Tech API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Logic Tech Enterprise IT Platform API"
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    # ── Security ─────────────────────────────────────────────────────────────
    SECRET_KEY: str = secrets.token_urlsafe(64)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    EMAIL_VERIFICATION_EXPIRE_HOURS: int = 24
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    MAX_FAILED_LOGIN_ATTEMPTS: int = 5
    ACCOUNT_LOCKOUT_MINUTES: int = 30

    # ── Database ─────────────────────────────────────────────────────────────
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "logictech"
    POSTGRES_PASSWORD: str = "logictech_dev"
    POSTGRES_DB: str = "logic_tech"
    DATABASE_URL: str | None = "sqlite:///./logic_tech.db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_POOL_TIMEOUT: int = 30
    SQLALCHEMY_ECHO: bool = False

    @model_validator(mode="after")
    def assemble_db_url(self) -> "Settings":
        """Assemble the DATABASE_URL from components if not explicitly set."""
        if not self.DATABASE_URL:
            self.DATABASE_URL = "sqlite:///./logic_tech.db"
        else:
            self.DATABASE_URL = str(self.DATABASE_URL)
        return self

    # ── Redis ─────────────────────────────────────────────────────────────────
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str | None = None
    REDIS_DB: int = 0
    REDIS_URL: str | None = None
    TOKEN_BLOCKLIST_PREFIX: str = "blocklist:"
    RATE_LIMIT_PREFIX: str = "ratelimit:"

    @model_validator(mode="after")
    def assemble_redis_url(self) -> "Settings":
        """Assemble the REDIS_URL from components if not explicitly set."""
        if not self.REDIS_URL:
            auth = f":{self.REDIS_PASSWORD}@" if self.REDIS_PASSWORD else ""
            self.REDIS_URL = f"redis://{auth}{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        else:
            self.REDIS_URL = str(self.REDIS_URL)
        return self

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        # Production — Vercel auto-deploy URLs
        "https://logic-tech-frontend.vercel.app",
        "https://logic-tech.vercel.app",
        # Production — custom domain (update when you have one)
        "https://logictech.co.ke",
        "https://www.logictech.co.ke",
    ]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]

    # ── Rate Limiting ─────────────────────────────────────────────────────────
    RATE_LIMIT_PER_MINUTE: int = 60
    AUTH_RATE_LIMIT_PER_MINUTE: int = 10

    # ── Email ─────────────────────────────────────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_TLS: bool = True
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_NAME: str = "Logic Tech"
    EMAILS_FROM_EMAIL: EmailStr = "noreply@logictech.co.ke"
    EMAIL_ENABLED: bool = False

    # ── Frontend ──────────────────────────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:5173"

    # ── Pagination ────────────────────────────────────────────────────────────
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    # ── File Storage ──────────────────────────────────────────────────────────
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: list[str] = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"]

    # ── Computed Properties ───────────────────────────────────────────────────

    @property
    def is_development(self) -> bool:
        """True when running in the development environment."""
        return self.ENVIRONMENT == Environment.DEVELOPMENT

    @property
    def is_production(self) -> bool:
        """True when running in the production environment."""
        return self.ENVIRONMENT == Environment.PRODUCTION

    @property
    def is_testing(self) -> bool:
        """True when running under pytest or the testing environment."""
        return self.ENVIRONMENT == Environment.TESTING

    @property
    def max_file_size_bytes(self) -> int:
        """Maximum upload file size in bytes."""
        return self.MAX_FILE_SIZE_MB * 1024 * 1024

    @property
    def API_TITLE(self) -> str:
        return self.APP_NAME

    @property
    def API_DESCRIPTION(self) -> str:
        return self.APP_DESCRIPTION

    @property
    def API_VERSION(self) -> str:
        return self.APP_VERSION



@lru_cache
def get_settings() -> Settings:
    """
    Return the cached Settings singleton.

    Uses lru_cache so the .env file is read and validated exactly once
    per process, regardless of how many times this function is called.
    """
    return Settings()


settings: Settings = get_settings()
