from fastapi.testclient import TestClient

from app.db import initialize_database
from app.main import app
from app.schemas import AIResult, Board


initialize_database()
client = TestClient(app)


def test_home_page_serves_html() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert (
        "Project Management MVP backend is running." in response.text
        or "Kanban Board" in response.text
        or "Project board access" in response.text
        or "Loading project board" in response.text
    )


def test_hello_api_returns_expected_payload() -> None:
    response = client.get("/api/hello")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Hello from the FastAPI backend",
        "status": "ok",
    }


def test_healthcheck_returns_ok() -> None:
    response = client.get("/healthz")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_config_returns_openrouter_model() -> None:
    response = client.get("/api/config")

    assert response.status_code == 200
    assert "openrouterModel" in response.json()


def test_board_requires_authentication() -> None:
    response = client.get("/api/board")

    assert response.status_code == 401


def test_login_session_board_and_logout_flow() -> None:
    login_response = client.post(
        "/api/auth/login",
        json={"username": "user", "password": "password"},
    )

    assert login_response.status_code == 200
    assert login_response.json() == {"authenticated": True, "username": "user"}

    session_response = client.get("/api/auth/session")
    assert session_response.status_code == 200
    assert session_response.json() == {"authenticated": True, "username": "user"}

    board_response = client.get("/api/board")
    assert board_response.status_code == 200
    board = board_response.json()
    assert "columns" in board
    assert "cards" in board

    board["columns"][0]["title"] = "Roadmap"
    save_response = client.put("/api/board", json=board)
    assert save_response.status_code == 200
    assert save_response.json()["columns"][0]["title"] == "Roadmap"

    logout_response = client.post("/api/auth/logout")
    assert logout_response.status_code == 200
    assert logout_response.json() == {"authenticated": False, "username": None}

    unauthorized_session = client.get("/api/auth/session")
    assert unauthorized_session.status_code == 401


def test_ai_test_route_can_be_mocked(monkeypatch) -> None:
    async def fake_run_ai_test() -> tuple[str, str]:
        return "4", "mock/model"

    monkeypatch.setattr("app.main.run_ai_test", fake_run_ai_test)

    client.post(
        "/api/auth/login",
        json={"username": "user", "password": "password"},
    )

    response = client.get("/api/ai/test")

    assert response.status_code == 200
    assert response.json() == {"reply": "4", "model": "mock/model"}


def test_ai_chat_updates_board_when_model_returns_board(monkeypatch) -> None:
    async def fake_run_board_chat(board: Board, history) -> tuple[AIResult, str]:
        updated_board = Board.model_validate(board.model_dump())
        updated_board.columns[0].title = "AI Updated"
        return (
            AIResult(reply="I updated the first column.", board=updated_board),
            "mock/model",
        )

    monkeypatch.setattr("app.main.run_board_chat", fake_run_board_chat)

    client.post(
        "/api/auth/login",
        json={"username": "user", "password": "password"},
    )

    response = client.post(
        "/api/ai/chat",
        json={"messages": [{"role": "user", "content": "Rename the first column."}]},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["reply"] == "I updated the first column."
    assert payload["boardUpdated"] is True
    assert payload["board"]["columns"][0]["title"] == "AI Updated"
