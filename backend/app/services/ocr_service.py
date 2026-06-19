# pyrefly: ignore [missing-import]
import fitz
# pyrefly: ignore [missing-import]
import pytesseract

# pyrefly: ignore [missing-import]
from PIL import Image

class OCRServices:

    @staticmethod
    def extract_pdf_text(
        file_path:str
    ) -> str:

        try:
            document= fitz.open(file_path)

            extracted_text=""

            for page in document:
                extracted_text += page.get_text()

            document.close()

            return extracted_text.strip()

        except Exception as e:
            raise Exception(
                f"PDF OCR Failed: {str(e)}"
            )

    @staticmethod
    def extract_image_text(
        file_path:str
    ) -> str:

        try:
            image =Image.open(file_path)

            text = pytesseract.image_to_string(
                image 
            )

            text=pytesseract.image_to_string(
                image
            )

            return text.strip()

        except Exception as e:
            raise Exception(
                f"Image OCR Failed:{str(e)}"
            )