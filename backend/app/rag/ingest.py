import pandas as pd

from app.rag.embedder import Embedder
from app.rag.retriever import Retriever


def ingest_csv(
    file_path: str,
    text_columns: list[str]
):

    df = pd.read_csv(file_path)

    for index, row in df.iterrows():

        text = " | ".join(
            str(row[col])
            for col in text_columns
        )

        embedding = (
            Embedder.embed(text)
        )

        Retriever.collection.add(
            ids=[f"{file_path}_{index}"],
            documents=[text],
            embeddings=[embedding]
        )


if __name__ == "__main__":

    ingest_csv(
        "data/drug_interaction.csv",
        [
            "drug_1",
            "drug_2",
            "severity",
            "warning",
            "recommendation"
        ]
    )

    ingest_csv(
        "data/medicine_dictionary.csv",
        [
            "medicine_name",
            "category",
            "indication"
        ]
    )

    ingest_csv(
        "data/dosage_guidelines.csv",
        [
            "medicine_name",
            "adult_dose",
            "max_daily_dose"
        ]
    )

    print(
        "Healthcare Knowledge Base Ingested Successfully"
    )