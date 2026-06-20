# pyrefly: ignore [missing-import]
from fastapi import (
    Depends,
    HTTPException,
    status
)

# pyrefly: ignore [missing-import]
from fastapi.security import (
    OAuth2PasswordBearer
)

from jose import (
    JWTError,
    jwt
)

from app.core.config import settings


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme)
):

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        email = payload.get("sub")
        role = payload.get("role")

        if email is None:

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def doctor_required(
    user=Depends(get_current_user)
):

    if user["role"] != "doctor":

        raise HTTPException(
            status_code=403,
            detail="Doctor access only"
        )

    return user


def patient_required(
    user=Depends(get_current_user)
):

    if user["role"] != "patient":

        raise HTTPException(
            status_code=403,
            detail="Patient access only"
        )

    return user