from fastapi import Cookie, HTTPException, Response, status

from .db import DEFAULT_USERNAME

AUTH_COOKIE_NAME = "pm_mvp_session"


def set_auth_cookie(response: Response, username: str = DEFAULT_USERNAME) -> None:
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=username,
        httponly=True,
        samesite="lax",
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(key=AUTH_COOKIE_NAME, path="/")


def require_authenticated_username(
    session_username: str | None = Cookie(default=None, alias=AUTH_COOKIE_NAME),
) -> str:
    if session_username != DEFAULT_USERNAME:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    return session_username
