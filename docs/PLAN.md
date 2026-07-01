# Project Plan

This document is the execution plan for the Project Management MVP web app described in [AGENTS.md](./AGENTS.md).

This plan assumes:

- `frontend/` is the current MVP starting point
- the final app will use a Next.js frontend, statically built and served by a FastAPI backend
- the system will run locally in Docker
- the MVP will use a single hardcoded login (`user` / `password`)
- the backend will use SQLite and support future multi-user expansion
- OpenRouter will be used for AI, with `openai/gpt-oss-120b` as the target model

## Global delivery rules

- Keep the implementation simple and MVP-focused.
- Prove root cause before fixing issues.
- Use the latest stable and idiomatic approaches available in the project environment.
- Minimum automated unit test coverage target: 80% for backend and frontend logic added in this project.
- Integration testing must cover the main user flows, not only isolated functions.
- Each major part should be completed and validated before moving to the next one.

## Global test strategy

### Unit tests

- Frontend logic tests with Vitest.
- Backend logic tests with pytest.
- Validate state transitions, API contracts, auth logic, database behavior, and AI output parsing.

### Integration tests

- Backend API integration tests for auth, board retrieval, board mutation, and AI routes.
- Frontend integration tests for login, board interactions, and AI sidebar behavior.
- Container-level smoke test to verify the app starts and serves the expected routes locally.

### Done criteria for the whole project

- App runs locally via Docker with documented start/stop scripts for Mac, Windows, and Linux.
- User can log in with dummy credentials and see a persistent Kanban board.
- Board data is stored in SQLite and recreated if missing.
- AI sidebar can answer questions and optionally update the board through structured outputs.
- Test coverage and integration flow requirements are met.

---

## Part 1: Plan and project documentation

### Goal

Turn the high-level brief into an execution-ready plan and document the current frontend MVP so future implementation work starts from the actual codebase, not assumptions.

### Checklist

- [ ] Expand `docs/PLAN.md` into a detailed execution checklist.
- [ ] Add substeps for every project part.
- [ ] Define tests required for every part.
- [ ] Define success criteria required for every part.
- [ ] Review the existing `frontend/` codebase.
- [ ] Update `frontend/AGENTS.md` to describe the existing MVP accurately.
- [ ] Pause for user review and approval before implementation begins.

### Tests

- Manual document review for completeness and consistency.
- Verify the plan reflects the requirements in `docs/AGENTS.md`.
- Verify `frontend/AGENTS.md` matches the current structure and behavior of `frontend/`.

### Success criteria

- `docs/PLAN.md` is actionable and can be executed top to bottom.
- `frontend/AGENTS.md` describes the actual frontend MVP, current limitations, libraries, and key files.
- User explicitly approves the plan before any implementation work starts.

---

## Part 2: Scaffolding

### Goal

Create the backend and container foundation and prove the app can run locally through Docker with a minimal working path.

### Checklist

- [ ] Create `backend/` with a FastAPI application.
- [ ] Add Python project configuration using `uv`.
- [ ] Add Dockerfile for the combined app.
- [ ] Add any supporting Docker configuration needed for local development and runtime.
- [ ] Create `scripts/` start and stop scripts for Windows, Mac, and Linux.
- [ ] Add a simple backend route returning test JSON.
- [ ] Serve example static HTML from FastAPI at `/`.
- [ ] Confirm frontend-like asset serving path is understood before replacing the static HTML later.
- [ ] Add backend test scaffolding.
- [ ] Document local run steps minimally.

### Tests

- Unit test for the sample API route.
- Integration test confirming FastAPI serves `/` and an example API route.
- Docker smoke test confirming the container starts and exposes the expected app.
- Script smoke tests confirming start/stop scripts call the right entry points.

### Success criteria

- Running the Dockerized app locally serves example HTML at `/`.
- A test API endpoint responds successfully.
- Start/stop scripts work on each target platform in a simple way.
- Backend test scaffolding is in place for future parts.

