import os
import shutil
from uuid import uuid4

UPLOAD_DIR = "uploads/reports"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


def save_report_file(file):

    extension = file.filename.split(".")[-1]

    unique_name = (
        f"{uuid4()}.{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_name
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return unique_name, file_path