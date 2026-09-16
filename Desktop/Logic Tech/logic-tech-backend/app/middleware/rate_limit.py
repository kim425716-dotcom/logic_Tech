"""
Global Rate Limiting Middleware.

Uses Redis to track request counts per IP address.
Implements a sliding window or fixed window rate limiter.
"""
from __future__ import annotations

import time
from collections.abc import Callable

import structlog
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.exceptions import RateLimitExceededError
from app.core.redis import get_connection_pool
from redis.asyncio import Redis

logger = structlog.get_logger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        # Skip rate limiting for tests or if Redis is not configured
        if settings.is_testing or not settings.REDIS_URL:
            return await call_next(request)

        # Get client IP
        client_ip = request.client.host if request.client else "127.0.0.1"
        
        # Use a more restrictive limit for auth endpoints
        is_auth = request.url.path.startswith(f"{settings.API_V1_PREFIX}/auth")
        limit = settings.AUTH_RATE_LIMIT_PER_MINUTE if is_auth else settings.RATE_LIMIT_PER_MINUTE
        window = 60  # seconds

        current_minute = int(time.time() // window)
        key = f"{settings.RATE_LIMIT_PREFIX}{client_ip}:{current_minute}"

        try:
            # Use connection pool directly
            redis = Redis(connection_pool=get_connection_pool())
            
            # Increment and set expiry in a pipeline
            async with redis.pipeline(transaction=True) as pipe:
                pipe.incr(key)
                pipe.expire(key, window * 2)  # Keep for 2 windows
                result = await pipe.execute()
                
            request_count = result[0]

            if request_count > limit:
                logger.warning("rate_limit.exceeded", ip=client_ip, path=request.url.path)
                # We return a JSON response directly instead of raising to avoid exception overhead
                # in the middleware layer.
                return JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "error_code": "RATE_LIMIT_EXCEEDED",
                        "message": "Too many requests. Please slow down.",
                        "details": {"retry_after": window},
                    },
                    headers={"Retry-After": str(window)},
                )

        except Exception as exc:
            # Fail open if Redis is down
            logger.error("rate_limit.redis_error", error=str(exc))
            
        return await call_next(request)
