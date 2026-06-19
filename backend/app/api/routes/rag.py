# pyrefly: ignore [missing-import]
from fastapi import APIRouter

from app.rag.pipeline import RAGPipeline

router=APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

@router.post("/search")
def search_knowledge_base(
    query: str
):

    context =(
        RAGPipeline.retrieve_context(
            query
        )
    )

    return {
        "query": query,
        "retrieved_context": context
    }