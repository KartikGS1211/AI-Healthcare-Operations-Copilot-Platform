# pyrefly: ignore [missing-import]
import chromadb
# pyrefly: ignore [missing-import]
from chromadb import EmbeddingFunction
from app.rag.embedder import Embedder


class LightweightEmbeddingFunction(EmbeddingFunction):
    """
    A custom embedding function that forwards tokenization and text embedding tasks
    to our lightweight Hugging Face API-based Embedder. Passing this to Chroma prevents
    it from initializing its default local ONNX model (which loads onnxruntime and consumes large memory).
    """
    def __call__(self, input):
        # input is a list of strings/documents
        return [Embedder.embed(doc) for doc in input]

    def name(self) -> str:
        return "LightweightEmbeddingFunction"


class Retriever:

    client = chromadb.PersistentClient(
        path="chroma_db"
    )

    # Initialize the collection. Handle potential local conflicts gracefully.
    try:
        collection = client.get_or_create_collection(
            name="medical_knowledge",
            embedding_function=LightweightEmbeddingFunction()
        )
    except ValueError as e:
        if "Embedding function conflict" in str(e):
            # If the database already exists on disk with a different embedding function (e.g. locally),
            # retrieve the collection using the existing stored configuration.
            collection = client.get_collection(
                name="medical_knowledge"
            )
        else:
            raise e

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