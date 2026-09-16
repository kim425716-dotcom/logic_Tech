from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.core.logging import setup_logging

# Setup structured logging before anything else
setup_logging()

# Import all models so SQLAlchemy creates all tables
import app.models.models  # noqa: F401

# ─── Routers ─────────────────────────────────────────────────────────────────
from app.api import auth, projects, messages, consultants, websocket
from app.api import users, clients, tasks

# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.on_event("startup")
def on_startup():
    """Initialize database tables on application startup."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        import structlog
        structlog.get_logger().error("db.init_failed", error=str(e))

# ─── Middleware ───────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# ─── Include Routers ──────────────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api")
app.include_router(users.router,       prefix="/api")
app.include_router(clients.router,     prefix="/api")
app.include_router(projects.router,    prefix="/api")
app.include_router(tasks.router,       prefix="/api")
app.include_router(messages.router)
app.include_router(consultants.router)
app.include_router(websocket.router)


# ─── Root Endpoints ───────────────────────────────────────────────────────────
@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint — API info."""
    return {
        "message": "Welcome to Logic Tech API",
        "version": settings.API_VERSION,
        "docs": "/docs",
    }


@app.get("/health", tags=["Root"])
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
