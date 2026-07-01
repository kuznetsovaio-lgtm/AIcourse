"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { fetchConfig, runAITest, sendAIChat } from "@/lib/api";
import { ChatMessage } from "@/types";
import { useBoardStore } from "@/store/useBoardStore";

export function AIChatSidebar() {
  const setBoard = useBoardStore((state) => state.setBoard);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I’m your Digital Twin. Ask me about the board, priorities, or what work should happen next.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testStatus, setTestStatus] = useState("Checking AI connection...");
  const [model, setModel] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [{ openrouterModel }, aiTest] = await Promise.all([
          fetchConfig(),
          runAITest(),
        ]);
        setModel(aiTest.model || openrouterModel);
        setTestStatus(`Connected. AI test replied: ${aiTest.reply}`);
      } catch (cause) {
        const message =
          cause instanceof Error ? cause.message : "AI connectivity check failed.";
        setTestStatus(`Unavailable. ${message}`);
      }
    })();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = draft.trim();
    if (!content || loading) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);
    setError("");

    void (async () => {
      try {
        const response = await sendAIChat(nextMessages);

        setMessages([
          ...nextMessages,
          {
            role: "assistant",
            content: response.reply,
          },
        ]);

        if (response.boardUpdated && response.board) {
          setBoard(response.board);
        }

        setModel(response.model);
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "The Digital Twin could not answer right now.",
        );
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <aside
      style={{
        width: 380,
        flexShrink: 0,
        borderLeft: "1px solid rgba(3, 33, 71, 0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(243,244,246,0.98) 100%)",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 73px)",
      }}
    >
      <div
        style={{
          padding: "24px 20px 18px",
          borderBottom: "1px solid rgba(3, 33, 71, 0.08)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            padding: "7px 10px",
            borderRadius: 999,
            backgroundColor: "rgba(3, 33, 71, 0.05)",
            color: "#032147",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Digital Twin
        </div>
        <h2 style={{ margin: "0 0 10px", color: "#032147", fontSize: 24 }}>
          AI career copilot
        </h2>
        <p style={{ margin: 0, color: "#5b6472", lineHeight: 1.6, fontSize: 14 }}>
          This assistant can answer questions and make board updates through natural
          language.
        </p>
        <div
          style={{
            marginTop: 14,
            padding: "12px 14px",
            borderRadius: 12,
            backgroundColor: "rgba(32, 157, 215, 0.08)",
            color: "#032147",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <strong>OpenRouter model:</strong> {model || "Loading..."}
          <br />
          <strong>Status:</strong> {testStatus}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            style={{
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "92%",
              padding: "14px 16px",
              borderRadius: 16,
              backgroundColor:
                message.role === "user" ? "#032147" : "rgba(255, 255, 255, 0.95)",
              color: message.role === "user" ? "#ffffff" : "#032147",
              boxShadow:
                message.role === "user"
                  ? "0 12px 24px rgba(3, 33, 71, 0.16)"
                  : "0 10px 24px rgba(3, 33, 71, 0.06)",
              border:
                message.role === "user"
                  ? "1px solid transparent"
                  : "1px solid rgba(3, 33, 71, 0.08)",
              whiteSpace: "pre-wrap",
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: 20,
          borderTop: "1px solid rgba(3, 33, 71, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about the board or request a change..."
          aria-label="Message the Digital Twin"
        />
        {error ? (
          <div
            role="alert"
            style={{
              fontSize: 13,
              color: "#991b1b",
              backgroundColor: "rgba(254, 226, 226, 0.9)",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            {error}
          </div>
        ) : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </form>
    </aside>
  );
}
