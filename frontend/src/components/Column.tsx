"use client";

import { useState, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column as ColumnType, Card } from "@/types";
import { CardItem } from "./CardItem";
import { AddCardForm } from "./AddCardForm";
import { CardModal } from "./CardModal";
import { useBoardStore } from "@/store/useBoardStore";

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
}

export function Column({ column, cards }: ColumnProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const { addCard, updateCard, deleteCard, updateColumnTitle } =
    useBoardStore();

  const cardIds = useMemo(
    () => cards.map((card) => card.id),
    [cards]
  );

  const selectedCard = selectedCardId ? cards.find((c) => c.id === selectedCardId) : null;

  const handleTitleSubmit = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== column.title) {
      updateColumnTitle(column.id, trimmed);
    } else {
      setEditedTitle(column.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddCard = (title: string) => {
    addCard(column.id, title);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          flexShrink: 0,
          width: 280,
          backgroundColor: isOver ? "rgba(236, 173, 10, 0.1)" : "#f9fafb",
          borderRadius: 8,
          padding: 12,
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 120px)",
          border: isOver ? "2px solid rgba(236, 173, 10, 0.5)" : "2px solid transparent",
          transition: "all 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
                if (e.key === "Escape") {
                  setEditedTitle(column.title);
                  setIsEditingTitle(false);
                }
              }}
              style={{
                flex: 1,
                fontWeight: 600,
                color: "#032147",
                backgroundColor: "#fff",
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #ecad0a",
                outline: "none",
              }}
              autoFocus
            />
          ) : (
            <h2
              onClick={() => setIsEditingTitle(true)}
              style={{
                fontWeight: 600,
                color: "#032147",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#209dd7"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#032147"}
            >
              {column.title}
              <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400, color: "#888" }}>
                {cards.length}
              </span>
            </h2>
          )}
        </div>

        <div style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 60,
        }}>
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onClick={() => setSelectedCardId(card.id)}
              />
            ))}
          </SortableContext>
          {cards.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: 32,
              color: "#888",
              fontSize: 14,
              border: "2px dashed #e5e7eb",
              borderRadius: 8,
            }}>
              Drop cards here
            </div>
          )}
        </div>

        <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid #e5e7eb" }}>
          <AddCardForm onAdd={handleAddCard} />
        </div>
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCardId(null)}
          onSave={(title, details) => updateCard(selectedCard.id, title, details)}
          onDelete={() => deleteCard(selectedCard.id)}
        />
      )}
    </>
  );
}
