# Deck Template Builder - Breakdown Iterativo

## 🎯 Filosofía

Cada iteración entrega **valor funcional visible** que puede ser testeado y demostrado. Los sprints están organizados para permitir trabajo paralelo sin bloqueos, comenzando con UI + tipos compartidos.

---

## 📋 Hitos de Entrega

| Hito                         | Valor Entregado                                  | Prioridad   |
| ---------------------------- | ------------------------------------------------ | ----------- |
| **Foundation**               | Tipos + estructura + DbFactory                   | 🔴 BLOCKER  |
| **Hito 1: UI Shell**         | App funcional con menú + sidebar                 | 🟠 CRITICAL |
| **Hito 2: Project Creation** | Crear proyecto + Canvas Config dialog            | 🟠 CRITICAL |
| **Hito 3: Fields Wizard**    | Definir campos (CRUD paso a paso)                | 🟠 CRITICAL |
| **Hito 4: Components**       | Agregar componentes (imageOptions/spriteOptions) | 🟡 HIGH     |
| **Hito 5: Asset Import**     | Subir imágenes + renderizar canvas               | 🟡 HIGH     |
| **Hito 6: Export & Polish**  | Exportar template + tests + docs                 | 🟡 HIGH     |

---

# 🏗️ Foundation Phase (Shared)

## F1: Common Types & Constants

- [ ] **src/common/types.ts** - Define all interfaces
  - [ ] `ITemplate` (id, name, description, version)
  - [ ] `ICanvasConfig` (width, height, ppc)
  - [ ] `IField` (id, name, type, position, style, validation)
    - Types: "text" | "number" | "option"
  - [ ] `IComponentValueImage` (value, label, imagePath)
  - [ ] `IComponentValueSprite` (value, label, imageCoords)
  - [ ] `IImageCoords` (x, y, width, height)
  - [ ] `IComponentImageOptions` (type="imageOptions", position, zIndex, values[])
  - [ ] `IComponentSpriteOptions` (type="spriteOptions", position, zIndex, imagePath, values[])
  - [ ] `IComponent = IComponentImageOptions | IComponentSpriteOptions`
  - [ ] `ICTMManifest` (version, structure, fileStructure, db config)
  - [ ] `IDBConfig` (type, path OR connectionString)
  - [ ] `IDatabase` (query, insert, update, delete, close)
  - [ ] `IResponse<T>` (success, data, error)
  - **Tests**: Type validation

- [ ] **src/common/constants.ts**
  - [ ] `DEFAULT_CANVAS_WIDTH = 1000`
  - [ ] `DEFAULT_CANVAS_HEIGHT = 1800`
  - [ ] `DEFAULT_PPC = 96`
  - [ ] `VALID_IMAGE_FORMATS = ['jpg', 'png', 'webp']`
  - [ ] `RELATIVE_ASSET_PATH = 'assets/images'`

## F2: Directory Structure & Tsconfig

- [ ] Create `/src/main/` tree
  - `/database/` (DbFactory, adapters)
  - `/services/` (ProjectLauncher, AssetManager, Packager)
  - `/ipc/` (handlers)
- [ ] Create `/src/renderer/src/` tree
  - `/components/` (Canvas, Sidebar, Inspector, dialogs)
  - `/hooks/` (useApi, useAssets)
  - `/store/` (Zustand stores)
  - `/assets/` (CSS)
- [ ] Update `tsconfig.json` with path aliases:
  - `@common` → `src/common`
  - `@main` → `src/main`
  - `@renderer` → `src/renderer/src`

## F3: Database Abstraction

- [ ] **src/main/database/DbFactory.ts**
  - [ ] Static `create(config: IDBConfig): IDatabase`
  - [ ] Support 'lowdb' → new LowdbAdapter
  - [ ] Support 'mongodb' → new MongoAdapter
  - **Tests**: Factory pattern

