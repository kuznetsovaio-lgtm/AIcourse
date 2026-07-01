# Database approach

The MVP stores one Kanban board per user in SQLite using a JSON board payload.

## Why this approach

- The MVP only needs a single board per signed-in user.
- The board already exists naturally as structured JSON in the frontend.
- JSON storage keeps the backend simple while still allowing future migration to a more relational schema if needed.

## Tables

### `users`

Stores user identities for future multi-user support.

Columns:

- `id` TEXT PRIMARY KEY
- `username` TEXT UNIQUE NOT NULL
- `created_at` TEXT NOT NULL

For the MVP, we only use the single user:

- `id = "user-1"`
- `username = "user"`

### `boards`

Stores one board per user.

Columns:

- `user_id` TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
- `board_json` TEXT NOT NULL
- `updated_at` TEXT NOT NULL

## JSON shape

`board_json` stores the board with this structure:

```json
{
  "columns": [
    {
      "id": "backlog",
      "title": "Backlog",
      "cardIds": ["card-1", "card-2"]
    }
  ],
  "cards": {
    "card-1": {
      "id": "card-1",
      "title": "Design system architecture",
      "details": "Define component library structure"
    }
  }
}
```

## Board creation behavior

If the SQLite database file does not exist, the backend creates it automatically.

If the default MVP user does not exist, the backend creates it automatically.

If the default user's board does not exist, the backend creates it automatically using the default board template.

## Tradeoffs

Advantages:

- very simple persistence model
- easy to align with frontend state shape
- minimal transformation code

Limitations:

- not ideal for advanced querying or analytics
- partial card updates still rewrite the full board JSON
- future collaboration features would likely benefit from a relational event or entity model

## MVP decision

For this MVP, the simplicity benefit is worth the tradeoff. The backend will treat the board JSON as the source of truth and validate it through typed schemas before saving.
