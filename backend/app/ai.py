import json
import os

import httpx
from pydantic import ValidationError

from .schemas import AIResult, Board, ChatMessage

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_OPENROUTER_MODEL = "openai/gpt-oss-120b"


def get_openrouter_api_key() -> str:
    return os.getenv("OPENROUTER_API_KEY", "").strip()


def get_openrouter_model() -> str:
    return os.getenv("OPENROUTER_MODEL", DEFAULT_OPENROUTER_MODEL).strip()


def require_openrouter_api_key() -> str:
    api_key = get_openrouter_api_key()
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")
    return api_key


def build_ai_system_prompt(board: Board) -> str:
    return (
        "You are an AI assistant inside a project management Kanban app. "
        "You must help the user manage their board. "
        "You always respond as strict JSON with this exact shape: "
        '{"reply": "string", "board": null or full board object}. '
        "Only set board to a full updated board when the user is clearly asking to create, edit, move, rename, or delete cards or columns. "
        "If no board change is needed, set board to null. "
        "Do not include markdown fences or any text outside the JSON. "
        f"Current board JSON: {board.model_dump_json()}"
    )


async def call_openrouter(messages: list[dict[str, str]]) -> tuple[str, str]:
    api_key = require_openrouter_api_key()
    model = get_openrouter_model()

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            OPENROUTER_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:8000",
                "X-OpenRouter-Title": "AI Course Project Management MVP",
            },
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": 700,
            },
        )

    response.raise_for_status()
    payload = response.json()
    return (
        str(payload["choices"][0]["message"]["content"]).strip(),
        model,
    )


async def run_ai_test() -> tuple[str, str]:
    content, model = await call_openrouter(
        [
            {
                "role": "user",
                "content": 'Reply with only the final answer to this arithmetic question: what is 2+2?',
            }
        ]
    )
    return content, model


async def run_board_chat(board: Board, history: list[ChatMessage]) -> tuple[AIResult, str]:
    system_prompt = build_ai_system_prompt(board)
    content, model = await call_openrouter(
        [{"role": "system", "content": system_prompt}]
        + [message.model_dump() for message in history]
    )

    data = json.loads(content)

    try:
        result = AIResult.model_validate(data)
    except ValidationError as exc:
        raise RuntimeError(f"Invalid AI structured response: {exc}") from exc

    return result, model