- [ ] **src/main/database/LowdbAdapter.ts**
  - [ ] Implement IDatabase interface
  - [ ] `query(collection, filter)`
  - [ ] `insert(collection, data)`
  - [ ] `update(collection, id, data)`
  - [ ] `delete(collection, id)`
  - [ ] Relative path validation
  - **Tests**: CRUD operations, path validation

- [ ] **src/main/database/MongoAdapter.ts** (dapat en Iter 5+)
  - [ ] Implement IDatabase interface
  - [ ] Connection pooling
  - [ ] All CRUD methods
  - **Tests**: Connection, CRUD

---

# 🎨 Hito 1: UI Shell & Navigation

**Objetivo**: Aplicación vacía funcional con estructura principal visible  
**Entregable**: App puede abrirse, navegar menú, ver sidebar vacío

## B1.1: Preload Bridge

- [ ] **src/preload/index.ts**
  - [ ] Expose `window.api.invoke(channel, params): Promise<IResponse>`
  - [ ] Basic IPC error wrapping
  - **Tests**: Bridge invocation

## B1.2: Main Process Basic

- [ ] **src/main/index.ts**
  - [ ] Create Electron window (900x700 initial)
  - [ ] Load preload bridge
  - [ ] Register ipcMain handlers (stub: project:ping → pong)
  - [ ] No database yet - just UI frame
  - **Tests**: Window creation, IPC connection test

## F1.1: Zustand Store (Shell)

- [ ] **src/renderer/src/store/useTemplateStore.ts**
  - State: `isLoading: boolean`
  - State: `error: string | null`
  - Action: `setLoading(bool)`
  - Action: `setError(msg)`
  - **Tests**: State mutations

- [ ] **src/renderer/src/store/useDialogStore.ts**
  - State: `openDialogs: { [key: string]: boolean }`
  - Action: `openDialog(type)`
  - Action: `closeDialog(type)`
  - **Tests**: Dialog state lifecycle

## F1.2: Layout Components

- [ ] **src/renderer/src/components/App.tsx** - Main layout shell
  - Three-column: Sidebar | Canvas | Inspector
  - Top navbar with project name + menu
  - Grid layout (tailwind)
  - Menu items: File (New, Open, Export), Help
  - No functionality yet - just DOM structure
  - **Tests**: Layout rendering

- [ ] **src/renderer/src/components/Navbar.tsx**
  - Title: "Deck Template Builder"
  - Menu: File dropdown (stub handlers)
  - Status indicator: "No project loaded"
  - **Tests**: Menu button rendering

- [ ] **src/renderer/src/components/Canvas.tsx**
  - Empty box (1000x1800 px ratio aspect-ratio)
  - "Create a project to begin" placeholder
  - Responsive sizing
  - **Tests**: Responsive dimensions

- [ ] **src/renderer/src/components/Sidebar.tsx**
  - Empty sections: Fields, Components, Assets
  - Tab structure (if applicable)
  - "Ready for project" message
  - **Tests**: Section rendering

- [ ] **src/renderer/src/components/Inspector.tsx**
  - Empty form area
  - "Select a field or component to edit" message
  - **Tests**: Empty state

## F1.3: Styling & Tailwind Setup

- [ ] Configure Tailwind CSS v4
- [ ] Global CSS imports
- [ ] Custom color palette
- [ ] Responsive breakpoints

## F1.4: Tests

- [ ] Component snapshot tests (App, Navbar, Canvas, Sidebar, Inspector)
- [ ] Store tests (mutations)
- [ ] IPC bridge test

**✅ Hito 1 Completado**: App abre → UI visible → menú responsive

---

# 📁 Hito 2: Project Creation & Canvas Config

**Objetivo**: Crear nuevo proyecto con diálogo de canvas config  
**Entregable**: Nuevo proyecto → project.ctm + base DB creada → Canvas config mostrado

## B2.1: ProjectLauncher Service

