"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card as CardType } from "@/types";

interface CardProps {
  card: CardType;
  onClick: () => void;
}

export function CardItem({ card, onClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging ? `${CSS.Transform.toString(transform)} rotate(2deg)` : CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        cursor: "grab",
        border: "1px solid #f3f4f6",
        boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.15s ease",
      }}
      {...attributes}
      {...listeners}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(236, 173, 10, 0.5)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderColor = "#f3f4f6";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
        }
      }}
    >
      <h3 style={{
        fontWeight: 500,
        color: "#032147",
        fontSize: 14,
        lineHeight: 1.4,
        margin: 0,
      }}>
        {card.title}
      </h3>
      {card.details && (
        <p style={{
          color: "#888",
          fontSize: 12,
          marginTop: 4,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {card.details}
        </p>
      )}
    </div>
  );
}
