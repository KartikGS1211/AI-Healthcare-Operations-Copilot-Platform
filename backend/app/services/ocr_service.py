# pyrefly: ignore [missing-import]
import fitz
# pyrefly: ignore [missing-import]
import pytesseract
import os
from fastapi import HTTPException, status

# pyrefly: ignore [missing-import]
from PIL import Image

class FileMock:
    def __init__(self, file_path: str):
        self.file_path = file_path
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            self.content_type = "application/pdf"
        elif ext == ".png":
            self.content_type = "image/png"
        elif ext in [".jpg", ".jpeg"]:
            self.content_type = "image/jpeg"
        else:
            self.content_type = "unknown"
        self.file = open(file_path, "rb")

    def __del__(self):
        try:
            self.file.close()
        except Exception:
            pass

def validate_upload(file):
    allowed_types = ["application/pdf", "image/jpeg", "image/png"]
    content_type = getattr(file, "content_type", None)
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF, JPEG, and PNG are allowed."
        )

    fileobj = getattr(file, "file", None)
    if fileobj:
        current_pos = fileobj.tell()
        fileobj.seek(0, 2)
        file_size = fileobj.tell()
        fileobj.seek(current_pos)
    else:
        current_pos = file.tell()
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(current_pos)

    if file_size > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 10 MB."
        )

class OCRServices:

    @staticmethod
    def extract_pdf_text(
        file_path:str
    ) -> str:

        # Call validation before OCR processing begins
        validate_upload(FileMock(file_path))

        try:
            document= fitz.open(file_path)

            extracted_text=""

            for page in document:
                extracted_text += page.get_text()

            document.close()

            return extracted_text.strip()

        except HTTPException:
            raise
        except Exception as e:
            raise Exception(
                f"PDF OCR Failed: {str(e)}"
            )

    @staticmethod
    def extract_image_text(
        file_path:str
    ) -> str:

        # Call validation before OCR processing begins
        validate_upload(FileMock(file_path))

        try:
            image =Image.open(file_path)

            text = pytesseract.image_to_string(
                image 
            )

            text=pytesseract.image_to_string(
                image
            )

            return text.strip()

        except HTTPException:
            raise
        except Exception as e:
            raise Exception(
                f"Image OCR Failed:{str(e)}"
            )