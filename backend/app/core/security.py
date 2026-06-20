from datetime import datetime, timedelta

from jose import jwt

# pyrefly: ignore [missing-import]
import bcrypt

from app.core.config import settings

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    password_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(password_bytes, hashed_bytes)

def create_access_token(data: dict):
    expire = (
        datetime.utcnow()
        + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )
    data.update(
        {"exp": expire}
    )
    return jwt.encode(
        data,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )