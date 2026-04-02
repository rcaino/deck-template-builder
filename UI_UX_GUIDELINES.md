# UI/UX Guidelines - Dialog & Modal System

## Overview

This document defines the design system for dialogs and modals across Deck Template Builder. The goal is to keep the main interface clean while providing powerful configuration options through focused modal dialogs.

---

## Dialog Hierarchy & Usage

### 1. **Canvas Configuration Dialog** (Priority: v1)

**Purpose**: Customize canvas dimensions per project  
**Trigger**: Settings gear icon in navbar → "Canvas Size"

```
┌─────────────────────────────────────────────┐
│ Canvas Dimensions                       [X] │
├─────────────────────────────────────────────┤
│                                             │
│  Width (px)                                 │
│  [━━━━━ 1200 ━━━━━]  [500 - 3000]         │
│                                             │
│  Height (px)                                │
│  [━━━━ 1800 ━━━━]   [800 - 5000]          │
│                                             │
│  Preview:                                   │
│  Aspect Ratio: 0.67:1                      │
│  ⚠️ Fields may overflow at this size       │
│                                             │
├─────────────────────────────────────────────┤
│  [Reset Default]      [Cancel] [Save]      │
└─────────────────────────────────────────────┘
```

**Validation**:

- Width: 500-3000px (show error if outside range)
- Height: 800-5000px (show error if outside range)
- Live preview aspect ratio updates

**Actions**:

- **Reset Default**: Set to 1000×1800
- **Cancel**: Close without saving
- **Save**: Update project.ctm + reload canvas

---

### 2. **Confirmation Dialog** (Priority: v1)

**Purpose**: Prevent accidental destructive actions  
**Scenarios**:

- Close modified card without saving
- Delete card
- Discard changes

```
┌────────────────────────────────────────┐
│ Discard Changes?                    [X]│
├────────────────────────────────────────┤
│                                        │
│ You have unsaved changes to this card. │
│ Are you sure you want to discard them? │
│                                        │
├────────────────────────────────────────┤
│                   [Cancel] [Discard]   │
└────────────────────────────────────────┘
```

**Actions**:

- **Cancel**: Go back (close dialog, keep changes)
- **Discard**: Proceed with destructive action

**Visual**: Red/warning color for destructive button

---

### 3. **Error Dialog** (Priority: v1)

**Purpose**: Inform user of validation errors or failures  
**Scenarios**:

- Image conversion failed
- Database connection error
- Invalid project manifest

```
┌────────────────────────────────────────┐
│ Error                               [X]│
├────────────────────────────────────────┤
│                                        │
│ 🔴 Failed to convert image to WebP    │
│                                        │
│ Details: Memory limit exceeded         │
│                                        │
├────────────────────────────────────────┤
│                      [Retry] [Dismiss] │
└────────────────────────────────────────┘
```

**Actions**:

- **Retry**: Reattempt operation
- **Dismiss**: Close without retrying

---

### 4. **Asset Import Dialog** (Priority: v1.1)

**Purpose**: Batch upload and optimize images  
**Trigger**: Sidebar "Import Assets" button

```
┌─────────────────────────────────────────────┐
│ Import Assets                           [X] │
├─────────────────────────────────────────────┤
│                                             │
│  Category: [hero_class ▼]                   │
│                                             │
│  📁 Drag files here or click to browse      │
│  Supported: JPG, PNG, WebP                  │
│                                             │
│  Progress: ████████░░ (8/10) 80%            │
│  Converting: warrior_01.jpg                 │
│                                             │
├─────────────────────────────────────────────┤
│                    [Cancel] [Complete]      │
└─────────────────────────────────────────────┘
```

---

### 5. **Project Settings Dialog** (Priority: v1.1)

**Purpose**: Configure project-level settings  
**Trigger**: Menu → File → Settings

```
┌──────────────────────────────────────────────┐
│ Project Settings                         [X] │
├──────────────────────────────────────────────┤
│                                              │
│ Project Name                                 │
│ [MyDeck Expansion Set________________]       │
│                                              │
│ Database Type                                │
│ ○ Lowdb (Local File) ● MongoDB (Cloud)      │
│                                              │
│ Asset Categories                             │
│ + [hero_class] [X]                           │
│ + [item_type]  [X]                           │
│ + [Add new...                                │
│                                              │
├──────────────────────────────────────────────┤
│                     [Cancel] [Save]          │
└──────────────────────────────────────────────┘
```

---

## Design System

### Colors (Tailwind v4)

```
Background: bg-gray-900 (dialog body)
Overlay: bg-black/50 (semi-transparent)
Border: border-gray-700
Text: text-gray-100 (main), text-gray-400 (secondary)
Input: bg-gray-800, border-gray-700, focus:border-blue-500
Accent: text-blue-400 (help text), hover:text-blue-300
Error: text-red-500, bg-red-500/10
Success: text-green-500, bg-green-500/10
```

### Spacing & Typography

```
Dialog padding: 24px (p-6)
Header: text-lg font-bold mb-6
Label: text-sm font-semibold mb-2
Help text: text-xs text-gray-400 mt-1
Input height: 40px (py-2 px-3)
Button height: 40px (px-4 py-2)
Border radius: rounded-lg (12px)
```

### Buttons

```
Primary (Save/Confirm):
  bg-blue-600 hover:bg-blue-700 text-white

Secondary (Cancel):
  bg-gray-700 hover:bg-gray-600 text-white

Destructive (Delete/Discard):
  bg-red-600 hover:bg-red-700 text-white

Tertiary (Reset):
  text-blue-400 border border-blue-400 hover:bg-blue-400/10
```

All buttons: `transition-colors 150ms active:scale-95`

### Animation

```
Dialog Enter: fade-in + scale-up
  opacity: 0 → 1 (200ms)
  transform: scale-95 → scale-100 (200ms)
  timing: cubic-bezier(0.4, 0, 0.2, 1)

Dialog Exit: fade-out + scale-down
  opacity: 1 → 0 (100ms)
  transform: scale-100 → scale-95 (100ms)

Overlay Fade: 200ms opacity

Easing: cubic-bezier(0.4, 0, 0.2, 1) for enter
        cubic-bezier(0.4, 0, 1, 1) for exit (snappy)
```

---

## Accessibility & Keyboard Support

### Focus Management

- **On open**: Focus first focusable element (usually first input)
- **Tab cycle**: Only cycle within dialog (focus trap)
- **On close**: Return focus to trigger button

### Keyboard Shortcuts

```
Enter       → Activate primary button (Submit/Save)
Escape      → Close dialog (if closable)
Tab         → Next focusable element (trapped)
Shift+Tab   → Previous focusable element (trapped)
```

### ARIA Attributes

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialogTitle" aria-describedby="dialogDesc">
  <h2 id="dialogTitle">Dialog Title</h2>
  <p id="dialogDesc">Dialog description/usage</p>
</div>
```

### Testing Accessibility

- Use Tab to navigate (no pointer)
- Verify focus is visible on all interactive elements
- Test with screen reader (NVDA, JAWS, VoiceOver)
- Ensure text contrast at least 4.5:1 (WCAG AA)

---

## Implementation Checklist

### DialogProvider (Context)

- [ ] Manages dialog state: `{ [type]: isOpen }`
- [ ] Methods: `openDialog(type, data)`, `closeDialog(type)`
- [ ] Wraps App.tsx at root level
- [ ] Exposes via hook: `useDialog()`

### BaseDialog Component

- [ ] Overlay (clickable to dismiss)
- [ ] Dialog box (centered, shadow, rounded)
- [ ] Header with title + close button
- [ ] Content area (children)
- [ ] Footer with action buttons
- [ ] Focus trap (useFocusTrap hook)
- [ ] Keyboard shortcuts (useKeypress hook)
- [ ] Animations (Framer Motion or CSS keyframes)

### Dialog-Specific Components

- [ ] CanvasConfigDialog
- [ ] ConfirmationDialog
- [ ] ErrorDialog
- [ ] AssetImportDialog (v1.1)
- [ ] ProjectSettingsDialog (v1.1)

### Testing

- [ ] Unit: Dialog open/close state
- [ ] Component: Focus trap, keyboard nav, animations
- [ ] E2E: User workflows (open → fill form → save → verify)
- [ ] Accessibility: Focus visible, keyboard only nav, screen reader

---

## Dos & Don'ts

### ✅ Do

- Keep dialogs focused on one task
- Use clear, concise titles
- Provide help text for complex inputs
- Show validation errors inline
- Use loading states for async operations
- Close for simple actions (no "Are you sure?" fatigue)
- Support ESC to close (standard behavior)

### ❌ Don't

- Overflow dialog content (scroll if needed)
- Use generic titles like "Settings" without context
- Stack too many dialogs (nest confirmation inside config)
- Forget focus management (users using keyboard)
- Animate too much (distraction, performance)
- Close without saving (ask first if data was modified)
- Use loading spinners for < 1 second (jank)

---

## Examples

### Loading State in Dialog

```jsx
{isLoading ? (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
    <span className="ml-2 text-gray-300">Processing...</span>
  </div>
) : (
  /* dialog content */
)}
```

### Inline Error Message

```jsx
<div>
  <label className="text-sm font-semibold mb-2">Width</label>
  <input
    type="number"
    value={width}
    className={`w-full px-3 py-2 bg-gray-800 rounded-md border transition-colors ${
      error ? "border-red-500" : "border-gray-700 focus:border-blue-500"
    }`}
  />
  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
</div>
```

---

**Last Updated**: 2026-04-02  
**Version**: 1.0  
**Status**: Ready for Implementation
