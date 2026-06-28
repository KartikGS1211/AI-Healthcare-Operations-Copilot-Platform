# pyrefly: ignore [missing-import]
from fastapi import APIRouter

from app.rag.embedder import Embedder
from app.rag.retriever import Retriever

router=APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

def parse_and_ingest_medicine_details(query: str, response: str):
    sections = response.split("[")
    indication_text = ""
    dosage_text = ""
    interactions = []

    for section in sections:
        if not section.strip():
            continue
        parts = section.split("]")
        if len(parts) < 2:
            continue
        header = parts[0].strip().lower()
        content = parts[1].strip()

        if header == "indication":
            lines = [l.strip() for l in content.split("\n") if ":" in l]
            category = "Unknown"
            indication = "Unknown"
            for line in lines:
                parts_line = line.split(":", 1)
                if len(parts_line) == 2:
                    k, v = parts_line
                    if k.strip().lower() == "category":
                        category = v.strip()
                    elif k.strip().lower() == "indication":
                        indication = v.strip()
            indication_text = f"{query} | {category} | {indication}"

        elif header == "dosage":
            lines = [l.strip() for l in content.split("\n") if ":" in l]
            adult_dose = "Individualized"
            max_daily_dose = "Individualized"
            for line in lines:
                parts_line = line.split(":", 1)
                if len(parts_line) == 2:
                    k, v = parts_line
                    if k.strip().lower() == "adult dose":
                        adult_dose = v.strip()
                    elif k.strip().lower() == "max daily dose":
                        max_daily_dose = v.strip()
            dosage_text = f"{query} | {adult_dose} | {max_daily_dose}"

        elif header == "interactions":
            lines = [l.strip() for l in content.split("\n") if "|" in l]
            for line in lines:
                interactions.append(f"{query} | {line}")

    # Ingest documents into ChromaDB
    if indication_text:
        embedding = Embedder.embed(indication_text)
        Retriever.collection.add(
            ids=[f"dynamic_indication_{query.lower().replace(' ', '_')}"],
            documents=[indication_text],
            embeddings=[embedding]
        )

    if dosage_text:
        embedding = Embedder.embed(dosage_text)
        Retriever.collection.add(
            ids=[f"dynamic_dosage_{query.lower().replace(' ', '_')}"],
            documents=[dosage_text],
            embeddings=[embedding]
        )

    for idx, interaction in enumerate(interactions):
        embedding = Embedder.embed(interaction)
        Retriever.collection.add(
            ids=[f"dynamic_interaction_{query.lower().replace(' ', '_')}_{idx}"],
            documents=[interaction],
            embeddings=[embedding]
        )

def generate_and_ingest_knowledge(query: str):
    prompt = f"""
You are a professional clinical assistant.
Provide detailed clinical information for the medicine: "{query}".
Return the information in the following EXACT format. Do not add any conversational text, explanations, intro, or outro.

[Indication]
Category: <Category of the medicine, e.g. Antibiotic, Antihypertensive>
Indication: <Primary clinical indication, e.g. Bacterial infections>

[Dosage]
Adult Dose: <Standard adult dose, e.g. 500 mg every 8 hours>
Max Daily Dose: <Maximum safe daily dose, e.g. 3000 mg>

[Interactions]
For each major drug interaction, provide one line in the format:
<Other Drug> | <Severity: HIGH or MODERATE> | <Warning description> | <Recommendation>
Provide at least 2 common drug interactions.
"""
    try:
        from app.services.groq_service import GroqService
        response = GroqService.generate_response(prompt)
        parse_and_ingest_medicine_details(query, response)
    except Exception as e:
        print(f"Error generating dynamic RAG knowledge: {e}")

@router.post("/search")
def search_knowledge_base(
    query: str
):
    embedding = Embedder.embed(query)
    search_results = Retriever.search(embedding)

    documents = search_results.get("documents", [[]])[0]
    distances = search_results.get("distances", [[]])[0]

    filtered_results = []
    filtered_docs = []

    for doc, dist in zip(documents, distances):
        if dist < 1.25:
            confidence = round(max(0.1, 1 - dist / 2), 2)
            filtered_results.append({
                "content": doc,
                "confidence": confidence,
                "source": "ChromaDB Knowledge Base"
            })
            filtered_docs.append(doc)

    if not filtered_results:
        # Dynamic AI lookup and ingestion
        generate_and_ingest_knowledge(query)

        # Re-run search query
        search_results = Retriever.search(embedding)
        documents = search_results.get("documents", [[]])[0]
        distances = search_results.get("distances", [[]])[0]

        for doc, dist in zip(documents, distances):
            if dist < 1.25:
                confidence = round(max(0.1, 1 - dist / 2), 2)
                filtered_results.append({
                    "content": doc,
                    "confidence": confidence,
                    "source": "ChromaDB Knowledge Base"
                })
                filtered_docs.append(doc)

    return {
        "query": query,
        "retrieved_context": "\n".join(filtered_docs),
        "results": filtered_results
    }