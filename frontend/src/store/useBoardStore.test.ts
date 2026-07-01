import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from './useBoardStore';

// Reset store before each test
beforeEach(() => {
  const store = useBoardStore.getState();
  useBoardStore.setState({
    ...store,
    initialize: store.initialize,
  });
});

describe('Board Store', () => {
  describe('Initial State', () => {
    it('has 5 columns', () => {
      const { columns } = useBoardStore.getState();
      expect(columns).toHaveLength(5);
    });

    it('has columns with correct titles', () => {
      const { columns } = useBoardStore.getState();
      expect(columns.map(c => c.title)).toEqual([
        'Backlog', 'To Do', 'In Progress', 'Review', 'Done'
      ]);
    });

    it('has 9 initial cards', () => {
      const { cards } = useBoardStore.getState();
      expect(Object.keys(cards)).toHaveLength(9);
    });
  });

  describe('addCard', () => {
    it('adds a card to a column', () => {
      const { addCard, columns } = useBoardStore.getState();
      const initialCount = columns[0].cardIds.length;

      addCard('backlog', 'New Test Card');

      const { columns: newColumns, cards } = useBoardStore.getState();
      expect(newColumns[0].cardIds.length).toBe(initialCount + 1);
      expect(Object.keys(cards)).toHaveLength(10);
    });
  });

  describe('deleteCard', () => {
    it('removes a card from the board', () => {
      const { deleteCard, columns } = useBoardStore.getState();
      const cardToDelete = columns[0].cardIds[0];

      deleteCard(cardToDelete);

      const { cards, columns: newColumns } = useBoardStore.getState();
      expect(cards[cardToDelete]).toBeUndefined();
      expect(newColumns[0].cardIds).not.toContain(cardToDelete);
    });
  });

  describe('updateCard', () => {
    it('updates card title and details', () => {
      const { updateCard, columns } = useBoardStore.getState();
      const cardId = columns[0].cardIds[0];

      updateCard(cardId, 'Updated Title', 'Updated Details');

      const { cards } = useBoardStore.getState();
      expect(cards[cardId].title).toBe('Updated Title');
      expect(cards[cardId].details).toBe('Updated Details');
    });
  });

  describe('updateColumnTitle', () => {
    it('renames a column', () => {
      const { updateColumnTitle } = useBoardStore.getState();

      updateColumnTitle('backlog', 'New Column Name');

      const { columns } = useBoardStore.getState();
      expect(columns[0].title).toBe('New Column Name');
    });

    it('trims whitespace from title', () => {
      const { updateColumnTitle } = useBoardStore.getState();

      updateColumnTitle('backlog', '  Trimmed Name  ');

      const { columns } = useBoardStore.getState();
      expect(columns[0].title).toBe('Trimmed Name');
    });
  });

  describe('moveCard', () => {
    it('moves card within the same column', () => {
      const { moveCard, columns } = useBoardStore.getState();
      const columnId = 'backlog';
      const cardId = columns[0].cardIds[0];
      const newIndex = 1;

      moveCard(cardId, columnId, columnId, newIndex);

      const { columns: newColumns } = useBoardStore.getState();
      expect(newColumns[0].cardIds.indexOf(cardId)).toBe(newIndex);
    });

    it('moves card between columns', () => {
      const { moveCard, columns } = useBoardStore.getState();
      const cardId = columns[0].cardIds[0];
      const fromColumn = 'backlog';
      const toColumn = 'todo';

      moveCard(cardId, fromColumn, toColumn, 0);

      const { columns: newColumns } = useBoardStore.getState();
      const backlogCards = newColumns.find(c => c.id === 'backlog')!.cardIds;
      const todoCards = newColumns.find(c => c.id === 'todo')!.cardIds;

      expect(backlogCards).not.toContain(cardId);
      expect(todoCards).toContain(cardId);
    });
  });
});
