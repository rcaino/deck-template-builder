---
name: fe-ui
description: UI components, sidebar, inspector, and state management. Use when: building sidebar asset browser, inspector field editor, or managing Zustand stores. Domain: React components and global state.
---

# Frontend UI & State Management Skill

## State Management (Zustand)

Location: src/renderer/src/hooks/useCardStore.ts

Store should track:

- cards[] - Array of ICard
- selectedCard - Current ICard | null
- selectedFieldId - Current field ID
- Actions: loadCards, selectCard, updateCard, updateField, addField, removeField

## Sidebar Component

Location: src/renderer/src/components/sidebar/Sidebar.tsx

Responsibilities:

- Display asset categories (hero_class, item_type, etc.)
- List WebP images from asset:// protocol
- On click → update selectedCard via store
- Error handling for failed image loads
- Category tabs for filtering

## Inspector Component

Location: src/renderer/src/components/inspector/Inspector.tsx

Responsibilities:

- Edit selected field properties (value, fontSize, color, bold, align)
- Display field no-selection state
- Update via store → re-renders Canvas live
- Input types: text, number, color picker, checkbox

## IPC Hook

Location: src/renderer/src/hooks/useApi.ts

Exposes window.api:

- invoke(channel: string, params: any) → returns { success, data?, error? }
- Used for backend communication (save, load, export)
- Error handling wrapper around preload bridge

## Store Subscription Pattern

- Effects subscribe to store changes
- No direct render-time subscriptions
- Persist store changes to IPC for backend sync

## Performance

- Memoize components to avoid re-render cascades
- Use useCallback for event handlers passed to children
- Selector pattern for store subscriptions (not full store)