- [ ] **src/main/services/ProjectLauncher.ts**
  - [ ] `createNewProject(projectPath, canvasWidthHeight, ppc)`
    - [ ] Create folder structure: assets/images, data/
    - [ ] Create project.ctm manifest (version, structure, db config)
    - [ ] Initialize database with schema (collections: canvasConfig, template, fields, components)
    - [ ] Save canvasConfig to database
    - [ ] Return { canvasConfig, template, fields, components }
  - [ ] `loadProject(projectPath)`
    - [ ] Read project.ctm
    - [ ] Validate ICTMManifest schema
    - [ ] Initialize DbFactory with db config
    - [ ] Load canvasConfig, template, fields, components from DB
    - [ ] Return { canvasConfig, template, fields, components }
  - **Tests**: Project creation (folder structure), manifest validation, DB initialization

## B2.2: IPC Handlers

- [ ] **src/main/ipc/handlers.ts**
  - [ ] `project:create` (projectPath, width, height, ppc)
    - ProjectLauncher.createNewProject()
    - Return initialized state
  - [ ] `project:load` (projectPath)
    - ProjectLauncher.loadProject()
    - Return initialized state
  - [ ] Response wrapper: `{ success: bool, data?, error? }`
  - **Tests**: Handler invocation, response format

## F2.1: Dialogs Infrastructure

- [ ] **src/renderer/src/components/dialogs/DialogProvider.tsx**
  - Context: `{ openDialogs, openDialog(), closeDialog() }`
  - Manage dialog stack
  - Support multiple simultaneous dialogs
  - **Tests**: Context provider

- [ ] **src/renderer/src/components/dialogs/BaseDialog.tsx**
  - Reusable wrapper: header + content + footer
  - Overlay with blur
  - Close button (X)
  - Focus trap (TAB within dialog)
  - ESC key closes
  - Click-outside dismissal
  - Keyboard accessible (aria-modal, aria-labelledby)
  - **Tests**: Focus trap, keyboard shortcuts, dismissal

## F2.2: CanvasConfigDialog

- [ ] **src/renderer/src/components/dialogs/CanvasConfigDialog.tsx**
  - [ ] Input fields: Width, Height, PPC
  - [ ] Validation: positive numbers, reasonable defaults
  - [ ] Live aspect ratio preview
  - [ ] Buttons: "Reset to Default", "Cancel", "Create Project" (or "Save")
  - [ ] On save: API call to `project:create`
  - [ ] On success: Close dialog, load template state
  - **Tests**: Input validation, form submission, error handling

## F2.3: File Menu Actions

- [ ] **src/renderer/src/components/Navbar.tsx** - Update
  - [ ] "File → New Project" → Open CanvasConfigDialog
  - [ ] "File → Open Project" → Folder picker (TODO: Iter 4)
  - **Tests**: Menu handlers

## F2.4: Store Updates

- [ ] **src/renderer/src/store/useTemplateStore.ts** - Extend
  - State: `canvasConfig: ICanvasConfig | null`
  - State: `template: ITemplate | null`
  - State: `fields: IField[]`
  - State: `components: IComponent[]`
  - Action: `loadTemplate(state)`
  - Action: `resetStore()`
  - **Tests**: Store state management, action handlers

## F2.5: Hooks

- [ ] **src/renderer/src/hooks/useApi.ts**
  - Wrapper: `invoke(channel, params) → Promise<IResponse>`
  - Error handling and retry logic
  - **Tests**: IPC invocation, error handling

## F2.6: Canvas Component Update

- [ ] **src/renderer/src/components/Canvas.tsx** - Update
  - Read `canvasConfig` from store
  - Display canvas with correct dimensions (aspect-ratio)
  - Show placeholder if no template loaded
  - **Tests**: Dynamic dimensions from store

## F2.7: Tests

- [ ] E2E: New Project flow (dialog → project created → canvas visible)
- [ ] ProjectLauncher tests (creation, loading)
- [ ] Dialog tests (focus, submission)
- [ ] Store tests (template loading)

**✅ Hito 2 Completado**: Crear proyecto nuevo → Dialog canvas config → Canvas muestra dimensiones correctas

---

# 🧩 Hito 3: Fields Wizard (Multi-step)

**Objetivo**: Definir campos del template paso a paso  
**Entregable**: Fields wizard completo → CRUD de fields → Persistencia en DB

## B3.1: Extend ProjectLauncher

- [ ] `addField(projectPath, field: IField) → Promise<IField>`
- [ ] `updateField(projectPath, fieldId, updates) → Promise<void>`
- [ ] `removeField(projectPath, fieldId) → Promise<void>`
- **Tests**: Field CRUD operations in DB

## B3.2: IPC Handlers

- [ ] **src/main/ipc/handlers.ts** - Extend
  - [ ] `field:add` (projectPath, field)
  - [ ] `field:update` (projectPath, fieldId, updates)
  - [ ] `field:remove` (projectPath, fieldId)
  - **Tests**: Handler invocation, DB updates

## F3.1: FieldsWizardDialog (Multi-step)

- [ ] **src/renderer/src/components/dialogs/FieldsWizardDialog.tsx**
  - **Step 1: Field Definition**
    - [ ] Input: Field name
    - [ ] Select: Field type (text, number, option)
    - [ ] Conditional inputs based on type:
      - **text**: minLength, maxLength, pattern (regex)
      - **number**: min, max value
      - **option**: Add option entries (value + label)
    - [ ] Action: "Add Option" button (for option type)
    - [ ] Option list with delete buttons
  - **Step 2: Positioning & Style**
    - [ ] Position inputs: X, Y, Width, Height
    - [ ] Style inputs: fontSize, fontFamily, color, bold, align
    - [ ] Live preview of text styling
  - **Step 3: Summary**
    - [ ] Show added fields so far
    - [ ] "Add Another Field" or "Finish Wizard"
  - [ ] On finish: Save all fields to DB via API
  - [ ] UI flow: Step 1 → Step 2 → Step 3 → (repeat 1-2 or Finish)
  - **Tests**: Multi-step navigation, field creation, validation, option management

## F3.2: Sidebar Update (Fields Tab)

- [ ] **src/renderer/src/components/Sidebar.tsx** - Extend
  - **Fields Tab**:
    - [ ] List all fields (from store)
    - [ ] Each field shows: name, type, position
    - [ ] [+] "Add Field" button → Opens FieldsWizardDialog
    - [ ] [Edit], [Delete] buttons per field
    - [ ] Selectable (highlight to edit in Inspector)
  - **Tests**: Field listing, button handlers

## F3.3: Inspector Update (Field Editor)

- [ ] **src/renderer/src/components/Inspector.tsx** - Extend
  - [ ] When field selected:
    - [ ] Display field.name, field.type
    - [ ] Editable position (X, Y, W, H)
    - [ ] Editable style (fontSize, fontFamily, color, bold, align)
    - [ ] Editable validation rules
    - [ ] Live preview of styled field name on canvas
    - [ ] [Save Changes], [Delete Field], [Cancel] buttons
  - **Tests**: Field editing, live preview, persistence

## F3.4: Canvas Preview (Fields)

- [ ] **src/renderer/src/components/Canvas.tsx** - Extend
  - [ ] Create `TemplatePreview.tsx` sub-component
    - [ ] Loop through store.fields
    - [ ] Render each field with position + style applied
    - [ ] Render placeholder text (field.name)
    - [ ] Clickable → Select in Inspector
  - [ ] Responsive scaling
  - **Tests**: Field rendering, positioning

## F3.5: Store Updates (Fields)

- [ ] **src/renderer/src/store/useTemplateStore.ts** - Extend
  - Action: `addField(field)` + API call
  - Action: `updateField(fieldId, updates)` + API call
  - Action: `removeField(fieldId)` + API call
  - Action: `selectField(fieldId)`
  - State: `selectedFieldId`
  - **Tests**: Field CRUD in store, API integration

