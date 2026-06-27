import asyncio
from app.services.groq_service import GroqService

async def call_llm_with_retry(
    prompt: str,
    max_retries: int = 2
):
    last_err = None
    for attempt in range(max_retries + 1):
        try:
            # GroqService.generate_response makes the actual synchronous API request
            response = GroqService.generate_response(prompt)
            return response
        except Exception as e:
            last_err = e
            if attempt < max_retries:
                await asyncio.sleep(1)

    return {
        "error": "AI analysis unavailable",
        "reason": str(last_err)
    }

def run_sync(coro):
    try:
        return asyncio.run(coro)
    except RuntimeError:
        # If event loop is already running, execute in a thread pool to avoid blocking/crashing
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            return executor.submit(asyncio.run, coro).result()
