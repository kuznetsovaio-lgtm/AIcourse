"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface AddCardFormProps {
  onAdd: (title: string) => void;
}

export function AddCardForm({ onAdd }: AddCardFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onAdd(trimmedTitle);
      setTitle("");
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        style={{
          width: "100%",
          padding: "8px 0",
          fontSize: 14,
          color: "#888",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#209dd7";
          e.currentTarget.style.backgroundColor = "rgba(32, 157, 215, 0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#888";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title..."
        autoFocus
      />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="submit" size="sm">Add</Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
      </div>
    </form>
  );
}
