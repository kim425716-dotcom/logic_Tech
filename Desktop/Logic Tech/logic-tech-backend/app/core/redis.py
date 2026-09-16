"""
Redis connection pool and client utilities.

Provides a connection pool for Redis operations including:
- JWT token blocklisting (logout/revocation)
- Rate limiting counters
- Session caching
- Celery message broker
"""
from __future__ import annotations

import structlog
from redis.asyncio import ConnectionPool, Redis
from redis.asyncio.retry import Retry
from redis.backoff import ExponentialBackoff
from redis.exceptions import ConnectionError, TimeoutError

from app.core.config import settings

logger = structlog.get_logger(__name__)

_pool: ConnectionPool | None = None


def get_connection_pool() -> ConnectionPool:
    """Get or create the Redis connection pool (singleton)."""
    global _pool
    if _pool is None:
        retry = Retry(ExponentialBackoff(), retries=3)
        _pool = ConnectionPool.from_url(
            str(settings.REDIS_URL),
            max_connections=50,
            decode_responses=True,
            retry=retry,
            retry_on_error=[ConnectionError, TimeoutError],
        )
        logger.info("redis.pool.created", url=str(settings.REDIS_URL))
    return _pool


async def get_redis() -> Redis:
    """FastAPI dependency: returns a Redis client from the connection pool."""
    return Redis(connection_pool=get_connection_pool())


async def check_redis_connection() -> bool:
    """Health check: verify Redis connectivity."""
    try:
        client = Redis(connection_pool=get_connection_pool())
        await client.ping()
        await client.aclose()
        return True
    except Exception as exc:
        logger.error("redis.health_check.failed", error=str(exc))
        return False


class TokenBlocklist:
    """Manages the JWT token revocation blocklist in Redis."""

    def __init__(self, redis: Redis) -> None:
        self._redis = redis

    async def add(self, jti: str, expires_in_seconds: int) -> None:
        """Add a token JTI to the blocklist with TTL."""
        key = f"{settings.TOKEN_BLOCKLIST_PREFIX}{jti}"
        await self._redis.setex(key, expires_in_seconds, "revoked")
        logger.info("token.blocklisted", jti=jti)

    async def is_blocked(self, jti: str) -> bool:
        """Check if a token JTI is in the blocklist."""
        key = f"{settings.TOKEN_BLOCKLIST_PREFIX}{jti}"
        return await self._redis.exists(key) == 1
