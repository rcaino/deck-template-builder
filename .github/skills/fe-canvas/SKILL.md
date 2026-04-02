---
name: fe-canvas
description: Canvas component development and card rendering. Use when: building the main drawing area, handling card layout, rendering designs to WebP, or managing canvas interactions. Domain: React canvas and design rendering.
---

# Frontend Canvas Skill

## Canvas Component Location

src/renderer/src/components/canvas/Canvas.tsx

## Fixed Dimensions (Non-negotiable)

- Width: 1000px (CANVAS_BASE_WIDTH from constants)
- Height: 1800px (CANVAS_HEIGHT from constants)
- Imported from /common/constants.ts

## Architecture

- **Container**: Centered div with fixed size + overflow-hidden
- **CardRenderer sub-component**: Renders individual card content
- **State source**: useCardStore() for selectedCard

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
