# AI Course Project Board

This repo contains a local-first project management MVP built with a statically exported Next.js frontend, a FastAPI backend, SQLite persistence, and an OpenRouter-powered AI sidebar.

## What It Does

- Sign in with the MVP credentials: `user` / `password`
- Work on a Kanban board with drag-and-drop cards
- Add, edit, delete, and move cards
- Rename board columns
- Persist board state in SQLite
- Chat with a Digital Twin sidebar that can answer questions and update the board

## Tech Stack

- `frontend/`: Next.js
- `backend/`: FastAPI + SQLite
- AI: OpenRouter
- Container runtime: Docker
- Python package/tooling: `uv`
- Frontend tests: Vitest
- Backend tests: pytest

## Project Structure

```text
frontend/   Next.js UI
backend/    FastAPI app, database logic, AI routes, tests
docs/       Plan and project documentation
scripts/    Start and stop scripts for Windows, macOS, and Linux
```

## Environment

Create a root `.env` file based on [.env.example](./.env.example).

Required values:

```env
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-oss-120b
```

If `OPENROUTER_MODEL` is not set, the backend falls back to `openai/gpt-oss-120b`.

## Run Locally With Docker

From the repo root:

### Windows PowerShell

```powershell
.\scripts\start.ps1
```

Stop it with:

```powershell
.\scripts\stop.ps1
```

### macOS / Linux

```bash
./scripts/start.sh
```

Stop it with:

```bash
./scripts/stop.sh
```

By default the app is available at `http://localhost:8000`.

## Manual Docker Commands

```bash
docker build -t ai-course-mvp .
docker run --rm -d -p 8000:8000 --env-file .env --name ai-course-mvp ai-course-mvp
```

Stop it with:

```bash
docker rm -f ai-course-mvp
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Backend Development

```bash
cd backend
uv sync --extra dev
uv run uvicorn app.main:app --reload
```

## Testing

Frontend:

```bash
cd frontend
npm exec vitest run --root .
npm run build
```

Backend:

```bash
cd backend
uv run pytest -q
```

## Main Routes

- `/`: frontend app
- `/healthz`: backend health check
- `/api/config`: current OpenRouter model
- `/api/auth/login`: dummy login
- `/api/auth/logout`: logout
- `/api/auth/session`: current session
- `/api/board`: fetch or update board state
- `/api/ai/test`: OpenRouter connectivity check
- `/api/ai/chat`: Digital Twin chat endpoint

## Notes

- The SQLite database is created automatically when missing.
- The runtime database file is intentionally ignored by Git.
- The root `.env` is intentionally not committed.
- The frontend is built as static output and served by FastAPI in the final app shape.

## Docs

- [Project plan](./docs/PLAN.md)
- [Project brief](./docs/AGENTS.md)
- [Database notes](./docs/DATABASE.md)
