# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from slowapi import _rate_limit_exceeded_handler
# pyrefly: ignore [missing-import]
from slowapi.errors import RateLimitExceeded
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from jose import jwt

from app.api.router import api_router
from app.core.security import limiter
from app.database.session import get_db
from app.core.config import settings
from app.agents.workflow import HealthcareWorkflow

app = FastAPI(
    title="AI Healthcare Operations Copilot"
)

# Configure slowapi
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-healthcare-operations-copilot-pl.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(api_router)

# GET endpoint for SSE streaming
@app.get("/api/workflow/analyze/{report_id}")
def analyze_report_stream(
    report_id: int,
    token: str = None,
    db: Session = Depends(get_db)
):
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token required"
        )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        if payload.get("role") != "doctor":
            raise HTTPException(
                status_code=403,
                detail="Doctor access only"
            )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return HealthcareWorkflow.run(report_id=report_id, db=db)