## F3.6: Tests

- [ ] E2E: Add field → Edit in inspector → Save → Reload project
- [ ] FieldsWizardDialog: Multi-step navigation, validation
- [ ] Store: Field CRUD operations
- [ ] Canvas: Field rendering with correct styling

**✅ Hito 3 Completado**: Crear fields via wizard → Ver en canvas → Editar en inspector

---

# 🖼️ Hito 4: Components Management

**Objetivo**: Agregar componentes (imageOptions/spriteOptions)  
**Entregable**: Component CRUD → Distinción imageOptions vs spriteOptions → Link a fields

## B4.1: Extend ProjectLauncher

- [ ] `addComponent(projectPath, component: IComponent) → Promise<IComponent>`
- [ ] `updateComponent(projectPath, componentId, updates) → Promise<void>`
- [ ] `removeComponent(projectPath, componentId) → Promise<void>`
- [ ] `getComponentValues(projectPath, componentId) → Promise<string[]>`
- **Tests**: Component CRUD in DB

## B4.2: IPC Handlers

- [ ] **src/main/ipc/handlers.ts** - Extend
  - [ ] `component:add` (projectPath, component)
  - [ ] `component:update` (projectPath, componentId, updates)
  - [ ] `component:remove` (projectPath, componentId)
  - [ ] `component:values` (projectPath, componentId)

## F4.1: ComponentDialog

- [ ] **src/renderer/src/components/dialogs/ComponentDialog.tsx**
  - [ ] Step 1: Component metadata
    - [ ] Name input
    - [ ] Type selector: imageOptions OR spriteOptions
    - [ ] Link to field dropdown (from store.fields)
  - [ ] Step 2: Positioning
    - [ ] Position: X, Y, Width, Height
    - [ ] ZIndex input
  - [ ] Step 3: Values definition
    - [ ] **If imageOptions**:
      - [ ] Add value entries (value + label)
      - [ ] List/edit/delete values
    - [ ] **If spriteOptions**:
      - [ ] Add value entries (value + label)
      - [ ] Will add imageCoords during asset import (Iter 5)
  - [ ] On finish: Save component to DB
  - **Tests**: Component creation, type selection, value management

## F4.2: Sidebar Update (Components Tab)

- [ ] **src/renderer/src/components/Sidebar.tsx** - Extend
  - **Components Tab**:
    - [ ] List all components (from store)
    - [ ] Each component shows: name, type, position, values count
    - [ ] [+] "Add Component" button → Opens ComponentDialog
    - [ ] [Edit], [Delete] buttons per component
    - [ ] Selectable (highlight to edit)
  - **Tests**: Component listing

## F4.3: Inspector Update (Component Editor)

- [ ] **src/renderer/src/components/Inspector.tsx** - Extend
  - [ ] When component selected:
    - [ ] Display component.name, component.type
    - [ ] Editable position (X, Y, W, H)
    - [ ] Editable zIndex
    - [ ] Show linked field
    - [ ] List/edit/delete values (conditional rendering by type)
    - [ ] [Save Changes], [Delete Component], [Cancel] buttons
  - **Tests**: Component editing

## F4.4: Canvas Preview (Components)

- [ ] **src/renderer/src/components/canvas/TemplatePreview.tsx** - Extend
  - [ ] Loop through store.components
  - [ ] For each component: render placeholder box (colored)
  - [ ] Position at component.position
  - [ ] Show component.name as label
  - [ ] Clickable → Select in Inspector
  - **Tests**: Component rendering

## F4.5: Store Updates (Components)

- [ ] **src/renderer/src/store/useTemplateStore.ts** - Extend
  - Action: `addComponent(component)` + API call
  - Action: `updateComponent(componentId, updates)` + API call
  - Action: `removeComponent(componentId)` + API call
  - Action: `selectComponent(componentId)`
  - State: `selectedComponentId`