---

## Part 3: Add in frontend

### Goal

Replace example static HTML with the statically built Next.js frontend MVP already present in `frontend/`.

### Checklist

- [ ] Decide and implement the frontend static build output path.
- [ ] Build `frontend/` as static assets compatible with FastAPI serving.
- [ ] Serve the generated frontend assets from FastAPI at `/`.
- [ ] Confirm asset paths, routing behavior, and page load behavior in the combined app.
- [ ] Ensure the Kanban demo renders correctly when served by the backend.
- [ ] Add or update frontend tests around current MVP logic as needed.
- [ ] Add integration coverage for end-to-end page rendering from the backend-served frontend.

### Tests

- Frontend unit tests for core board state logic.
- Frontend render/integration tests for initial Kanban display.
- Backend integration test confirming `/` returns the built frontend.
- Docker smoke test confirming the built app loads correctly.

### Success criteria

- The static Next.js frontend is served by FastAPI at `/`.
- The demo Kanban board renders correctly in the combined app.
- No manual frontend server is required in the final MVP flow.

---

## Part 4: Add fake user sign-in experience

### Goal

Require a dummy login before showing the Kanban board, while keeping the implementation intentionally simple.

### Checklist

- [ ] Design a minimal login screen in the frontend.
- [ ] Add backend auth endpoints or session handling needed for the dummy login.
- [ ] Hardcode valid credentials as `user` / `password`.
- [ ] Prevent access to the board until login succeeds.
- [ ] Add logout support.
- [ ] Ensure page refresh behavior is defined and consistent.
- [ ] Add frontend tests for login success, failure, and logout.
- [ ] Add backend tests for auth/session behavior.
- [ ] Add integration tests for the complete sign-in flow.

### Tests

- Unit tests for auth logic and guard behavior.
- Integration tests for:
  - visiting `/` while logged out
  - logging in successfully
  - handling invalid credentials
  - logging out

### Success criteria

- Logged-out users see login first.
- Only `user` / `password` works in the MVP.
- Logged-in users can reach the board.
- Logout returns the user to the login experience.

---

## Part 5: Database modeling

### Goal

Define and document a simple, future-friendly SQLite approach for storing one board per user using JSON board state.

### Checklist

- [ ] Propose the SQLite schema in `docs/`.
- [ ] Define how users are represented for future expansion.
- [ ] Define how a board is stored as JSON.
- [ ] Define how board creation works if no record exists yet.
- [ ] Define migration/bootstrap expectations simply.
- [ ] Document tradeoffs and limitations of JSON storage.
- [ ] Pause for user sign-off before implementing database persistence.

### Tests

- Document review for clarity and simplicity.
- Validate the schema proposal supports the MVP and future multi-user expansion.

### Success criteria

- The schema is simple, documented, and sufficient for the MVP.
- The user signs off on the database approach before implementation begins.

---

## Part 6: Backend board API

### Goal

Implement backend routes that read and mutate the board for the signed-in user, backed by SQLite.

### Checklist

- [ ] Add SQLite setup and connection lifecycle.
- [ ] Create the database if it does not exist.
- [ ] Add data access layer for user board retrieval and update.
- [ ] Add route to fetch the current board for the authenticated user.
- [ ] Add route(s) to update the board for the authenticated user.
- [ ] Validate auth before all board operations.
- [ ] Ensure default board creation for a new user record if missing.
- [ ] Add backend unit tests for persistence and route logic.
- [ ] Add backend integration tests for API behavior.

### Tests

- Unit tests for database helpers and board serialization/deserialization.
- API tests for:
  - fetching board while authenticated
  - blocking unauthenticated access
  - writing board changes
  - recreating missing database or missing board row

### Success criteria

- Board state is persisted in SQLite.
- Board API routes are stable and authenticated.
- Missing database state is created automatically.

---

## Part 7: Frontend + backend integration

### Goal

Replace the frontend-only demo state with real backend persistence.

### Checklist

