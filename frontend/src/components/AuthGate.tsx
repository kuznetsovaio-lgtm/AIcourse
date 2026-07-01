"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { login, logout, fetchSession } from "@/lib/api";
import { DUMMY_PASSWORD, DUMMY_USERNAME } from "@/lib/auth";

interface AuthGateProps {
  children: ReactNode;
  onAuthenticated?: () => void;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export function AuthGate({ children, onAuthenticated }: AuthGateProps) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const session = await fetchSession();

        if (session.authenticated) {
          setStatus("authenticated");
          onAuthenticated?.();
          return;
        }

        setStatus("unauthenticated");
      } catch {
        setStatus("unauthenticated");
      }
    })();
  }, [onAuthenticated]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    void (async () => {
      try {
        await login(username, password);
        setStatus("authenticated");
        setPassword("");
        onAuthenticated?.();
      } catch {
        setError("Use the MVP credentials: user / password");
      }
    })();
  };

  const handleLogout = () => {
    void (async () => {
      await logout();
      setStatus("unauthenticated");
      setUsername("");
      setPassword("");
      setError("");
    })();
  };

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
          color: "#032147",
          fontWeight: 600,
        }}
      >
        Loading project board...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "linear-gradient(135deg, #eef6ff 0%, #f9f5ff 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 460,
            padding: 32,
            borderRadius: 16,
            backgroundColor: "#fff",
            boxShadow: "0 20px 50px rgba(3, 33, 71, 0.12)",
            border: "1px solid rgba(3, 33, 71, 0.08)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              marginBottom: 12,
              color: "#209dd7",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            MVP Sign In
          </span>
          <h1
            style={{
              margin: "0 0 12px",
              fontSize: 32,
              lineHeight: 1.05,
              color: "#032147",
            }}
          >
            Project board access
          </h1>
          <p
            style={{
              margin: "0 0 24px",
              color: "#888888",
              lineHeight: 1.7,
            }}
          >
            This MVP uses a hardcoded login while the real backend auth is still
            being built.
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#032147",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Username
              </label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="user"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#032147",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p
                role="alert"
                style={{
                  margin: 0,
                  color: "#b91c1c",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {error}
              </p>
            ) : null}

            <Button type="submit">Sign in</Button>
          </form>

          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #e5e7eb",
              color: "#888888",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Credentials for this MVP: <strong>{DUMMY_USERNAME}</strong> /{" "}
            <strong>{DUMMY_PASSWORD}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 24,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.94)",
          border: "1px solid rgba(3, 33, 71, 0.08)",
          boxShadow: "0 8px 24px rgba(3, 33, 71, 0.08)",
        }}
      >
        <span style={{ color: "#032147", fontSize: 14 }}>
          Signed in as <strong>{DUMMY_USERNAME}</strong>
        </span>
        <Button type="button" size="sm" variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
      {children}
    </div>
  );
}