## F4.6: Tests

- [ ] E2E: Add component → Link to field → Edit → Save
- [ ] ComponentDialog: Type selection (imageOptions vs spriteOptions)
- [ ] Store: Component CRUD
- [ ] Canvas: Component positioning

**✅ Hito 4 Completado**: Crear componentes → Link a fields → Ver en canvas como placeholders

---

# 🎨 Hito 5: Asset Import & Canvas Rendering

**Objetivo**: Subir imágenes → Renderizar canvas con assets reales  
**Entregable**: Asset import → Conversión a WebP → Canvas muestra imágenes reales

## B5.1: AssetManager Service

- [ ] **src/main/services/AssetManager.ts**
  - [ ] `importComponentImage(file, componentName, value, projectPath)`
    - [ ] Validate component exists in DB
    - [ ] Validate value exists in component.values
    - [ ] Convert to WebP (Sharp, quality 90, effort 6)
    - [ ] Save to `assets/images/{componentName}/{value}.webp`
    - [ ] Return relative path
  - [ ] `getComponentImages(componentName, projectPath)`
    - [ ] Return { [value]: imagePath, ... }
  - [ ] `listAllComponentImages(projectPath)`
    - [ ] Return { [componentName]: { [value]: imagePath }, ... }
  - [ ] Maintain relative paths (portability critical)
  - **Tests**: WebP conversion, path validation, file I/O

## B5.2: Asset Protocol

- [ ] **src/main/index.ts** - Extend
  - [ ] Register `asset://` protocol
  - [ ] Map `asset://{componentName}/{value}.webp` → `projects/{projectName}/assets/images/{componentName}/{value}.webp`
  - [ ] Serve WebP images to renderer
  - **Tests**: Protocol registration, asset loading

## B5.3: IPC Handlers

- [ ] **src/main/ipc/handlers.ts** - Extend
  - [ ] `assets:import` (file, componentName, value, projectPath)
    - [ ] AssetManager.importComponentImage()
    - [ ] Return asset path
  - [ ] `assets:list` (projectPath)
    - [ ] AssetManager.listAllComponentImages()
    - [ ] Return asset map

## F5.1: AssetImportDialog

- [ ] **src/renderer/src/components/dialogs/AssetImportDialog.tsx**
  - [ ] Component selector dropdown (from store.components)
  - [ ] Value selector (from selected component.values)
  - [ ] Component type display (imageOptions vs spriteOptions)
  - [ ] **If imageOptions**:
    - [ ] Single file upload
    - [ ] Drag-and-drop zone
  - [ ] **If spriteOptions**:
    - [ ] Single sprite sheet file upload
    - [ ] (ImageCoords editor in Iter 5+ enhancement)
  - [ ] File validation (jpg, png, webp only)
  - [ ] Progress indicator (WebP conversion)
  - [ ] Success message: "Asset saved to assets/images/..."
  - [ ] Auto-close on success
  - **Tests**: File upload, component validation, WebP conversion

## F5.2: Sidebar Update (Assets Tab)

- [ ] **src/renderer/src/components/Sidebar.tsx** - Extend
  - **Assets Tab**:
    - [ ] List uploaded assets by component
    - [ ] Each asset shows: componentName/value - imagePath
    - [ ] [+] "Import Asset" button → Opens AssetImportDialog
    - [ ] [Replace], [Delete] buttons per asset
    - [ ] Thumbnail preview (lazy loaded)
  - **Tests**: Asset listing, button handlers

## F5.3: Canvas Rendering (Real Images)

