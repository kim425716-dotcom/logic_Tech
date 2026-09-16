"""
Request ID middleware.

Injects a unique request ID (UUID) into every HTTP request state
and binds it to the structlog context for distributed tracing.
Also adds the X-Request-ID header to the response.
"""
from __future__ import annotations

import uuid
from collections.abc import Callable

import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        # Generate or extract request ID
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        
        # Attach to request state for use in dependencies/routers
        request.state.request_id = request_id

        # Bind to structured logger context
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(request_id=request_id)

        # Process the request
        response: Response = await call_next(request)

        # Inject into response headers
        response.headers["X-Request-ID"] = request_id
        return response
