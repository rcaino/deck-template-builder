# Deck Template Builder - Project Breakdown

## Overview

- **Status**: Código base existente → refactor + completar
- **Scope**: Full v1.0 con tests, config y documentación
- **Strategy**: Backend + Frontend en paralelo
- **Phases**: 4 (Setup → Parallel Dev → Integration → Polish)

---

## Phase 0: Foundation & Contracts

**Duration**: 1-2 sprints | **Blocker for**: Fase 1  
**Status**: ⭕ Not Started

### 0.1 Common Layer - Types & Constants

- [ ] **common/types.ts** - Define all interfaces
  - [ ] `ITemplate` - Template metadata (id, name, description)
  - [ ] `IComponent` - Visual component (imageOptions OR spriteOptions type)
    - [ ] `IComponentImageOptions` - Each value has different imagePath (no imageCoords)
    - [ ] `IComponentSpriteOptions` - All values share same imagePath with imageCoords
  - [ ] `IComponentValueImage` - For imageOptions type (value, label, imagePath)
  - [ ] `IComponentValueSprite` - For spriteOptions type (value, label, imagePath, imageCoords REQUIRED)
  - [ ] `IField` - Template field (id, name, type, position, style, validation)
  - [ ] `ICanvasConfig` - Canvas dimensions (width, height, ppc)
  - [ ] `ICTMManifest` - Project infrastructure manifest (version, structure paths, fileStructure validation, db config)
  - [ ] `IDatabase` - DB adapter interface (query, insert, update, delete, close)
  - [ ] `IDBConfig` - DB configuration (type: 'lowdb'|'mongodb', connection details)
  - [ ] `IResponse<T>` - Response wrapper (success, data, error)
  - [ ] `IImageCoords` - Image crop coordinates (x, y, width, height for sprite sheets)
  - **Note**: NO ICard type (cards are outside our scope - user's responsibility)
  - **Tests**: Unit tests for type integrity

- [ ] **common/constants.ts** - Fixed values
  - [ ] `DEFAULT_CANVAS_WIDTH = 1000` (default canvas width when creating new project)
  - [ ] `DEFAULT_CANVAS_HEIGHT = 1800` (default canvas height when creating new project)
  - [ ] `DEFAULT_PPC = 96` (default pixels per centimeter)
  - [ ] `DEFAULT_DB_TYPE = 'lowdb'`
  - [ ] `VALID_IMAGE_FORMATS = ['jpg', 'png', 'webp']`
  - [ ] `RELATIVE_ASSET_PATH = 'assets/images'` (where component images are stored)
  - **Note**: Canvas config is per-project in database (not global constants). Fields and components are user-defined.

### 0.2 Project Structure

- [ ] Create `/src/common/` directory
- [ ] Create `/src/main/` directory tree (database, services, ipc)
- [ ] Create `/src/renderer/src/` component tree (components, hooks, store)
- [ ] Create `/src/preload/` bridge file
- [ ] Validate tsconfig paths for imports

---

## Phase 1: Backend Layer

### 1.1 Database Abstraction Layer

**Blocker for**: IPC handlers (1.3)  
**Tests Required**: Unit tests for each adapter

#### 1.1.1 DbFactory

- [ ] **src/main/database/DbFactory.ts**
  - [ ] Create static `create(config: IDBConfig): IDatabase`
  - [ ] Support 'lowdb' case → new LowdbAdapter(config.path)
  - [ ] Support 'mongodb' case → new MongoAdapter(config.connection)
  - [ ] Error handling for unknown types
  - [ ] Logging for adapter selection
  - **Tests**: Factory pattern unit tests

#### 1.1.2 Lowdb Adapter

- [ ] **src/main/database/LowdbAdapter.ts**
  - [ ] Implement `IDatabase` interface
  - [ ] `query(collection, filter): Promise<any[]>`
  - [ ] `insert(collection, data): Promise<any>`
  - [ ] `update(collection, id, data): Promise<void>`
  - [ ] `delete(collection, id): Promise<void>`
  - [ ] `close(): Promise<void>`
  - [ ] Relative path validation (no absolute paths)
  - **Tests**: CRUD operations, filtering, error cases

#### 1.1.3 MongoDB Adapter

- [ ] **src/main/database/MongoAdapter.ts**
  - [ ] Implement `IDatabase` interface
  - [ ] Connection pooling
  - [ ] Retry logic for network failures
  - [ ] All methods from CRUD contract
  - [ ] Index management for common queries
  - **Tests**: Connection, CRUD, error recovery

### 1.2 Service Layer

**Blocker for**: IPC implementation (1.3)  
**Tests Required**: Integration tests with DbFactory

#### 1.2.1 ProjectLauncher Service

- [ ] **src/main/services/ProjectLauncher.ts**
  - [ ] Read project.ctm manifest from directory (infrastructure + fileStructure)
  - [ ] Parse JSON and validate against ICTMManifest schema
  - [ ] **Validate file structure** using fileStructure from manifest:
    - [ ] For each component in fileStructure, check if folder exists
    - [ ] For each expectedFile in component, check if image exists
    - [ ] If image missing: Try to find external link (by component/value name), download, optimize, save
    - [ ] If component folder missing: Create it (empty)
    - [ ] Report missing images that cannot be auto-recovered
  - [ ] Initialize database adapter from manifest config
  - [ ] Load template definition from database:
    - [ ] Load canvasConfig (width, height, ppc)
    - [ ] Load template (metadata)
    - [ ] Load all fields
    - [ ] Load all components
    - [ ] Load layout (if exists)
  - [ ] Return initialized state: { canvasConfig, template, fields, components, layout, validationReport }
  - [ ] Error handling for missing/corrupt .ctm, missing canvasConfig, DB connection failures
  - **Tests**: Manifest parsing, structure validation, DB initialization, image recovery

#### 1.2.2 AssetManager Service

- [ ] **src/main/services/AssetManager.ts**
  - [ ] `importComponentImage(file, componentName, value, projectPath)` - Convert + store
    - Query database for component definition
    - Validate component exists in database
    - Validate value exists in component.values
    - Convert to WebP (Sharp, quality 90, effort 6)
    - Save to `assets/images/{componentName}/{value}.webp` (relative path)
    - Return relative path
  - [ ] `getComponentImages(componentName, projectPath)` - List images for component
    - Scan assets/images/{componentName}/
    - Return mapping: { [value]: imagePath }
  - [ ] `listAllComponentImages(projectPath)` - Full asset map
    - Return: { [componentName]: { [value]: imagePath, ... }, ... }
  - [ ] Maintain relative paths (critical for portability)
  - [ ] Validate image format before conversion
  - **Tests**: WebP conversion, path validation, DB queries, batch operations

#### 1.2.3 Packager Service

- [ ] **src/main/services/Packager.ts**
  - [ ] ZIP project folder (all assets + database)
  - [ ] Unzip and restore project structure
  - [ ] Maintain relative paths during pack/unpack
  - [ ] Handle large files efficiently
  - **Tests**: Pack/unzip integrity, structure preservation

### 1.3 IPC Handlers

**Depends on**: 1.1, 1.2  
**Tests Required**: E2E tests via IPC

- [ ] **src/main/ipc/handlers.ts**
  - [ ] `project:load` → ProjectLauncher.execute()
  - [ ] `project:save` → Save cards to database
  - [ ] `assets:list` → AssetManager.listByCategory()
  - [ ] `assets:import` → AssetManager.importAndOptimize()
  - [ ] `project:export` → Packager.zip()
  - [ ] Response wrapper: `{ success, data?, error? }`
  - [ ] Validation middleware for input
  - [ ] Error logging and user-friendly errors
  - **Tests**: Handler invocation, response format, error cases

### 1.4 Main Process Entry

- [ ] **src/main/index.ts**
  - [ ] Create Electron window (1000x1800 design area reference)
  - [ ] Register asset:// protocol
  - [ ] Map asset:// → projects/{projectName}/assets/images/
  - [ ] Load preload bridge
  - [ ] Initialize IPC handlers
  - [ ] Handle app lifecycle (ready, close, etc.)
  - **Tests**: Protocol registration, window creation

---

## Phase 2: Frontend Layer

### 2.1 State Management

**Blocker for**: All components (2.2+)  
**Tests Required**: Unit tests for store mutations

#### 2.1.1 Template Store (Zustand)

- [ ] **src/renderer/src/store/useTemplateStore.ts**
  - [ ] State: `template: ITemplate | null` (metadata)
  - [ ] State: `fields: IField[]` (all template fields)
  - [ ] State: `components: IComponent[]` (all template components)
  - [ ] State: `selectedFieldId: string | null` (for editing)
  - [ ] State: `selectedComponentId: string | null` (for editing)
  - [ ] Action: `loadTemplate(template, fields, components)` (called from ProjectLauncher)
  - [ ] Action: `addField(field: IField)` + API call to save
  - [ ] Action: `updateField(fieldId, updates)` + API call
  - [ ] Action: `removeField(fieldId)` + API call
  - [ ] Action: `addComponent(component: IComponent)` + API call to save
  - [ ] Action: `updateComponent(componentId, updates)` + API call
  - [ ] Action: `removeComponent(componentId)` + API call
  - [ ] Action: `resetStore()`
  - [ ] Devtools integration for debugging
  - **Tests**: Store mutations, field/component CRUD, API integration

#### 2.1.2 Dialog Store (Zustand)

- [ ] **src/renderer/src/store/useDialogStore.ts**
  - [ ] State: `openDialogs: { [key: string]: any }` (dialog type → data)
  - [ ] Action: `openDialog(type: DialogType, data?: any)`
  - [ ] Action: `closeDialog(type: DialogType)`
  - [ ] Action: `updateDialogData(type, updates)`
  - [ ] Helper: `isDialogOpen(type): boolean`
  - [ ] Support multiple dialogs stacked (e.g., confirm before close)
  - **Tests**: Dialog lifecycle, stacking, data persistence

### 2.2 Hooks

**Depends on**: 2.1  
**Tests Required**: Hook tests with mock IPC

#### 2.2.1 useApi Hook

- [ ] **src/renderer/src/hooks/useApi.ts**
  - [ ] Wrap `window.api.invoke()`
  - [ ] Return `{ invoke: (channel, params) => Promise<IResponse> }`
  - [ ] Error handling and retry logic
  - [ ] Loading state management
  - **Tests**: IPC invocation, error handling

#### 2.2.2 useCardStore Hook

- [ ] Already defined in 2.1 (store access)
- [ ] Test selector pattern (not full store mutation)

#### 2.2.3 useAssets Hook (optional)

- [ ] **src/renderer/src/hooks/useAssets.ts**
  - [ ] Fetch assets by category via IPC
  - [ ] Cache results to avoid re-fetching
  - [ ] Handle image load failures
  - **Tests**: Caching, error recovery

### 2.3 Frontend Components

**Depends on**: 2.1, 2.2  
**Tests Required**: Component snapshot + interaction tests

#### 2.3.1 Canvas Component

- [ ] **src/renderer/src/components/canvas/Canvas.tsx**
  - [ ] **Read canvas dimensions** from `useTemplateStore.canvasConfig` (width, height, ppc)
  - [ ] Container size = `canvasConfig.width × canvasConfig.height` px
  - [ ] Render TemplatePreview showing fields + components positioned
  - [ ] Empty state if no template loaded
  - [ ] Responsive scaling (sm/md/lg preview with aspect-ratio)
  - [ ] Handle asset:// protocol image loading
  - **Tests**: Dynamic dimensions, state binding, empty state, aspect ratio

#### 2.3.2 TemplatePreview Sub-component

- [ ] **src/renderer/src/components/canvas/TemplatePreview.tsx**
  - [ ] Accept `template, fields, components` props
  - [ ] **Render template visualization**:
    - Loop through components: render each positioned image
    - Loop through fields: render each with position + style
    - Apply conditional logic (if field exists, show component)
  - [ ] Render each field with FieldRenderer
  - [ ] Memoization to prevent unnecessary re-renders
  - [ ] Error handling for missing component images (graceful degradation)
  - [ ] Show grid/guidelines for positioning (optional)
  - **Tests**: Props validation, template rendering, missing asset handling

#### 2.3.3 FieldRenderer Sub-component

- [ ] **src/renderer/src/components/canvas/FieldRenderer.tsx**
  - [ ] Accept `IField` prop
  - [ ] Apply CSS styles (fontSize, color, bold, align)
  - [ ] Responsive text sizing
  - [ ] Clickable for inspector selection
  - **Tests**: Style application, interactions

#### 2.3.4 Sidebar Component

- [ ] **src/renderer/src/components/sidebar/Sidebar.tsx**
  - [ ] **Fields section**: List of template fields
    - [ ] [+] Add field button
    - [ ] Display each field: name, type, position, style
    - [ ] Edit/Delete buttons
    - [ ] Click to select for canvas preview
  - [ ] **Components section**: List of template components
    - [ ] [+] Add component button
    - [ ] Display each component: name, type, values count
    - [ ] Edit/Delete buttons
    - [ ] Click to select for canvas preview
  - [ ] **Assets section**: Asset management
    - [ ] Component selector (todo add assets to which component?)
    - [ ] Value selector (add asset for which value?)
    - [ ] [+] Upload button
    - [ ] List of uploaded assets
  - [ ] Responsive layout
  - **Tests**: Field/component listing, add/edit/delete UI, asset uploading

#### 2.3.5 Inspector Component

- [ ] **src/renderer/src/components/inspector/Inspector.tsx**
  - [ ] Display editor for selected item (field or component)
  - [ ] **If field selected**: Field editor
    - [ ] Text input for field.name
    - [ ] Select for field.type (text, number, select, image)
    - [ ] Positioning controls (X, Y, Width, Height)
    - [ ] Style controls: fontSize, fontFamily, color, bold, align
    - [ ] Validation rules (minLength, maxLength, pattern)
  - [ ] **If component selected**: Component editor
    - [ ] Text input for component.name
    - [ ] Select for component.type (image, shape, text)
    - [ ] List of component.values with editors
    - [ ] Positioning for each value variant
    - [ ] Condition editor (if field exists, if field = value)
  - [ ] Live canvas update on change
  - [ ] Undo/Redo (optional, nice-to-have)
  - [ ] Save/Cancel buttons (or auto-save)
  - **Tests**: Field editing, component editing, live preview, persistence

#### 2.3.6 Dialog/Modal Components

**Responsabilidad**: Encapsular configuraciones complejas en UX limpia

- [ ] **src/renderer/src/components/dialogs/DialogProvider.tsx**
  - [ ] Context provider for dialog state (open, type, data)
  - [ ] Manage stack of dialogs (support multiple simultaneous?)
  - [ ] Methods: `openDialog(type, data)`, `closeDialog()`
  - [ ] Overlay dismissal handling (click outside, ESC key)
  - **Tests**: State management, event handling

- [ ] **src/renderer/src/components/dialogs/BaseDialog.tsx**
  - [ ] Reusable dialog wrapper (header, content, footer areas)
  - [ ] Overlay with blur effect + click-outside dismiss
  - [ ] Header with title + close button (X)
  - [ ] Footer with action buttons (Cancel, Save/Confirm)
  - [ ] Keyboard shortcut: ESC → close, ENTER → confirm
  - [ ] Focus trap (tab within dialog only)
  - [ ] Accessibility: aria-modal, aria-labelledby
  - **Tests**: Keyboard navigation, focus management, dismissal

- [ ] **src/renderer/src/components/dialogs/CanvasConfigDialog.tsx**
  - [ ] Edit canvas dimensions (width, height, ppc)
  - [ ] Input validation (positive numbers, reasonable defaults)
  - [ ] Live preview of aspect ratio change
  - [ ] Buttons: Reset to Default (1000x1800, 96 ppc), Cancel, Save
  - [ ] Tooltip: "Changes will reflow card layout"
  - [ ] Accessible form with labels + help text
  - **Tests**: Input validation, preview updates, save/cancel

- [ ] **src/renderer/src/components/dialogs/FieldsWizardDialog.tsx** ⭐ NEW
  - [ ] **Step 1**: Add first field
    - [ ] Field name input
    - [ ] Field type selector: text, number, option
    - [ ] Conditional fields based on type:
      - [ ] **text**: validation (minLength, maxLength, pattern)
      - [ ] **number**: validation (min, max)
      - [ ] **option**: Add option entries (value + label)
    - [ ] Position selector (X, Y, W, H)
    - [ ] Style editor (fontSize, fontFamily, color, bold, align)
    - [ ] Add Field / Cancel buttons
  - [ ] **Step N**: After each field, offer "Add Next Field" or "Finish Wizard"
  - [ ] **Summary**: Show added fields before completion
  - [ ] All fields saved to DB at completion
  - [ ] **Tests**: Field creation, validation, option management, step navigation

- [ ] **src/renderer/src/components/dialogs/ProjectSettingsDialog.tsx**
  - [ ] Template metadata editing
    - [ ] Project name
    - [ ] Project description
    - [ ] Template version
  - [ ] Save/Cancel buttons
  - [ ] **Tests**: Form submission, persistence, validation
  - [ ] **Note**: Canvas configuration edited in CanvasConfigDialog

- [ ] **src/renderer/src/components/dialogs/AssetImportDialog.tsx**
  - [ ] Component selector dropdown (from useTemplateStore.components)
  - [ ] Component type display (imageOptions or spriteOptions)
  - [ ] **If imageOptions**:
    - [ ] Value selector (from values array)
    - [ ] Single file upload
  - [ ] **If spriteOptions**:
    - [ ] Sprite sheet file upload
    - [ ] Image crop tool (visual imageCoords editor)
    - [ ] Preview of cropped regions
  - [ ] Drag-and-drop zone or file picker
  - [ ] File validation (image format: jpg, png, webp)
  - [ ] Conversion to WebP (Sharp, quality 90)
  - [ ] Progress indicator for conversion
  - [ ] Error handling per file (format, size, conversion)
  - [ ] Success confirmation: "Image saved to assets/images/{component}/{value}.webp"
  - [ ] Auto-close on success
  - **Tests**: File handling, component+value validation, upload, error states

#### 2.3.7 App.tsx Main Layout

- [ ] **src/renderer/src/App.tsx**
  - [ ] Three-column layout: Sidebar | Canvas | Inspector
  - [ ] Top navbar with project name + menu
  - [ ] Menu: File (New, Open, Save, Export)
  - [ ] Load project on app start
  - [ ] Sync state to backend on changes (auto-save)
  - **Tests**: Layout rendering, menu handler delegation

### 2.4 Frontend Styling

- [ ] **src/renderer/assets/main.css** - Tailwind imports
- [ ] **src/renderer/assets/base.css** - Global utilities
- [ ] Configure Tailwind v4 for custom canvas sizing
- [ ] Responsive breakpoints (sm, md, lg)
- [ ] **Tests**: Build validation, CSS class coverage

---

## Phase 3: Integration & E2E

### 3.1 Preload Bridge

- [ ] **src/preload/index.ts**
  - [ ] Expose `window.api.invoke(channel, params)`
  - [ ] Type safety for channel names
  - [ ] Error wrapping
  - **Tests**: Bridge invocation, type checking

### 3.2 IPC Integration Tests

- [ ] Test project:load → full flow (Sidebar → Canvas → Inspector)
- [ ] Test project:save → database persistence
- [ ] Test assets:import → WebP conversion → Sidebar display
- [ ] Test asset:// protocol → image loading in Canvas
- [ ] End-to-end: Load project → Edit card → Save → Reload
- [ ] **Tests**: E2E scenarios, state persistence

### 3.3 Error Recovery

- [ ] Handle corrupted project.ctm
- [ ] Handle missing assets directory
- [ ] Handle database connection failures
- [ ] Handle image conversion failures
- [ ] User-friendly error messages in Inspector
- [ ] **Tests**: Error scenarios, recovery

### 3.4 Performance Testing

- [ ] Canvas rendering with 100+ fields
- [ ] Asset list with 500+ images
- [ ] Large image conversion (5MB+)
- [ ] Profile with DevTools
- [ ] **Tests**: Benchmarks, profiling

---

## Phase 4: Testing, Docs & Polish

### 4.1 Test Coverage

**Minimum Target**: 70% coverage

- [ ] Unit tests for /common (types, constants)
- [ ] Unit tests for DbFactory + adapters
- [ ] Unit tests for Services (ProjectLauncher, AssetManager, Packager)
- [ ] Unit tests for Zustand store
- [ ] Component tests for Canvas, Sidebar, Inspector
- [ ] Integration tests for IPC handlers
- [ ] E2E tests for critical user flows
- [ ] **Setup**: Jest + React Test Library + Electron test runner

### 4.2 Configuration Files

- [ ] **.env.example** - DB_TYPE, DB_PATH, LOG_LEVEL
- [ ] **tsconfig.json** - Path mapping for @common, @main, @renderer
- [ ] **.eslintrc** - Consistent code style
- [ ] **jest.config.js** - Test setup
- [ ] **Electron security**: CSP headers, preload isolation

### 4.3 Documentation

- [ ] **docs/ARCHITECTURE.md** - Layer overview + design decisions
- [ ] **docs/DATABASE.md** - DbFactory, adapters, schema
- [ ] **docs/API.md** - IPC channels, request/response format
- [ ] **docs/COMPONENTS.md** - Canvas, Sidebar, Inspector props
- [ ] **docs/DEVELOPMENT.md** - Setup, running locally, debugging
- [ ] **docs/DEPLOYMENT.md** - Build, packaging, distribution

### 4.4 Build & Packaging

- [ ] Configure electron-builder for distribution
- [ ] Auto-update mechanism
- [ ] Asset optimization in build
- [ ] Code signing (macOS/Windows)
- [ ] Release notes automation

### 4.5 Performance Optimizations

- [ ] Memoize CardRenderer (prevent re-renders)
- [ ] Lazy load heavy libraries (html2canvas for export)
- [ ] Sidebar asset list virtualization (if 500+ images)
- [ ] Sharp processing queue (limit concurrent conversions)
- [ ] Asset caching by hash
- [ ] Dialog animations using CSS transitions (avoid re-renders)

### 4.6 Dialog/Modal System Polish

- [ ] Confirmation dialogs (unsaved changes warning)
- [ ] Error dialogs with retry logic
- [ ] Toast notifications for quick feedback (non-blocking)
- [ ] Focus management testing (keyboard trap within dialog)
- [ ] Animation consistency across all modal types
- [ ] Accessibility audit (WCAG 2.1 AA compliance)
- [ ] Testing: Dialog state, keyboard nav, animations

### 4.7 Nice-to-Have Features

- [ ] Undo/Redo for field edits
- [ ] Drag-to-reorder fields
- [ ] Card templates + template manager modal
- [ ] Batch import assets (modal wizard)
- [ ] Export to different formats (PNG, JPG, customizable DPI)
- [ ] Recent projects list + quick access
- [ ] Keyboard shortcuts guide modal (? key)
- [ ] Canvas zoom levels (50%, 75%, 100%, 150%)
- [ ] Multi-step wizards for complex workflows

---

## Execution Strategy

### Parallel Tracks (Phase 1 + 2)

```
Sprint 1-2: Foundation (Phase 0)
├─ Common types + constants (including ICanvasConfig)
└─ Directory structure

Sprint 3-5: Parallel Development
├─ TRACK A (Backend)
│  ├─ DbFactory + Adapters (Lowdb first)
│  ├─ Services (ProjectLauncher, AssetManager)
│  └─ IPC handlers (project:load, project:save, etc.)
│
└─ TRACK B (Frontend)
   ├─ Zustand stores (Card + Dialog)
   ├─ Base components (Canvas, Sidebar, Inspector)
   ├─ Dialog system (DialogProvider + BaseDialog)
   ├─ Canvas config dialog
   └─ Hooks (useApi, useAssets)

Sprint 6: Integration (Phase 3)
├─ Preload bridge
├─ E2E workflows (including dialog interactions)
└─ Error recovery + error dialogs

Sprint 7-8: Polish (Phase 4)
├─ Tests + coverage (dialog tests included)
├─ Dialog accessibility + animations
├─ Documentation (including dialog UX guidelines)
└─ Release prep
```

### Critical Path

1. **Common types** (blocks everything)
2. **DbFactory + Lowdb** (backend foundation)
3. **ProjectLauncher** (load projects)
4. **Zustand store** (frontend foundation)
5. **Canvas component** (visual core)
6. **IPC handlers** (bridge together)
7. **Integration tests** (verify workflow)

### Dependencies Summary

```
Phase 0 (Common)
    ↓
Phase 1 (Backend) ←→ Phase 2 (Frontend) [parallel]
    ↓                  ↓
Phase 3 (Integration)
    ↓
Phase 4 (Polish)
```

---

## Risk Mitigation

| Risk                             | Mitigation                              |
| -------------------------------- | --------------------------------------- |
| Asset conversion bottleneck      | Implement queue, profile early          |
| DB adapter switching             | Abstract IDatabase interface completely |
| Canvas performance (100+ fields) | Memoization, virtualization             |
| Cross-process IPC serialization  | Use JSON for all responses, type guards |
| Relative path bugs               | Comprehensive path tests, lint rules    |

---

## Metrics & Checkpoints

- **Week 1-2**: Common types + DbFactory complete + tests passing
- **Week 3-4**: ProjectLauncher + Canvas basic rendering
- **Week 5**: Full feature integration + E2E tests green
- **Week 6-8**: Polish, 70%+ test coverage, documentation complete

---

## Design Guidelines: Dialogs & Modals

### Philosophy

- **Keep main UI clean**: Complex configurations move to dialogs
- **User context**: Dialogs restrict actions to single task (avoid distractions)
- **Modern & polished**: Tailwind v4 + smooth animations
- **Accessible by default**: WCAG 2.1 AA compliance

### Dialog Anatomy

```
┌─────────────────────────────────────┐
│ Title                           [X] │  ← Header (title + close button)
├─────────────────────────────────────┤
│                                     │
│  Form/Content Area                  │  ← Content (main purpose)
│  - Labels, inputs, help text        │
│                                     │
├─────────────────────────────────────┤
│              [Cancel] [Primary]     │  ← Footer (actions, right-aligned)
└─────────────────────────────────────┘
```

### Tailwind v4 Styling Quick Ref

```
Overlay: fixed inset-0 bg-black/50 backdrop-blur-sm
Dialog:  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
         w-full sm:w-96 max-w-md bg-gray-900 rounded-lg shadow-xl p-6
         animate-[fadeInScale] (custom keyframe)

Buttons: px-4 py-2 rounded-md font-medium transition-colors 150ms
         Primary: bg-blue-600 hover:bg-blue-700 text-white
         Secondary: bg-gray-700 hover:bg-gray-600 text-white
```

### Dialog Lifecycle

1. **Open**: Focus first input, translate+fade animation (150ms)
2. **Active**: User can TAB within dialog (focus trap)
3. **Close**: Fade out (100ms), restore focus to trigger button
4. Types of close: (1) user Cancel button, (2) ESC key, (3) outside click

### Critical Dialog Types for v1

1. **Canvas Config Dialog** (PRIORITY - Project Creation)
   - Width + Height + PPC inputs with validation
   - Live aspect ratio preview
   - "Reset to Default" + "Cancel" + "Save" buttons
   - Shown on: New Project creation

2. **Fields Wizard Dialog** (PRIORITY - Initial Setup)
   - Step-by-step field creation: name, type, validation, position, style
   - Support types: text, number, option
   - Option management: add/remove option values
   - Multi-step: "Add Field" → "Add Next?" → "Finish"
   - All fields persisted at wizard completion

3. **Asset Import Dialog** (HIGH PRIORITY)
   - Component + Value selectors
   - Optional: Visual crop tool for spriteOptions
   - File upload + WebP conversion
   - Success confirmation

4. **Project Settings Dialog** (AFTER SETUP)
   - Template metadata (name, description, version)
   - "Save" + "Cancel" buttons

5. **Confirmation Dialogs** (IMPORTANT)
   - "Discard unsaved changes?" before closing
   - "Delete this field/component?" confirmation

6. **Error Dialogs** (IMPORTANT)
   - Show error message + reason
   - "Retry" + "Dismiss" buttons

### Dialog Testing Checklist

- [ ] Focus trap (TAB doesn't escape dialog)
- [ ] ESC key closes dialog
- [ ] Click outside dismisses (if applicable)
- [ ] Click Cancel/primary buttons work
- [ ] Keyboard ENTER activates primary button
- [ ] Focus returns to trigger on close
- [ ] Overlay blur effect works
- [ ] Animation smooth (no jank)
- [ ] Mobile responsive (vertical stacking)
- [ ] Screen reader announces dialog (aria-modal, aria-labelledby)

---

## Notes for Implementation

### Backend Priorities

1. **Relative paths is non-negotiable** → No `C:/Users/...` in database
2. **DbFactory must be production-ready** → Lowdb for dev, MongoDB for prod
3. **Asset optimization matters** → WebP quality 90, effort 6
4. **IPC response format** → Always `{ success, data?, error? }`

### Frontend Priorities

1. **Canvas dimensions from project** → Read from canvasConfig, NOT hardcoded constants
2. **Dialog system early** → Implement DialogProvider + BaseDialog in Sprint 3 (Phase 2)
3. **Zustand is source of truth** → No prop drilling, use selectors
4. **Responsive canvas sizing** → CSS aspect-ratio, dynamic width/height
5. **Asset protocol is critical** → Backend serves WebP via asset://
6. **Memoization prevents lag** → CardRenderer + dialog components must be memoized
7. **Accessibility first** → Dialog focus trap, keyboard shortcuts, aria attributes

### Testing Strategy

- Unit tests for pure functions (types, utils)
- Integration tests for IPC coupling
- Component tests for UI behavior
- E2E tests for critical user flows

---

**Generated**: 2026-04-02  
**Version**: 1.0 Full Scope  
**Status**: Ready for Sprint Planning
