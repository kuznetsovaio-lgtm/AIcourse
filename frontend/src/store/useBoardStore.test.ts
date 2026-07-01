import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBoardStore } from "./useBoardStore";
import { Board } from "@/types";

vi.mock("@/lib/api", () => ({
  fetchBoard: vi.fn(),
  saveBoard: vi.fn(),
}));

import { fetchBoard, saveBoard } from "@/lib/api";

const mockBoard: Board = {
  columns: [
    { id: "backlog", title: "Backlog", cardIds: ["card-1", "card-2"] },
    { id: "todo", title: "To Do", cardIds: [] },
  ],
  cards: {
    "card-1": { id: "card-1", title: "Card One", details: "First" },
    "card-2": { id: "card-2", title: "Card Two", details: "Second" },
  },
};

function resetStore() {
  useBoardStore.setState({
    columns: [],
    cards: {},
    initialized: false,
    loading: false,
    error: "",
  });
}

describe("useBoardStore", () => {
  beforeEach(() => {
    resetStore();
    vi.mocked(fetchBoard).mockReset();
    vi.mocked(saveBoard).mockReset();
  });

  it("loads the board from the backend", async () => {
    vi.mocked(fetchBoard).mockResolvedValue(mockBoard);

    await useBoardStore.getState().initialize();

    const state = useBoardStore.getState();
    expect(state.columns).toHaveLength(2);
    expect(state.cards["card-1"].title).toBe("Card One");
    expect(state.initialized).toBe(true);
    expect(state.loading).toBe(false);
  });

  it("captures initialization errors", async () => {
    vi.mocked(fetchBoard).mockRejectedValue(new Error("Backend unavailable"));

    await useBoardStore.getState().initialize();

    expect(useBoardStore.getState().error).toBe("Backend unavailable");
  });

  it("adds a card and persists the updated board", async () => {
    vi.mocked(saveBoard).mockResolvedValue(mockBoard);
    useBoardStore.getState().setBoard(mockBoard);

    useBoardStore.getState().addCard("backlog", "New Card");

    const state = useBoardStore.getState();
    expect(state.columns[0].cardIds).toHaveLength(3);
    expect(Object.values(state.cards).some((card) => card.title === "New Card")).toBe(
      true,
    );
    expect(vi.mocked(saveBoard)).toHaveBeenCalledTimes(1);
  });

  it("moves cards between columns and persists", async () => {
    vi.mocked(saveBoard).mockResolvedValue(mockBoard);
    useBoardStore.getState().setBoard(mockBoard);

    useBoardStore.getState().moveCard("card-1", "backlog", "todo", 0);

    const state = useBoardStore.getState();
    expect(state.columns[0].cardIds).not.toContain("card-1");
    expect(state.columns[1].cardIds).toContain("card-1");
    expect(vi.mocked(saveBoard)).toHaveBeenCalledTimes(1);
  });

  it("stores persistence failures without losing the optimistic update", async () => {
    vi.mocked(saveBoard).mockRejectedValue(new Error("Save failed"));
    useBoardStore.getState().setBoard(mockBoard);

    useBoardStore.getState().updateColumnTitle("backlog", "Roadmap");

    await waitFor(() => {
      const state = useBoardStore.getState();
      expect(state.columns[0].title).toBe("Roadmap");
      expect(state.error).toBe("Save failed");
    });
  });
});
