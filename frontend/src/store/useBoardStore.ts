import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Board, Card } from "@/types";

interface BoardStore extends Board {
  initialized: boolean;
  initialize: () => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  addCard: (columnId: string, title: string) => void;
  updateCard: (cardId: string, title: string, details: string) => void;
  deleteCard: (cardId: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
}

// Define dummy data inline to avoid hydration issues
const INITIAL_DATA = {
  columns: [
    { id: "backlog", title: "Backlog", cardIds: ["card-1", "card-2"] },
    { id: "todo", title: "To Do", cardIds: ["card-3", "card-4"] },
    { id: "in-progress", title: "In Progress", cardIds: ["card-5", "card-6"] },
    { id: "review", title: "Review", cardIds: ["card-7"] },
    { id: "done", title: "Done", cardIds: ["card-8", "card-9"] },
  ],
  cards: {
    "card-1": { id: "card-1", title: "Design system architecture", details: "Define component library structure" },
    "card-2": { id: "card-2", title: "Set up CI/CD pipeline", details: "Configure automated testing" },
    "card-3": { id: "card-3", title: "Implement user authentication", details: "Add login/logout functionality" },
    "card-4": { id: "card-4", title: "Create API documentation", details: "Document REST endpoints" },
    "card-5": { id: "card-5", title: "Build dashboard components", details: "Create chart widgets" },
    "card-6": { id: "card-6", title: "Optimize database queries", details: "Add indexes and optimize" },
    "card-7": { id: "card-7", title: "Write unit tests", details: "Achieve 80% code coverage" },
    "card-8": { id: "card-8", title: "Set up project repository", details: "Initialize Git repo" },
    "card-9": { id: "card-9", title: "Create wireframes", details: "Design mockups for screens" },
  },
} as Board;

export const useBoardStore = create<BoardStore>((set) => ({
  ...INITIAL_DATA,
  initialized: false,
  initialize: () => set({ initialized: true }),

  moveCard: (cardId, fromColumnId, toColumnId, newIndex) =>
    set((state) => {
      const newColumns = state.columns.map((col) => {
        if (col.id === fromColumnId && fromColumnId === toColumnId) {
          const newCardIds = col.cardIds.filter((id) => id !== cardId);
          newCardIds.splice(newIndex, 0, cardId);
          return { ...col, cardIds: newCardIds };
        }
        if (col.id === fromColumnId) {
          return { ...col, cardIds: col.cardIds.filter((id) => id !== cardId) };
        }
        if (col.id === toColumnId) {
          const newCardIds = [...col.cardIds];
          newCardIds.splice(newIndex, 0, cardId);
          return { ...col, cardIds: newCardIds };
        }
        return col;
      });
      return { columns: newColumns };
    }),

  addCard: (columnId, title) =>
    set((state) => {
      const id = uuidv4();
      const newCard: Card = { id, title, details: "" };
      const newColumns = state.columns.map((col) =>
        col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col
      );
      return {
        columns: newColumns,
        cards: { ...state.cards, [id]: newCard },
      };
    }),

  updateCard: (cardId, title, details) =>
    set((state) => ({
      cards: {
        ...state.cards,
        [cardId]: { ...state.cards[cardId], title, details },
      },
    })),

  deleteCard: (cardId) =>
    set((state) => {
      const { [cardId]: _, ...remainingCards } = state.cards;
      const newColumns = state.columns.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      }));
      return { columns: newColumns, cards: remainingCards };
    }),

  updateColumnTitle: (columnId, title) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId ? { ...col, title: title.trim() } : col
      ),
    })),
}));
