---
name: backend-standards
description: Coding standards and patterns for backend (Main process). Use when: working on database, IPC handlers, asset services, or project lifecycle. Applies to src/main/** and src/common/**
applyTo: "src/main/**,src/common/**"
---

# Backend Standards

## Database Layer (`src/main/database/`)

- **Always use DbFactory pattern** for database abstraction
- Adapters: `LowdbAdapter` (local dev), `MongoAdapter` (production)
- Configuration via `IDBConfig` contract in `/common`

### DbFactory Example

```typescript
const db = DbFactory.create({
  type: "lowdb", // or 'mongodb'
  path: "./projects/project_db.json"
});

await db.query("projects", { id: "my-project" });
```

## Services (`src/main/services/`)

- **ProjectLauncher**: Reads `.ctm` manifest and initializes project state
- **AssetManager**: Converts images to WebP via Sharp, maintains relative paths
- **Packager**: ZIP/unzip for project distribution

### Service Pattern

```typescript
class MyService {
  constructor(private db: IDatabase) {}

  async execute(params: IRequest): Promise<IResponse> {
    // Validation
    // Database operation
    // Return typed response
  }
}
```

## IPC Handler (`src/main/ipc/handlers.ts`)

- Listen for channel names using `ipcMain.handle()`
- Forward to appropriate Service
- Return typed responses matching `/common` contracts

### Handler Pattern

```typescript
ipcMain.handle("project:load", async (event, projectId) => {
  return new ProjectLauncher(db).execute({ projectId });
});
```

## Asset Protocol (`src/main/index.ts`)

- Register `asset://` protocol for serving local WebP files
- Map requests to `/projects/{name}/assets/images/`

## File Naming

- Adapters: `[Source]Adapter.ts` (e.g., `MongoAdapter.ts`)
- Services: `[Action]Service.ts` (e.g., `ProjectLauncher.ts`)
- Types: Always from `/common` contract

## Error Handling

- Use `IResponse` wrapper: `{ success: boolean, data?, error? }`
- Logger on Main process for debugging
- Never expose system paths to Renderer
