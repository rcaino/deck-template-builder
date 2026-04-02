---
name: deck-template-builder
description: Provides global architecture context for Deck Template Builder Electron app. A template designer (not a single card generator). Defines backend (Main + IPC), frontend (React + Canvas), shared contracts, and standards across all features.
---

# Deck Template Builder - Architecture Reference

## What We Build

**Deck Template Builder** is a tool to **design and configure card templates.**

A template defines:

- What fields a card can have (name, description, hp, attack, etc.)
- How fields map to visual positions on canvas
- What styles apply (colors, fonts, alignment)
- What images/components are shown conditionally (if field exists, if field = value)

**Output**: A template definition that users can download and use to generate their own cards.

---

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

- `types.ts`: `IComponent`, `IField`, `ITemplate`, `ICTMManifest`, `IDBConfig`, `ICanvasConfig`
- `constants.ts`: `DEFAULT_CANVAS_WIDTH = 1000`, `DEFAULT_CANVAS_HEIGHT = 1800`
  - Note: Components and fields are user-defined per-project in database, not in project.ctm

## Project File Structure

Each project folder contains:

```
/(Template Name)/
├── project.ctm          # Fixed infrastructure (STATIC ONLY)
│                        # { version, structure paths, db config }
│                        # NEVER contains canvas config
│                        # NEVER contains template definition
│
├── /assets/
│   └── /images/         # WebP optimized, organized by component
│       ├── /hero_class/ # Component folder
│       │   ├── tanque.webp
│       │   ├── dps.webp
│       │   └── healer.webp
│       └── /rarity/     # Component folder
│           ├── common.webp
│           ├── rare.webp
│           └── epic.webp
│
├── /data/               # DATABASE folder
│   └── project_db.json  # Template definition (canvas config, fields, components)
│                        # Canvas config stored here: width, height, ppc
│
└── /temp/               # Export processing
    └── (temporary files)
```

**Key Distinction:**

- **project.ctm** = Infrastructure manifest (static, never user-editable)
  - Structure paths: assetPath, dataPath, tempPath (relative for portability)
  - Database type + connection details
  - **File structure/manifest**: Expected folder structure (components with their image locations)
  - Allows fast validation on startup WITHOUT accessing database
  - If image missing: Can search external link based on component/value name, redownload, optimize, save locally
  - Encrypted in v1.1+ to protect credentials
  - **NEVER contains canvas config or template definition**
- **data/project_db.json** = Template definition (user creates via UI)
  - Canvas config (width, height, ppc)
  - All fields (name, description, etc.)
  - All components (images with conditional logic)
  - Layout information
  - **NO card data** (cards are user's responsibility, outside our scope)
  - Source of truth for template configuration

## Canvas Configuration

- **Storage**: In database (template definition, not infrastructure)
- **Properties**: Only 3 values
  - `canvasWidth`: pixels (typically 1000)
  - `canvasHeight`: pixels (typically 1800)
  - `ppc`: pixels per centimeter (density, typically 96)
- **Rendering**: Frontend reads canvasConfig dynamically from database
- **User Control**: Configured via UI dialog during project setup

## Stack & Standards

- **Electron 30+** with Vite
- **React 18** with TypeScript
- **Tailwind CSS v4**
- **Sharp** for image processing
- **Lowdb/MongoDB** for persistence

---

_See specific skills for backend or frontend responsibilities._
