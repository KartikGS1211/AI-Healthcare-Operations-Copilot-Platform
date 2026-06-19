# pyrefly: ignore [missing-import]
from groq import Groq

from app.core.config import settings


class GroqService:

    _client = None

    @classmethod
    def get_client(cls):

        if cls._client is None:

            api_key = (
                settings.GROQ_API_KEY
            )

            cls._client = Groq(
                api_key=api_key
            )

        return cls._client

    @classmethod
    def generate_response(
        cls,
        prompt: str,
        temperature: float = 0.2,
        max_tokens: int = 1024
    ) -> str:

        client = cls.get_client()

        response = (
            client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
        )

        return (
            response
            .choices[0]
            .message
            .content
        )

    @classmethod
    def generate_summary(
        cls,
        prompt: str
    ) -> str:

        return cls.generate_response(
            prompt=prompt,
            temperature=0.2,
            max_tokens=1024
        )