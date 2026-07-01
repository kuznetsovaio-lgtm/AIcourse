import json
import sqlite3
from copy import deepcopy
from datetime import UTC, datetime
from pathlib import Path

from .default_board import DEFAULT_BOARD
from .schemas import Board

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DB_PATH = PROJECT_ROOT / "data" / "app.db"
DEFAULT_USER_ID = "user-1"
DEFAULT_USERNAME = "user"


def utc_now_iso() -> str:
    return datetime.now(UTC).isoformat()


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS boards (
                user_id TEXT PRIMARY KEY,
                board_json TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        connection.commit()

    ensure_user_and_board(DEFAULT_USERNAME)


def ensure_user_and_board(username: str) -> None:
    with get_connection() as connection:
        user_row = connection.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,),
        ).fetchone()

        if user_row is None:
            connection.execute(
                "INSERT INTO users (id, username, created_at) VALUES (?, ?, ?)",
                (DEFAULT_USER_ID, username, utc_now_iso()),
            )
            user_id = DEFAULT_USER_ID
        else:
            user_id = str(user_row["id"])

        board_row = connection.execute(
            "SELECT user_id FROM boards WHERE user_id = ?",
            (user_id,),
        ).fetchone()

        if board_row is None:
            default_board = Board.model_validate(deepcopy(DEFAULT_BOARD))
            connection.execute(
                "INSERT INTO boards (user_id, board_json, updated_at) VALUES (?, ?, ?)",
                (user_id, default_board.model_dump_json(), utc_now_iso()),
            )

        connection.commit()


def get_board_for_username(username: str) -> Board:
    ensure_user_and_board(username)

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT boards.board_json
            FROM boards
            JOIN users ON users.id = boards.user_id
            WHERE users.username = ?
            """,
            (username,),
        ).fetchone()

    if row is None:
        raise RuntimeError("Board lookup failed after initialization.")

    return Board.model_validate(json.loads(str(row["board_json"])))


def save_board_for_username(username: str, board: Board) -> Board:
    ensure_user_and_board(username)

    with get_connection() as connection:
        user_row = connection.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,),
        ).fetchone()

        if user_row is None:
            raise RuntimeError("User lookup failed after initialization.")

        connection.execute(
            "UPDATE boards SET board_json = ?, updated_at = ? WHERE user_id = ?",
            (board.model_dump_json(), utc_now_iso(), str(user_row["id"])),
        )
        connection.commit()

    return board
