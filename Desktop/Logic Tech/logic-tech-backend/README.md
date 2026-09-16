# Backend Documentation

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn app.main:app --reload
```

Server will be available at http://localhost:8000

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file with the following:
- DATABASE_URL: Your database connection string
- SECRET_KEY: JWT secret key
- ALGORITHM: JWT algorithm (default: HS256)

## Project Structure

- `app/core/` - Configuration, database, security
- `app/models/` - SQLAlchemy models
- `app/schemas/` - Pydantic schemas
- `app/routers/` - API endpoints
- `app/services/` - Business logic
- `app/repositories/` - Database queries

## Docker

Build:
```bash
docker build -t logic-tech-backend .
```

Run:
```bash
docker run -p 8000:8000 logic-tech-backend
```