- [ ] **src/renderer/src/components/canvas/TemplatePreview.tsx** - Extend
  - [ ] For each component in store.components:
    - [ ] Check if component has type="imageOptions" or "spriteOptions"
    - [ ] **If imageOptions**: Load image from `asset://{component.name}/{value}.webp`
    - [ ] **If spriteOptions**: Load sprite, crop using imageCoords, render cropped region
    - [ ] Position at component.position with component.zIndex
    - [ ] Render fields on top (or according to zIndex)
    - [ ] Error handling for missing images (show placeholder)
  - [ ] Render in correct order by zIndex
  - [ ] Memoization to prevent re-renders
  - **Tests**: Image loading, positioning, zIndex ordering, error handling

## F5.4: Store Updates (Assets)

- [ ] **src/renderer/src/store/useTemplateStore.ts** - Extend (optional)
  - State: `assets: { [componentName]: { [value]: imagePath } }`
  - Action: `loadAssets(assetMap)`
  - Action: `addAsset(componentName, value, imagePath)`
  - **Tests**: Asset state management

## F5.5: Tests

- [ ] E2E: Import asset → See on canvas with correct position
- [ ] AssetManager: WebP conversion, path validation
- [ ] AssetImportDialog: File upload, validation
- [ ] Canvas: Image loading and positioning, zIndex ordering
- [ ] Asset protocol: Serves images correctly

**✅ Hito 5 Completado**: Subir imágenes → Canvas muestra imágenes reales → Preview completo del template

---

# 📦 Hito 6: Export & Polish

**Objetivo**: Exportar template + tests + docs  
**Entregable**: Export function → Test coverage → Documentación completa

## B6.1: Packager Service

- [ ] **src/main/services/Packager.ts**
  - [ ] `exportTemplate(projectPath) → zipBuffer`
    - [ ] Read database (canvasConfig, template, fields, components)
    - [ ] Collect all assets from assets/images/
    - [ ] Create zip: template.json + assets/
    - [ ] Generate schema.json (field validation rules)
    - [ ] Return zip buffer
  - [ ] `zipProject(projectPath) → zipBuffer`
    - [ ] ZIP entire project (project.ctm + data + assets)
  - **Tests**: Zip creation, file structure preservation

## B6.2: IPC Handlers

- [ ] **src/main/ipc/handlers.ts** - Extend
  - [ ] `project:export` (projectPath) → Return zip buffer
  - [ ] `project:zip` (projectPath) → Return zip buffer

## F6.1: Export Dialog

- [ ] **src/renderer/src/components/dialogs/ExportDialog.tsx**
  - [ ] Option: Export template only (template.json + assets + schema.json)
  - [ ] Option: Export entire project (project.ctm + data + assets)
  - [ ] File name input with default
  - [ ] [Cancel] [Export] buttons
  - [ ] On export: Trigger download via IPC
  - **Tests**: Export dialog UX

## F6.2: File Menu Update

- [ ] Navbar menu:
  - [ ] "File → Export" → Open ExportDialog
  - [ ] Trigger download after export
  - **Tests**: Menu handler

## F6.3: Tests & Coverage

- [ ] Unit tests:
  - [ ] All types (types.ts)
  - [ ] DbFactory + LowdbAdapter
  - [ ] ProjectLauncher (create, load, CRUD)
  - [ ] AssetManager (import, list)
  - [ ] Packager (zip creation)
  - [ ] Zustand store
  - Target: 70%+ coverage
- [ ] Component tests:
  - [ ] App layout, Navbar, Canvas, Sidebar, Inspector
  - [ ] All dialogs (Canvas config, Fields wizard, Component, Asset import, Export)
  - [ ] TemplatePreview (field + component rendering)
  - Target: 80%+ coverage
- [ ] Integration tests:
  - [ ] New project → Add fields → Add components → Import assets → Export
  - [ ] Load project → Edit → Export
  - [ ] Error scenarios (missing files, corrupt DB, etc.)
- [ ] E2E tests:
  - [ ] Full workflow capture (video/screenshot)
  - [ ] Performance benchmarks (canvas with 100+ elements)

## F6.4: Documentation

