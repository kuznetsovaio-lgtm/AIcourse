"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useBoardStore } from "@/store/useBoardStore";
import { Column } from "./Column";
import { CardItem } from "./CardItem";

export function Board() {
  const { columns, cards, moveCard, loading, error } = useBoardStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeCard = activeId ? cards[activeId] : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find((col) =>
      col.cardIds.includes(activeId)
    );
    const overColumn = columns.find(
      (col) => col.cardIds.includes(overId) || col.id === overId
    );

    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id && activeId === overId) return;

    const overIndex = overColumn.cardIds.indexOf(overId);
    const newIndex = overIndex >= 0 ? overIndex : overColumn.cardIds.length;

    moveCard(activeId, activeColumn.id, overColumn.id, newIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 80px)",
          color: "#032147",
          fontWeight: 600,
        }}
      >
        Loading board...
      </div>
    );
  }

  return (
    <>
      {error ? (
        <div
          style={{
            margin: "20px 24px 0",
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid rgba(185, 28, 28, 0.14)",
            backgroundColor: "rgba(254, 226, 226, 0.8)",
            color: "#991b1b",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          display: "flex",
          gap: 16,
          padding: 24,
          overflowX: "auto",
          minHeight: "calc(100vh - 80px)",
        }}>
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={column.cardIds.map((id) => cards[id]).filter(Boolean)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div style={{ opacity: 0.9, transform: "rotate(3deg)" }}>
              <CardItem card={activeCard} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
