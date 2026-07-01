from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Response
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from .ai import get_openrouter_model, run_ai_test, run_board_chat
from .auth import clear_auth_cookie, require_authenticated_username, set_auth_cookie
from .db import DEFAULT_USERNAME, get_board_for_username, initialize_database, save_board_for_username
from .schemas import AIChatRequest, AIChatResponse, AITestResponse, Board, LoginRequest, SessionResponse

app = FastAPI(
    title="AI Course Project Management MVP",
    version="0.1.0",
)

FRONTEND_OUT_DIR = Path(__file__).resolve().parents[2] / "frontend" / "out"

HELLO_PAGE = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Management MVP</title>
    <style>
      :root {
        color-scheme: light;
        --accent-yellow: #ecad0a;
        --blue-primary: #209dd7;
        --purple-secondary: #753991;
        --dark-navy: #032147;
        --gray-text: #888888;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Segoe UI", Arial, sans-serif;
        background: linear-gradient(135deg, #f8fbff 0%, #eef5fb 100%);
        color: var(--dark-navy);
      }
      main { max-width: 840px; margin: 0 auto; padding: 48px 24px 72px; }
      .hero {
        padding: 28px;
        border: 1px solid rgba(3, 33, 71, 0.08);
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 18px 40px rgba(3, 33, 71, 0.08);
      }
      .eyebrow {
        display: inline-block;
        margin-bottom: 14px;
        color: var(--blue-primary);
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      h1 { margin: 0 0 12px; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.05; }
      p { margin: 0; color: var(--gray-text); line-height: 1.7; }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <span class="eyebrow">FastAPI Scaffold</span>
        <h1>Project Management MVP backend is running.</h1>
        <p>This is the scaffold fallback page served when the frontend export is not available.</p>
      </section>
    </main>
  </body>
</html>
"""


@app.on_event("startup")
async def startup_event() -> None:
    initialize_database()


@app.get("/", response_class=HTMLResponse, response_model=None)
async def home():
    if FRONTEND_OUT_DIR.exists():
        return FileResponse(FRONTEND_OUT_DIR / "index.html")

    return HTMLResponse(content=HELLO_PAGE)


@app.get("/api/hello")
async def hello() -> dict[str, str]:
    return {
        "message": "Hello from the FastAPI backend",
        "status": "ok",
    }


@app.get("/api/config")
async def config() -> dict[str, str]:
    return {"openrouterModel": get_openrouter_model()}


@app.get("/healthz")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/auth/login", response_model=SessionResponse)
async def login(payload: LoginRequest, response: Response) -> SessionResponse:
    if payload.username.strip() != DEFAULT_USERNAME or payload.password != "password":
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    set_auth_cookie(response, DEFAULT_USERNAME)
    return SessionResponse(authenticated=True, username=DEFAULT_USERNAME)


@app.post("/api/auth/logout", response_model=SessionResponse)
async def logout(response: Response) -> SessionResponse:
    clear_auth_cookie(response)
    return SessionResponse(authenticated=False, username=None)


@app.get("/api/auth/session", response_model=SessionResponse)
async def session(username: str = Depends(require_authenticated_username)) -> SessionResponse:
    return SessionResponse(authenticated=True, username=username)


@app.get("/api/board", response_model=Board)
async def get_board(username: str = Depends(require_authenticated_username)) -> Board:
    return get_board_for_username(username)


@app.put("/api/board", response_model=Board)
async def update_board(
    board: Board, username: str = Depends(require_authenticated_username)
) -> Board:
    return save_board_for_username(username, board)


@app.get("/api/ai/test", response_model=AITestResponse)
async def ai_test(username: str = Depends(require_authenticated_username)) -> AITestResponse:
    del username
    reply, model = await run_ai_test()
    return AITestResponse(reply=reply, model=model)


@app.post("/api/ai/chat", response_model=AIChatResponse)
async def ai_chat(
    payload: AIChatRequest,
    username: str = Depends(require_authenticated_username),
) -> AIChatResponse:
    current_board = get_board_for_username(username)
    result, model = await run_board_chat(current_board, payload.messages)

    updated_board = None
    board_updated = result.board is not None

    if board_updated:
        updated_board = save_board_for_username(username, result.board)

    return AIChatResponse(
        reply=result.reply,
        model=model,
        boardUpdated=board_updated,
        board=updated_board,
    )


if FRONTEND_OUT_DIR.exists():
    app.mount(
        "/",
        StaticFiles(directory=FRONTEND_OUT_DIR, html=True),
        name="frontend",
    )
