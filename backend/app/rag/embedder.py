import os
import requests
import time
from typing import List


class Embedder:

    @classmethod
    def embed(
        cls,
        text: str
    ) -> List[float]:
        # Query Hugging Face's Free Inference API for the same all-MiniLM-L6-v2 model (384 dimensions)
        url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
        headers = {}

        # Optionally read HF_TOKEN from environment if set to increase/bypass rate limits
        hf_token = os.getenv("HF_TOKEN")
        if hf_token:
            headers["Authorization"] = f"Bearer {hf_token}"

        payload = {
            "inputs": text,
            "options": {"wait_for_model": True}
        }

        # Handle retries and loading states (HF API returns 503 while loading a model)
        for attempt in range(3):
            try:
                response = requests.post(url, json=payload, headers=headers, timeout=15)
                if response.status_code == 200:
                    res_json = response.json()

                    # Deeply unwrap potential nested list structures from feature extractor API
                    while isinstance(res_json, list) and len(res_json) > 0 and isinstance(res_json[0], list):
                        res_json = res_json[0]

                    if isinstance(res_json, list) and all(isinstance(x, (int, float)) for x in res_json):
                        return res_json
                    raise ValueError(f"Unexpected response format from Hugging Face: {type(res_json)}")
                
                elif response.status_code == 503:
                    # Model loading, sleep and retry
                    time.sleep(3)
                    continue
                else:
                    raise Exception(f"HF API returned status code {response.status_code}: {response.text}")
            
            except Exception as e:
                print(f"HF embedding attempt {attempt + 1} failed: {e}")
                if attempt == 2:
                    # Fallback to zero vector to prevent user workflow from completely crashing
                    return [0.0] * 384
                time.sleep(2)
        
        return [0.0] * 384