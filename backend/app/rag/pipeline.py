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

        documents = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]

        filtered_docs = [
            doc for doc, dist in zip(documents, distances)
            if dist < 1.25
        ]

        return "\n".join(filtered_docs)