# pyrefly: ignore [missing-import]
from sentence_transformers import SentenceTransformer


class Embedder:

    _model = None

    @classmethod
    def get_model(cls):

        if cls._model is None:

            cls._model = SentenceTransformer(
                "all-MiniLM-L6-v2"
            )

        return cls._model

    @classmethod
    def embed(
        cls,
        text: str
    ):

        model = cls.get_model()

        return (
            model
            .encode(text)
            .tolist()
        )