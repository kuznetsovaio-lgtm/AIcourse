<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. Read the relevant local Next.js docs in `node_modules/next/dist/docs/` before making framework-level assumptions.
<!-- END:nextjs-agent-rules -->

# Frontend MVP overview

This directory contains the current working frontend-only MVP for the Project Management app. It is a Kanban demo built with Next.js, React, Zustand, and `dnd-kit`.

This frontend is the starting point for the broader project. It is not yet integrated with:

- FastAPI
- Docker runtime packaging
- backend persistence
- real authentication
- AI sidebar behavior

## What currently works

- Renders a Kanban board at `/`
- Displays 5 columns with sample cards
- Supports drag and drop between columns
- Supports drag and drop within a column
- Allows adding cards
- Allows editing cards in a modal
- Allows deleting cards
- Allows renaming columns inline
- Includes unit tests for the Zustand board store

## What is currently fake or local-only

- Authentication does not exist yet
- Data is not fetched from a backend
- Data is not persisted to a database
- AI chat does not exist in this frontend
- Board state is initialized from inline dummy data in the client store
- Styling is largely inline and MVP-level rather than production-ready

## Current stack

- Next.js 16 App Router
- React 19
- TypeScript
- Zustand for board state
- `@dnd-kit/core` and `@dnd-kit/sortable` for drag/drop
- Vitest for unit tests
- Testing Library dependencies installed but not yet heavily used

## Important files

### App entry

- `src/app/page.tsx`
  - Client page that initializes the board store on mount and renders the board shell.

- `src/app/layout.tsx`
  - App layout wrapper.

- `src/app/globals.css`
  - Global CSS.

### Board and UI components

- `src/components/Board.tsx`
  - Main drag-and-drop board container.
  - Uses `DndContext`, sensors, drag overlay, and store actions.

- `src/components/Column.tsx`
  - Renders one Kanban column.
  - Handles inline title editing.
  - Opens card modal.
  - Contains add-card UI.

- `src/components/CardItem.tsx`
  - Sortable draggable card UI.

- `src/components/CardModal.tsx`
  - Modal used to edit or delete a selected card.

- `src/components/AddCardForm.tsx`
  - Form used to add a new card to a column.

- `src/components/Button.tsx`
- `src/components/Input.tsx`
- `src/components/Textarea.tsx`
- `src/components/Modal.tsx`
  - Shared primitive components used by the board UI.

### State and data

- `src/store/useBoardStore.ts`
  - Main Zustand store.
  - Holds board data and board mutation actions.
  - Uses inline initial dummy data instead of backend data.

- `src/store/useBoardStore.test.ts`
  - Existing unit tests for store behaviors like add, delete, update, rename, and move.

- `src/types/index.ts`
  - Shared `Board`, `Column`, and `Card` types.

- `src/data/dummyData.ts`
  - Present in the project, but the current store uses inline initial data instead to avoid hydration issues.

## Current data model in the frontend

The board uses a normalized structure:

- `columns`: ordered array of columns
- `cards`: record keyed by card ID
- each column stores `cardIds`

This is a good structure for drag-and-drop UIs because:

- column ordering is explicit
- cards are easy to look up by ID
- moving cards between columns only requires updating arrays of IDs

## Current state actions

The store currently exposes:

- `initialize()`
- `moveCard(cardId, fromColumnId, toColumnId, newIndex)`
- `addCard(columnId, title)`
- `updateCard(cardId, title, details)`
- `deleteCard(cardId)`
- `updateColumnTitle(columnId, title)`

## Important implementation notes

### Hydration handling

The current page calls `initialize()` inside `useEffect()` and the store keeps inline initial data. The code comments indicate this was done to avoid hydration issues.

If future work changes initialization behavior, confirm the root cause first and keep SSR/client behavior aligned.

### Drag and drop behavior

`Board.tsx` handles drag lifecycle centrally:

- `handleDragStart`
- `handleDragOver`
- `handleDragEnd`

The actual data mutation is delegated to the store via `moveCard`.

### Column editing behavior

Column title editing is local UI state until submit/blur, then persisted into the store.

### Styling

Most UI styling is inline in components. This is acceptable for the MVP, but future work may want to move toward a clearer design system or shared styling approach once backend integration is stable.

## Testing status

Current test coverage is limited mostly to store logic.

What exists:

- Unit tests for the Zustand store in `src/store/useBoardStore.test.ts`

What is still needed in later phases:

- Component tests for board interactions
- Integration tests for login flow
- Integration tests for backend-connected board behavior
- Integration tests for AI sidebar behavior
- Coverage expansion to meet the project minimum of 80%

## Constraints for future work

- Keep this frontend simple and MVP-focused.
- Do not add fake complexity before backend integration.
- Preserve the existing board behaviors while replacing local-only state with backend persistence.
- Prefer incremental migration over rewriting the entire frontend at once.

## Recommended implementation order for frontend changes

1. Preserve the current Kanban behaviors.
2. Add login gating.
3. Replace dummy initialization with backend fetch.
4. Replace direct local state assumptions with API-backed persistence.
5. Add AI sidebar only after the backend AI contract is stable.

## Definition of success for the frontend migration

The frontend migration is successful when:

- the current MVP board behavior still works
- auth gates access correctly
- board state is loaded from and saved to the backend
- the UI is covered by unit and integration tests
- the AI sidebar integrates without breaking core Kanban interactions
