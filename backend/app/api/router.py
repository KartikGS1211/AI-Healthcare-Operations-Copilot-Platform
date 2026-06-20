# pyrefly: ignore [missing-import]
from fastapi import APIRouter

from app.api.routes.patient import router as patient_router
from app.api.routes.reports import router as reports_router
from app.api.routes.prescription import router as prescription_router
from app.api.routes.interaction import router as interaction_router
from app.api.routes.rag import router as rag_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.workflow import router as workflow_router
from app.api.routes.auth import router as auth_router

api_router = APIRouter()

api_router.include_router(
    auth_router
)

api_router.include_router(
    patient_router
)

api_router.include_router(
    reports_router
)

api_router.include_router(
    prescription_router
)

api_router.include_router(
    interaction_router
)

api_router.include_router(
    rag_router
)

api_router.include_router(
    analytics_router
)

api_router.include_router(
    workflow_router
)

api_router.include_router(
    auth_router
)
