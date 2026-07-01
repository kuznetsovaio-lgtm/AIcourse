from typing import Literal

from pydantic import BaseModel, Field


class Card(BaseModel):
    id: str
    title: str
    details: str


class Column(BaseModel):
    id: str
    title: str
    cardIds: list[str]


class Board(BaseModel):
    columns: list[Column]
    cards: dict[str, Card]


class LoginRequest(BaseModel):
    username: str
    password: str


class SessionResponse(BaseModel):
    authenticated: bool
    username: str | None = None


class AITestResponse(BaseModel):
    reply: str
    model: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1)


class AIChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)


class AIChatResponse(BaseModel):
    reply: str
    model: str
    boardUpdated: bool
    board: Board | None = None


class AIResult(BaseModel):
    reply: str
    board: Board | None = None
