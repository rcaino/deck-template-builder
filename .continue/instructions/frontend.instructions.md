---
name: frontend-standards
description: Coding standards and patterns for frontend (Renderer process). Use when: building React components, managing canvas, sidebar, inspector, or global state. Applies to src/renderer/**
applyTo: "src/renderer/**"
---

# Frontend Standards

## Component Structure

### Canvas Component (`/components/canvas/`)

- **Dynamic dimensions**: Read from `project.canvasConfig`
- Renders card design live with responsive scaling
- Respond to sidebar selection and inspector edits
- Use Zustand store for card state + project config
- Support customizable canvas size per project (500-3000w, 800-5000h)

### Sidebar Component (`/components/sidebar/`)

- **Dynamic component tabs** (from `useCardStore.components`)
- Each tab represents a project component (hero_class, rarity, element, etc.)
- Display WebP images for each component value (tanque, dps, healer, etc.)
- Click image → `updateCard({ components: { [componentName]: selectedValue } })`
- Images served via `asset://{componentName}/{value}.webp` protocol
- Trigger selection updates to store

### Inspector Component (`/components/inspector/`)

- Edit card fields (name, values, styling)
- Apply styles to canvas via store
- Sync changes back to Main process

## State Management (Zustand)

## IPC Communication

```typescript
// In component hook
const { api } = useApi(); // Preload bridge

async function saveProject() {
  const response = await api.invoke("project:save", {
    projectId: "my-deck",
    data: cardStore.cards
  });

  if (response.success) {
    // Update local state
  }
}
```

## Asset Loading

- Images via `asset://` protocol (Main process serves)
- Fallback to placeholder if load fails
- Cache in component state to avoid re-fetching

## File Naming

- Hooks: `use[Name].ts` (e.g., `useCardStore.ts`, `useApi.ts`)
- Components: `[Name].tsx` (e.g., `Canvas.tsx`, `Sidebar.tsx`)
- Store files: `[domain]Store.ts` (e.g., `cardStore.ts`)

## Performance

- Memoize expensive components
- Use `useCallback` for event handlers passed to child components
- Lazy load heavy libraries (Sharp preview, etc.)
