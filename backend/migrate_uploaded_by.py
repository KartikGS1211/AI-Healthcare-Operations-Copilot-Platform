from app.database.session import engine
# pyrefly: ignore [missing-import]
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE reports ADD COLUMN IF NOT EXISTS uploaded_by VARCHAR(255)"))
    conn.execute(text("CREATE INDEX IF NOT EXISTS ix_reports_uploaded_by ON reports (uploaded_by)"))
    conn.commit()
    print("✅ Migration done! uploaded_by column added to reports table.")
