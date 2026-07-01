import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { fetchBoard, saveBoard } from "@/lib/api";
import { Board, Card, Column } from "@/types";

interface BoardStore extends Board {
  initialized: boolean;
  loading: boolean;
  error: string;
  initialize: () => Promise<void>;
  setBoard: (board: Board) => void;
  moveCard: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number,
  ) => void;
  addCard: (columnId: string, title: string) => void;
  updateCard: (cardId: string, title: string, details: string) => void;
  deleteCard: (cardId: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
}

const EMPTY_BOARD: Board = {
  columns: [],
  cards: {},
};

async function persistBoard(board: Board) {
  await saveBoard(board);
}

function withPersistedBoard(
  nextBoardBuilder: (state: BoardStore) => Board,
  set: (
    partial:
      | Partial<BoardStore>
      | ((state: BoardStore) => Partial<BoardStore>),
  ) => void,
  get: () => BoardStore,
) {
  const nextBoard = nextBoardBuilder(get());
  set({
    ...nextBoard,
    error: "",
  });

  void persistBoard(nextBoard).catch((error) => {
    set({
      error:
        error instanceof Error ? error.message : "Failed to save board changes.",
    });
  });
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  ...EMPTY_BOARD,
  initialized: false,
  loading: false,
  error: "",

  initialize: async () => {
    set({ loading: true, error: "" });

    try {
      const board = await fetchBoard();
      set({
        ...board,
        initialized: true,
        loading: false,
        error: "",
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to load the board.",
      });
    }
  },

  setBoard: (board) =>
    set({
      ...board,
      initialized: true,
      loading: false,
      error: "",
    }),

  moveCard: (cardId, fromColumnId, toColumnId, newIndex) =>
    withPersistedBoard(
      (state) => {
        const newColumns = state.columns.map((col) => {
          if (col.id === fromColumnId && fromColumnId === toColumnId) {
            const newCardIds = col.cardIds.filter((id) => id !== cardId);
            newCardIds.splice(newIndex, 0, cardId);
            return { ...col, cardIds: newCardIds };
          }
          if (col.id === fromColumnId) {
            return {
              ...col,
              cardIds: col.cardIds.filter((id) => id !== cardId),
            };
          }
          if (col.id === toColumnId) {
            const newCardIds = [...col.cardIds];
            newCardIds.splice(newIndex, 0, cardId);
            return { ...col, cardIds: newCardIds };
          }
          return col;
        });
        return { columns: newColumns, cards: state.cards };
      },
      set,
      get,
    ),

  addCard: (columnId, title) =>
    withPersistedBoard(
      (state) => {
        const id = uuidv4();
        const newCard: Card = { id, title, details: "" };
        const newColumns = state.columns.map((col) =>
          col.id === columnId ? { ...col, cardIds: [...col.cardIds, id] } : col,
        );
        return {
          columns: newColumns,
          cards: { ...state.cards, [id]: newCard },
        };
      },
      set,
      get,
    ),

  updateCard: (cardId, title, details) =>
    withPersistedBoard(
      (state) => ({
        columns: state.columns,
        cards: {
          ...state.cards,
          [cardId]: { ...state.cards[cardId], title, details },
        },
      }),
      set,
      get,
    ),

  deleteCard: (cardId) =>
    withPersistedBoard(
      (state) => {
        const { [cardId]: _removed, ...remainingCards } = state.cards;
        const newColumns = state.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== cardId),
        }));
        return { columns: newColumns, cards: remainingCards };
      },
      set,
      get,
    ),

  updateColumnTitle: (columnId, title) =>
    withPersistedBoard(
      (state) => ({
        cards: state.cards,
        columns: state.columns.map((col: Column) =>
          col.id === columnId ? { ...col, title: title.trim() } : col,
        ),
      }),
      set,
      get,
    ),
}));
