# pyrefly: ignore [missing-import]
from sqlalchemy import text

# pyrefly: ignore [missing-import]
from app.database.connection import engine


try:
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT 1")
        )

        print(result.scalar())

    print("Database Connected Successfully")

except Exception as e:
    print("Database Connection Failed")
    print(e)