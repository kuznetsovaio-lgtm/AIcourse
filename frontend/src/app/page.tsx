"use client";

import { useEffect } from "react";
import { Board } from "@/components/Board";
import { useBoardStore } from "@/store/useBoardStore";

export default function Home() {
  const initialize = useBoardStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    }}>
      <header style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #209dd7 0%, #753991 100%)",
          }} />
          <h1 style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#032147",
            margin: 0,
          }}>Kanban Board</h1>
        </div>
      </header>
      <Board />
    </div>
  );
}
