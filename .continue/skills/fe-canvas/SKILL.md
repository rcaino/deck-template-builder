---
name: fe-canvas
description: Canvas component development and card rendering. Use when: building the main drawing area, handling card layout, rendering designs to WebP, or managing canvas interactions. Domain: React canvas and design rendering.
---

# Frontend Canvas Skill

## Canvas Component Location

src/renderer/src/components/canvas/Canvas.tsx

## Dynamic Dimensions

- **Source**: `project.canvasConfig` (from Zustand store, NOT globals)
- **Default**: 1000px W × 1800px H (if not configured)
- **Range**: Width 500-3000px, Height 800-5000px
- **Responsive**: CSS custom properties + aspect-ratio for scaling

## Architecture

- **Container**: Dynamic size based on canvasConfig + aspect-ratio scaling
- **CardRenderer sub-component**: Renders individual card content (responsive to canvas dims)
- **State source**: `useCardStore()` for selectedCard + project config

## Responsibilities

- Display empty state if no card selected
- Pass selected card to CardRenderer
- Handle responsive scaling (sm/md/lg breakpoints for preview)
- Export to WebP on demand

## CardRenderer Composition

Accepts ICard and renders:

- Hero image from asset:// protocol
- Title, description
- Dynamic fields from card.fields array
- FieldRenderer for each field (handles styling)

## Field Rendering

Each field has:

- Value, fontSize, color, bold, alignment
- Styling applied via inline React.CSSProperties
- Responsive text sizing

## Integration Points

- Gets data from Zustand store
- Listens for sidebar selection changes
- Should support drag-to-reorder fields
- Exports canvas to WebP via Main process

## Performance Considerations

- Memoize CardRenderer (only re-render on card.id change)
- Cache image loads (asset protocol handles this)
- Lazy load heavy libraries
