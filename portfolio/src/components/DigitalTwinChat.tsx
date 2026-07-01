"use client";

import { useEffect, useState } from "react";
import { Bot, MessageSquareText, SendHorizonal } from "lucide-react";
import { starterQuestions } from "@/lib/careerProfile";
import styles from "./DigitalTwinChat.module.css";

type Message = {
  role: "assistant" | "user";
  content: string;
};

type ChatStatus = {
  configured: boolean;
  model: string;
};

const welcomeMessage: Message = {
  role: "assistant",
  content:
    "Ask me about my career journey, projects, technical strengths, or what I am looking for next.",
};

export function DigitalTwinChat() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ChatStatus | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadStatus() {
      try {
        const response = await fetch("/api/digital-twin", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as ChatStatus;

        if (!ignore) {
          setStatus(payload);
        }
      } catch {
        if (!ignore) {
          setStatus(null);
        }
      }
    }

    void loadStatus();

    return () => {
      ignore = true;
    };
  }, []);

  async function submitQuestion(rawQuestion: string) {
    const question = rawQuestion.trim();

    if (!question || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: question }];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/digital-twin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.slice(1),
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        message?: string;
        model?: string;
      };

      if (!response.ok || !payload.message) {
        throw new Error(payload.error || "The Digital Twin could not answer just now.");
      }

      const assistantReply = payload.message.trim();

      if (!assistantReply) {
        throw new Error("The Digital Twin returned an empty reply.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: assistantReply,
        },
      ]);

      setStatus((current) =>
        current
          ? { ...current, configured: true, model: payload.model || current.model }
          : { configured: true, model: payload.model || "OpenRouter" },
      );
    } catch (requestError) {
      setMessages(messages);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The Digital Twin could not answer just now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>
            <Bot size={16} />
            Digital Twin
          </span>
          <h3>Talk to an AI version of my professional profile.</h3>
          <p>
            This chat is grounded in my CV and portfolio context, so it is best
            for questions about my background, projects, skills, and career
            direction.
          </p>
        </div>

        <div className={styles.statusPill}>
          <span
            className={
              status?.configured ? styles.statusDot : styles.statusDotMuted
            }
          />
          <span>
            {status?.configured
              ? `OpenRouter | ${status.model}`
              : "Awaiting OpenRouter configuration"}
          </span>
        </div>
      </div>

      <p className={styles.statusNote}>
        {status?.configured
          ? "Live and ready for career Q&A."
          : "Add the local OpenRouter environment variables to enable live responses."}
      </p>

      <div className={styles.starterGrid}>
        {starterQuestions.map((question) => (
          <button
            key={question}
            type="button"
            className={styles.starterButton}
            disabled={isLoading || !status?.configured}
            onClick={() => {
              void submitQuestion(question);
            }}
          >
            {question}
          </button>
        ))}
      </div>

      <div className={styles.conversation}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            Start with one of the prompts above or ask a custom question.
          </div>
        ) : (
          messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={
                message.role === "user" ? styles.messageUser : styles.message
              }
            >
              <span className={styles.messageMeta}>
                {message.role === "user" ? "You" : "Ilona AI"}
              </span>
              <p className={styles.messageBody}>{message.content}</p>
            </article>
          ))
        )}

        {isLoading ? (
          <article className={styles.message}>
            <span className={styles.messageMeta}>Ilona AI</span>
            <p className={styles.messageBody}>Thinking through that...</p>
          </article>
        ) : null}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          void submitQuestion(input);
        }}
      >
        <textarea
          className={styles.textarea}
          value={input}
          disabled={isLoading || !status?.configured}
          placeholder="Ask about projects, technical depth, strengths, or next-step career goals..."
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />

        <div className={styles.composerRow}>
          <div className={styles.disclaimer}>
            <MessageSquareText size={16} /> Answers stay focused on career and
            portfolio context.
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !status?.configured || input.trim().length === 0}
          >
            <SendHorizonal size={18} />
            {isLoading ? "Sending..." : "Ask the Digital Twin"}
          </button>
        </div>
      </form>
    </div>
  );
}
