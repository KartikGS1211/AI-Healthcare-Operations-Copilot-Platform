# pyrefly: ignore [missing-import]
import chromadb


class Retriever:

    client = chromadb.PersistentClient(
        path="chroma_db"
    )

    collection = (
        client.get_or_create_collection(
            name="medical_knowledge"
        )
    )

    @classmethod
    def search(
        cls,
        query_embedding,
        n_results: int = 5
    ):

        return (
            cls.collection.query(
                query_embeddings=[
                    query_embedding
                ],
                n_results=n_results
            )
        )