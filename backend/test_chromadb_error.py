
import sys
import traceback
print("Testing chromadb with SegmentAPI settings...")
try:
    # pyrefly: ignore [missing-import]
    import chromadb
    # pyrefly: ignore [missing-import]
    from chromadb.config import Settings
    settings = Settings(
        anonymized_telemetry=False,
        chroma_api_impl="chromadb.api.segment.SegmentAPI"
    )
    client2 = chromadb.PersistentClient(path="chroma_db", settings=settings)
    print("Successfully initialized PersistentClient with SegmentAPI settings")
except Exception as e:
    print("FAILED SegmentAPI initialization:")
    traceback.print_exc()