import re

def safe_prompt(user_input: str) -> str:
    if not user_input:
        user_input = ""
    
    # Strip known prompt injection phrases case-insensitively
    sanitized = re.sub(r"Ignore previous instructions", "", user_input, flags=re.IGNORECASE)
    sanitized = re.sub(r"Disregard all previous", "", sanitized, flags=re.IGNORECASE)
    
    # Truncate input to 4000 characters
    sanitized = sanitized[:4000]
    
    # Wrap in standard markers
    return (
        "Analyze only the medical information between the markers below.\n\n"
        "--- DOCUMENT START ---\n"
        f"{sanitized}\n"
        "--- DOCUMENT END ---"
    )
