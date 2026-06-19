from app.rag.embedder import Embedder
from app.rag.retriever import Retriever

class RAGPipeline:

    @staticmethod
    def retrieve_context(
        query: str
    ):

        embedding =(
            Embedder.embed(query)
        )

        results=(
            Retriever.search(
                embedding
            )
        )

        documents=(
            results.get(
                "documents",
                [[]]
            )[0]
        )

        return "\n".join(
            documents
        )