import { Board, ChatMessage } from "@/types";

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed.";

    try {
      const payload = (await response.json()) as { detail?: string };
      message = payload.detail || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export interface SessionPayload {
  authenticated: boolean;
  username: string | null;
}

export interface AITestPayload {
  reply: string;
  model: string;
}

export interface ConfigPayload {
  openrouterModel: string;
}

export interface AIChatPayload {
  reply: string;
  model: string;
  boardUpdated: boolean;
  board: Board | null;
}

export async function fetchSession() {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "same-origin",
  });

  if (response.status === 401) {
    return {
      authenticated: false,
      username: null,
    } satisfies SessionPayload;
  }

  return handleJsonResponse<SessionPayload>(response);
}

export async function login(username: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ username, password }),
  });

  return handleJsonResponse<SessionPayload>(response);
}

export async function logout() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  });

  return handleJsonResponse<SessionPayload>(response);
}

export async function fetchBoard() {
  const response = await fetch("/api/board", {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  return handleJsonResponse<Board>(response);
}

export async function saveBoard(board: Board) {
  const response = await fetch("/api/board", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(board),
  });

  return handleJsonResponse<Board>(response);
}

export async function runAITest() {
  const response = await fetch("/api/ai/test", {
    method: "GET",
    credentials: "same-origin",
  });

  return handleJsonResponse<AITestPayload>(response);
}

export async function fetchConfig() {
  const response = await fetch("/api/config", {
    method: "GET",
    credentials: "same-origin",
  });

  return handleJsonResponse<ConfigPayload>(response);
}

export async function sendAIChat(messages: ChatMessage[]) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify({ messages }),
  });

  return handleJsonResponse<AIChatPayload>(response);
}
