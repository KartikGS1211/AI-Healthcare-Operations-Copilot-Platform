# pyrefly: ignore [missing-import]
import chromadb
from app.rag.embedder import Embedder


class LightweightEmbeddingFunction:
    """
    A custom embedding function that forwards tokenization and text embedding tasks
    to our lightweight Hugging Face API-based Embedder. Passing this to Chroma prevents
    it from initializing its default local ONNX model (which loads onnxruntime and consumes large memory).
    """
    def __call__(self, input):
        # input is a list of strings/documents
        return [Embedder.embed(doc) for doc in input]


class Retriever:

    client = chromadb.PersistentClient(
        path="chroma_db"
    )

    collection = (
        client.get_or_create_collection(
            name="medical_knowledge",
            embedding_function=LightweightEmbeddingFunction()
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