import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGate } from "./AuthGate";

const fetchMock = vi.fn();

describe("AuthGate", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("shows the login screen when the session is unauthenticated", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "Unauthorized" }), { status: 401 }),
    );

    render(
      <AuthGate>
        <div>Protected Board</div>
      </AuthGate>,
    );

    expect(await screen.findByText("Project board access")).toBeTruthy();
    expect(screen.queryByText("Protected Board")).toBeNull();
  });

  it("shows an error for invalid credentials", async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Unauthorized" }), { status: 401 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Invalid credentials." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }),
      );

    render(
      <AuthGate>
        <div>Protected Board</div>
      </AuthGate>,
    );

    fireEvent.change(await screen.findByLabelText("Username"), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "guess" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Use the MVP credentials: user / password",
    );
  });

  it("authenticates valid credentials and reveals protected content", async () => {
    const onAuthenticated = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ detail: "Unauthorized" }), { status: 401 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ authenticated: true, username: "user" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    render(
      <AuthGate onAuthenticated={onAuthenticated}>
        <div>Protected Board</div>
      </AuthGate>,
    );

    fireEvent.change(await screen.findByLabelText("Username"), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Protected Board")).toBeTruthy();
    expect(onAuthenticated).toHaveBeenCalledTimes(1);
  });

  it("restores a valid session and allows logout", async () => {
    const onAuthenticated = vi.fn();

    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ authenticated: true, username: "user" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ authenticated: false, username: null }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

    render(
      <AuthGate onAuthenticated={onAuthenticated}>
        <div>Protected Board</div>
      </AuthGate>,
    );

    expect(await screen.findByText("Protected Board")).toBeTruthy();
    expect(onAuthenticated).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(screen.getByText("Project board access")).toBeTruthy();
    });
  });
});