- [ ] Replace inline/dummy frontend initialization with backend board fetch.
- [ ] Replace direct local-only state assumptions with API-backed persistence.
- [ ] Ensure add/edit/move/delete actions persist through the backend.
- [ ] Add loading and error states where needed.
- [ ] Confirm board data survives page reloads.
- [ ] Add frontend integration tests for backend-driven board behavior.
- [ ] Add end-to-end integration tests for full board CRUD flow.

### Tests

- Frontend tests for successful board load and mutation flows.
- Integration tests for:
  - initial board fetch
  - card add
  - card edit
  - card move
  - card delete
  - column rename
  - persistence after refresh

### Success criteria

- The frontend uses backend APIs as the source of truth.
- The board persists across reloads for the signed-in user.
- Core Kanban interactions remain smooth and correct.

---

## Part 8: AI connectivity

### Goal

Prove the backend can make successful OpenRouter requests independently of the UI.

### Checklist

- [ ] Load `OPENROUTER_API_KEY` from the root `.env`.
- [ ] Configure the backend OpenRouter client/request layer.
- [ ] Set the model to `openai/gpt-oss-120b`.
- [ ] Add a backend route or internal test helper to validate connectivity.
- [ ] Perform a simple `"2+2"` proof test through OpenRouter.
- [ ] Handle basic API/network error responses cleanly.
- [ ] Add tests around request construction and error handling.

### Tests

- Unit tests for AI request payload construction and response parsing.
- Integration test for mocked OpenRouter success and failure responses.
- Manual or automated connectivity proof using the simple `"2+2"` prompt.

### Success criteria

- Backend can successfully call OpenRouter.
- Model and API key configuration are working.
- Errors are surfaced clearly rather than silently failing.

---

## Part 9: AI structured outputs for board-aware changes

### Goal

Extend the AI call so it always sees the current board JSON and can optionally return a board update along with a user-facing reply.

### Checklist

- [ ] Define the structured output schema for AI responses.
- [ ] Include board JSON, user message, and conversation history in the AI input.
- [ ] Parse and validate AI structured outputs in the backend.
- [ ] Support reply-only responses.
- [ ] Support reply + board update responses.
- [ ] Reject malformed AI outputs safely.
- [ ] Apply validated board updates through the same persistence layer.
- [ ] Add backend tests for schema validation and board update application.

### Tests

- Unit tests for structured output validation.
- Unit tests for applying AI-requested board mutations.
- Integration tests for:
  - normal chat response without board change
  - valid chat response with board update
  - malformed AI response
  - unauthorized access

### Success criteria

- AI always receives the board context and conversation context.
- Backend safely accepts only valid structured output.
- Optional board updates are persisted correctly.

---

## Part 10: AI sidebar in the UI

### Goal

Add a polished chat sidebar that lets the user interact with the AI and automatically refreshes the board when AI changes it.

### Checklist

- [ ] Design and implement the AI sidebar UI.
- [ ] Add message history state in the frontend.
- [ ] Connect the sidebar to the backend AI route.
- [ ] Render assistant replies and loading/error states.
- [ ] Detect and apply board updates returned by the backend.
- [ ] Refresh or reconcile the board UI automatically after AI changes.
- [ ] Add frontend tests for sidebar behavior.
- [ ] Add integration tests for user-to-AI-to-board workflows.

### Tests

- Frontend component tests for chat rendering and interactions.
- Integration tests for:
  - sending a message
  - receiving a reply
  - AI-triggered board update
  - UI refresh after AI mutation
  - error handling when AI or backend fails

### Success criteria

- User can chat with AI from the sidebar.
- AI replies appear correctly in the UI.
- If AI updates the board, the board refreshes automatically and correctly.
- The feature feels integrated, not bolted on.

---

## Execution gate

Implementation should proceed in order, but not blindly. Before starting a new part:

- confirm the previous part is complete
- confirm tests for the previous part are passing
- confirm any explicit user sign-off gates in this document are satisfied
