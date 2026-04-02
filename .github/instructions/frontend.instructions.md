---
name: frontend-standards
description: Coding standards and patterns for frontend (Renderer process). Use when: building React components, managing canvas, sidebar, inspector, or global state. Applies to src/renderer/**
applyTo: "src/renderer/**"
---

# Frontend Standards

## Component Structure

### Canvas Component (`/components/canvas/`)

- **Fixed dimensions**: 1000x1800px (from `CANVAS_BASE_WIDTH` constant)
- Renders card design live
- Respond to sidebar selection and inspector edits
- Use Zustand store for card state

### Sidebar Component (`/components/sidebar/`)

- List of asset categories (hero_class, item_type, etc.)
- Display WebP images from `asset://` protocol
- Trigger selection updates to store

### Inspector Component (`/components/inspector/`)

- Edit card fields (name, values, styling)
- Apply styles to canvas via store
- Sync changes back to Main process

## State Management (Zustand)

```typescript
import create from "zustand";

interface CardStore {
  cards: ICard[];
  selectedCard: ICard | null;
  updateCard: (id: string, updates: Partial<ICard>) => void;
}

export const useCardStore = create<CardStore>((set) => ({
  cards: [],
  selectedCard: null,
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c))
    }))
}));
```

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

## Styling with Tailwind v4

- Use `base.css` for global utilities
- Component-level: inline Tailwind classes
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Custom canvas sizing: Already set to 1000x1800px

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
