---
name: deck-template-builder
description: Provides global architecture context for Deck Template Builder Electron app. Defines backend (Main + IPC), frontend (React + Canvas), shared contracts, and standards across all features.
---

# Deck Template Builder - Architecture Reference

## System Architecture

### 🔵 Backend (Main Process)

- **Database Layer**: `DbFactory` pattern (Lowdb/MongoDB adapter)
- **Services**: `ProjectLauncher`, `AssetManager`, `Packager`
- **IPC Handler**: Listens to renderer and executes services
- **Asset Protocol**: `asset://` protocol for local resources

### 🟢 Frontend (Renderer)

- **Canvas Component**: 1000x1800px fixed size for card designs
- **Sidebar**: Asset list and image management
- **Inspector**: Field editor and styling panel
- **State Management**: Zustand for global state
- **Styling**: Tailwind CSS v4

### 🟡 Bridge (Preload)

- Exposes `window.api` for IPC communication

### 🤝 Shared Contract (`/common`)

- `types.ts`: `IAsset`, `ICTMManifest`, `IDBConfig`
- `constants.ts`: `CANVAS_BASE_WIDTH = 1000`, `CANVAS_HEIGHT = 1800`

## Project File Structure

```
/(Deck Name)/
├── project.ctm          # Manifest with relative paths (JSON)
├── /data/               # Database folder
│   └── project_db.json  # (if using Lowdb)
├── /assets/
│   ├── /images/         # WebP optimized (hero_class, item_type, etc.)
│   └── /fonts/          # .ttf files
├── /temp/               # Export processing
└── /exports/            # Final output
    └── card_01_final.webp
```

## Stack & Standards

- **Electron 30+** with Vite
- **React 18** with TypeScript
- **Tailwind CSS v4**
- **Sharp** for image processing
- **Lowdb/MongoDB** for persistence

---

_See specific skills for backend or frontend responsibilities._
