"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Card } from "@/types";

interface CardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, details: string) => void;
  onDelete: () => void;
}

export function CardModal({
  card,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [details, setDetails] = useState(card.details);

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onSave(trimmedTitle, details.trim());
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Card">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "#888",
            marginBottom: 4,
          }}>
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
            autoFocus
          />
        </div>
        <div>
          <label style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            color: "#888",
            marginBottom: 4,
          }}>
            Details
          </label>
          <Textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Add more details..."
            rows={4}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