- [ ] **docs/ARCHITECTURE.md** - Layer overview, design decisions
- [ ] **docs/DATABASE.md** - DbFactory, adapters, schema
- [ ] **docs/API.md** - IPC channels, request/response format
- [ ] **docs/COMPONENTS.md** - Canvas, Sidebar, Inspector, Dialog props
- [ ] **docs/DEVELOPMENT.md** - Setup, running locally, debugging
- [ ] **docs/DEPLOYMENT.md** - Build, packaging, distribution
- [ ] **docs/TYPES.md** - Type definitions reference

## F6.5: Polish

- [ ] [ ] Error dialog system (user-friendly error messages)
- [ ] Toast notifications for success/warning
- [ ] Keyboard shortcut guide modal (Shift+?)
- [ ] Unsaved changes warning on close
- [ ] Auto-save feature (save to DB every 30s)
- [ ] Recent projects list
- [ ] Dark mode theme (optional)
- [ ] Accessibility audit (WCAG 2.1 AA)

## F6.6: Tests

- [ ] Full test suite: 70%+ coverage
- [ ] Component snapshots
- [ ] E2E workflow recording
- [ ] Performance benchmarks

**✅ Hito 6 Completado**: Exportar template → Suite de tests → Documentación completa

---

# 🔧 Hitos Opcionales (Post-MVP)

## Hito 7: MongoDB & Encryption

- [ ] **MongoAdapter** implementation
- [ ] **Encryption** for project.ctm (v1.1+)
- [ ] Password protection dialog
- [ ] Key derivation (Argon2)

## Hito 8: Advanced Asset Management

- [ ] Sprite sheet crop tool (visual editor for imageCoords)
- [ ] Batch import assets (modal wizard)
- [ ] Asset thumbnails in sidebar
- [ ] Asset tagging + search

## Hito 9: Template Features

- [ ] Conditional rendering logic (if field exists)
- [ ] Component animation/effects (hover, transitions)
- [ ] Custom fonts upload
- [ ] Layer management (reorder fields/components by zIndex)

## Hito 10: Export Enhancements

- [ ] Export to PNG (render canvas to image)
- [ ] Export to Figma design (connector plugin)
- [ ] Custom DPI/resolution settings
- [ ] Batch card generation (from CSV)

---

# 📊 Tracking & Metrics

## Hitos de Control

| Hito       | Criterios de Éxito                      |
| ---------- | --------------------------------------- |
| Foundation | Tipos compilados + DbFactory funciona   |
| Hito 1     | App renderiza + menú responde           |
| Hito 2     | Proyecto creado + canvas dimensionado   |
| Hito 3     | Campos creados + visualizados en canvas |
| Hito 4     | Componentes creados + posicionados      |
| Hito 5     | Imágenes subidas + renderizadas         |
| Hito 6     | Template exportado + tests 70%+         |

## Definition of Done (Per Iteración)

- [ ] All tasks completed (backlog empty)
- [ ] Tests passing (including new tests for iteration)
- [ ] Code reviewed + merged to main
- [ ] No console errors/warnings
- [ ] Checkpoint demo functional (recorded or live)
- [ ] Documentation updated

---

# 🎯 Principios de Implementación

1. **Valor visible cada sprint** - Demo después de cada iteración
2. **Tests desde el inicio** - No esperar a final
3. **Relative paths siempre** - Portabilidad crítica
4. **IPC response wrapper** - `{ success, data?, error? }`
5. **Zustand es source of truth** - No prop drilling
6. **Asset protocol early** - Servir WebP desde inicio
7. **Dialog system reusable** - BaseDialog + DialogProvider
8. **Memoización en Canvas** - Evitar re-renders innecesarios
9. **Accessibility first** - WCAG 2.1 en dialogs desde Iter 3
10. **Error handling graceful** - Degradación, no crashes

---

**Actualizado**: 2026-04-02  
**Estado**: ✅ Listo para ejecución  
**Formato**: Funcionalidades por Hito (sin estimaciones de tiempo)
