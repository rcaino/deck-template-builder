# Deck Template Builder - Architecture Manifesto

## What We Build: Templates, Not Cards

**Deck Template Builder** is a tool to **design and configure card templates**.

A template defines:

- ✅ What fields a card can have (name, description, hp, attack, etc.)
- ✅ How fields map to visual positions on canvas
- ✅ What styles apply (colors, fonts, alignment)
- ✅ What images/components are shown conditionally (if field exists, if field = value)
- ✅ Validation rules for fields

What we DON'T do:

- ❌ Store card data (user's responsibility)
- ❌ Generate final card images (user's responsibility)
- ❌ Manage multiple card collections

**Output**: A template definition that users can download and use to generate their own cards.

---

## project.ctm: Infrastructure Manifest

**project.ctm** is a **STATIC, FIXED file** that validates project structure WITHOUT accessing the database.

It contains:

- Version
- Asset structure paths (where images must be stored)
- Database configuration (local or remote)
- **File structure manifest**: Expected folder layout for validation

```json
{
  "version": "1.0",

  "structure": {
    "assetPath": "assets/images",
    "dataPath": "data/project_db.json",
    "tempPath": "temp"
  },

  "db": {
    "type": "lowdb",
    "path": "data/project_db.json"
  },

  "fileStructure": {
    "components": [
      {
        "name": "hero_class",
        "path": "assets/images/hero_class",
        "expectedFiles": ["tanque.webp", "dps.webp", "healer.webp"]
      },
      {
        "name": "rarity",
        "path": "assets/images/rarity",
        "expectedFiles": ["common.webp", "rare.webp", "epic.webp"]
      }
    ]
  }
}
```

**Purpose**: Fast validation of project structure at startup. If image is missing:

1. Search external link based on component/value name
2. If found: Download, optimize to WebP, save locally
3. If not found: Alert user that image is missing

No templates, no canvas config, no fields, no user-defined content.

---

## Project Folder Structure

```
MyCardTemplate/
├── project.ctm                 # Fixed infrastructure config (static)
│
├── assets/
│   └── images/                 # Template assets
│       ├── hero_class/         # Organized by component type
│       │   ├── tanque.webp     # Component value images
│       │   ├── dps.webp
│       │   └── healer.webp
│       └── rarity/
│           ├── common.webp
│           ├── rare.webp
│           └── epic.webp
│
└── data/                       # Database folder
    └── project_db.json         # CONTAINS ALL TEMPLATE DEFINITION
                                # (Lowdb file, or connection to MongoDB)
```

---

## Database Structure: Template Definition

The database contains the ENTIRE template definition. All user-created configuration goes here.

### Collections/Schemas

#### 1. `canvasConfig` (canvas dimensions and density configuration)

```json
{
  "canvasWidth": 1000,
  "canvasHeight": 1800,
  "ppc": 96
}
```

#### 2. `template` (metadata about the template)

```json
{
  "id": "template_001",
  "name": "Fantasy Card Template",
  "description": "A fantasy trading card template",
  "version": "1.0",
  "createdAt": 1712145600000,
  "updatedAt": 1712145600000
}
```

#### 3. `components` (image components with conditional logic)

**Example: imageOptions type (separate images per value)**

```json
{
  "id": "comp_hero_class",
  "name": "hero_class",
  "type": "imageOptions",
  "description": "Character class image",

  "position": { "x": 50, "y": 50, "width": 150, "height": 150 },
  "zIndex": 1,

  "values": [
    {
      "value": "tanque",
      "label": "Tank",
      "imagePath": "assets/images/hero_class/tanque.webp"
    },
    {
      "value": "dps",
      "label": "Damage Dealer",
      "imagePath": "assets/images/hero_class/dps.webp"
    }
  ],

  "showCondition": "field_hero_class",
  "valueField": "hero_class"
}
```

**Example: spriteOptions type (sprite sheet with coords)**

```json
{
  "id": "comp_rarity",
  "name": "rarity_icon",
  "type": "spriteOptions",
  "description": "Rarity indicator from sprite sheet",

  "position": { "x": 900, "y": 100, "width": 80, "height": 80 },
  "zIndex": 2,
  "imagePath": "assets/images/rarity/spritesheet.webp",

  "values": [
    {
      "value": "common",
      "label": "Common",
      "imageCoords": { "x": 0, "y": 0, "width": 80, "height": 80 }
    },
    {
      "value": "rare",
      "label": "Rare",
      "imageCoords": { "x": 80, "y": 0, "width": 80, "height": 80 }
    },
    {
      "value": "epic",
      "label": "Epic",
      "imageCoords": { "x": 160, "y": 0, "width": 80, "height": 80 }
    }
  ],

  "valueField": "field_rarity"
}
```

**Example: Conditional display (imageOptions with conditions)**

```json
{
  "id": "comp_rarity_border",
  "name": "rarity_border",
  "type": "imageOptions",
  "description": "Border only for epic cards",

  "position": { "x": 0, "y": 0, "width": 1000, "height": 1800 },
  "zIndex": 0,

  "values": [
    {
      "value": "epic",
      "imagePath": "assets/images/borders/epic_glow.webp"
    }
  ],

  "conditions": {
    "fieldExists": "field_rarity",
    "fieldValue": {
      "equals": "epic"
    }
  }
}
```

#### 4. `fields` (template fields that cards will have)

```json
{
  "id": "field_name",
  "name": "Card Name",
  "type": "text",
  "required": true,
  "defaultValue": "Unnamed Card",

  "position": {
    "x": 100,
    "y": 100,
    "width": 800,
    "height": 50
  },

  "style": {
    "fontSize": 32,
    "fontFamily": "Arial",
    "color": "#ffffff",
    "bold": true,
    "align": "center"
  },

  "validation": {
    "minLength": 1,
    "maxLength": 50
  }
}
```

#### 5. `fieldComponents` (relation: field → component)

```json
{
  "fieldId": "field_hero_class",
  "componentId": "comp_hero_class",
  "required": true
}
```

#### 6. `layouts` (positioning and grouping, optional)

```json
{
  "id": "layout_1",
  "name": "Main Layout",
  "elements": [
    { "fieldId": "field_name", "layer": 5 },
    { "fieldId": "field_description", "layer": 4 },
    { "componentId": "comp_hero_class", "layer": 2 },
    { "componentId": "comp_rarity_border", "layer": 1 }
  ]
}
```

---

## Data Types: Template Configuration

### IComponent

Component defines a conditional image/visual element with two variants:

- **imageOptions**: Each value is a separate image (no imageCoords needed)
- **spriteOptions**: All values come from sprite sheet (imageCoords required for each value)

```typescript
interface IImageCoords {
  x: number; // Crop X coordinate in sprite sheet
  y: number; // Crop Y coordinate
  width: number; // Crop region width
  height: number; // Crop region height
}

interface IComponentValueImage {
  value: string; // "tanque"
  label?: string; // "Tank"
  imagePath: string; // "assets/images/hero_class/tanque.webp"
  // No imageCoords - each value has its own image file
}

interface IComponentValueSprite {
  value: string; // "common"
  label?: string; // "Common"
  imageCoords: IImageCoords; // REQUIRED - crop coordinates within sprite
  // NO imagePath - inherited from component
}

interface IComponentImageOptions {
  id: string;
  name: string; // "hero_class"
  type: "imageOptions";
  description?: string;

  position: IPosition; // Where to display on canvas (SAME FOR ALL VALUES)
  zIndex: number;

  values: IComponentValueImage[]; // Each has different imagePath

  valueField?: string;
  showCondition?: string;
  conditions?: {
    fieldExists?: string;
    fieldValue?: {
      equals?: string;
    };
  };
}

interface IComponentSpriteOptions {
  id: string;
  name: string; // "rarity"
  type: "spriteOptions";
  description?: string;

  position: IPosition; // Where to display on canvas (SAME FOR ALL VALUES)
  zIndex: number;
  imagePath: string; // ONCE - all values use this sprite sheet

  values: IComponentValueSprite[]; // All share same imagePath, different imageCoords

  valueField?: string;
  showCondition?: string;
  conditions?: {
    fieldExists?: string;
    fieldValue?: {
      equals?: string;
    };
  };
}

type IComponent = IComponentImageOptions | IComponentSpriteOptions;
```

### IField

Field defines an editable value (text, image, etc.) that cards will have.

```typescript
interface IField {
  id: string;
  name: string; // "Card Name"
  type: "text" | "number" | "select" | "image";
  required: boolean;
  defaultValue?: string;

  position: IPosition;
  style: IFieldStyle;

  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    enum?: string[];
  };
}

interface IFieldStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
  align: "left" | "center" | "right";
}

interface IPosition {
  x: number; // Canvas X
  y: number; // Canvas Y
  width: number;
  height: number;
}
```

### ITemplate (metadata)

```typescript
interface ITemplate {
  id: string;
  name: string;
  description?: string;
  version: string;

  canvasWidth: number;
  canvasHeight: number;

  fields: IField[]; // All fields in template
  components: IComponent[]; // All visual components

  createdAt: number;
  updatedAt: number;
}
```

---

## User Workflow: Building a Template

### 1. Create Project

```
App → File → New Project
└─ Dialog: Canvas Configuration
   ├─ Canvas Width: 1000 px
   ├─ Canvas Height: 1800 px
   ├─ PPC: 96 pixels/cm
   └─ Create Project
      └─ Creates folder: "MyCardTemplate"
         ├─ project.ctm (FIXED)
         ├─ assets/images/ (empty)
         └─ data/project_db.json
            └─ { canvasConfig, template, fields: [], components: [] }
```

### 2. Fields Definition Wizard

**Initial wizard** - User defines all template fields (CRUD):

```
Fields Wizard (Step-by-step)
├─ Field 1: Card Name
│  ├─ Name: "Card Name"
│  ├─ Type: "text"
│  ├─ Position: X=100, Y=100, W=800, H=50
│  ├─ Style: Size=32, Color=#fff, Bold
│  ├─ Validation: Max 50 chars
│  └─ Save Field
│
├─ Field 2: Health Points
│  ├─ Name: "HP"
│  ├─ Type: "number"
│  ├─ Position: X=100, Y=200, W=100, H=40
│  ├─ Style: Size=24, Color=#0f0
│  └─ Save Field
│
├─ Field 3: Class (Option)
│  ├─ Name: "Hero Class"
│  ├─ Type: "option"
│  ├─ Options:
│  │  ├─ [ value: "tanque", label: "Tank" ]
│  │  ├─ [ value: "dps", label: "Damage Dealer" ]
│  │  └─ [ value: "healer", label: "Healer" ]
│  ├─ Position: X=50, Y=50, W=150, H=150
│  ├─ Style: (N/A for option fields)
│  └─ Save Field
│
└─ Continue / Done
   └─ All fields saved to DB
```

**Field Types:**

- **text**: String input (validation: min/max length, pattern)
- **number**: Numeric input (validation: min, max)
- **option**: Dropdown/selector (values: [{value, label}])
- **image**: User will provide during component setup

**Note**: Image fields are NOT configured here. Image sources (imageOptions or spriteOptions) are added when creating components.

### 3. Define Components (Assets + Config)

**After fields exist**, user can add components that link to fields:

```
+ Add Component
├─ Choose Component Type:
│  ├─ imageOptions: Multiple separate images
│  └─ spriteOptions: Single sprite sheet
│
├─ Component Config (imageOptions example):
│  ├─ Name: "hero_class"
│  ├─ Link to Field: "field_hero_class" (dropdown of fields)
│  ├─ Position: X=50, Y=50, W=150, H=150
│  ├─ ZIndex: 1
│  │
│  └─ Upload Images:
│     ├─ tanque.png → assets/images/hero_class/tanque.webp
│     ├─ dps.png   → assets/images/hero_class/dps.webp
│     └─ healer.png → assets/images/hero_class/healer.webp
│
└─ Save Component
   └─ DB Update: IComponentImageOptions added to components[]
```

### 4. Preview & Test

Canvas shows template with all fields and components positioned.

### 5. Export Template

User exports template as:

```
export.zip
├── template.json      # { fields, components, layout }
├── assets/
│   └── images/        # All component images
└── schema.json        # Validation schema for user cards
```

User can now use this in their own app to generate cards.

---

## What Happens OUTSIDE Our App

User takes the exported template and uses it to:

```
User's App
├─ Loads template.json
├─ User provides card data: { hero_class: "dps", name: "Fire Mage", ... }
├─ Applies template:
│  ├─ Position "Fire Mage" at field.name position with field.name style
│  ├─ Check: field_hero_class exists? Yes
│  ├─ Show component.hero_class with value="dps"
│  ├─ Position image at component position
│  ├─ Render to PNG/WebP
│
└─ Card image generated (NOT our responsibility)
```

---

## Database vs project.ctm

| Aspect      | project.ctm (MANIFEST)                   | Database (USER DATA)                 |
| ----------- | ---------------------------------------- | ------------------------------------ |
| Purpose     | File structure validation (no DB access) | Template configuration               |
| Editable    | No (static)                              | Yes (user edits in UI)               |
| Contains    | Paths, DB config, fileStructure          | Canvas, fields, components           |
| Example     | structure.assetPath, fileStructure[]     | canvasConfig, fields[], components[] |
| Portability | Yes (relative paths)                     | N/A (not shared)                     |
| Encryption  | Future (v1.1+) for DB credentials        | Optional (user choice)               |
| Validation  | Fast startup check (missing images)      | Full template source of truth        |

---

## Implementation: Database Queries

### ProjectLauncher

```typescript
// 1. Read project.ctm (static - infrastructure ONLY)
const config = loadProjectCtm(projectPath);
// => { structure: {assetPath, dataPath, tempPath}, db }

// 2. Initialize DB
const db = DbFactory.create(config.db);

// 3. Load template definition FROM DATABASE
const canvasConfig = await db.query("canvasConfig"); // width, height, ppc
const template = await db.query("template");
const fields = await db.query("fields");
const components = await db.query("components");

// 4. Return to renderer
return { canvasConfig, template, fields, components, config };
```

### Creating Field

```typescript
// User creates field in UI
const newField: IField = {
  id: generateId(),
  name: "Card Name",
  type: "text",
  position: {...},
  style: {...}
};

// Save to DB
await db.insert("fields", newField);

// Zustand updates
useTemplateStore.addField(newField);
```

### Creating Component - imageOptions

```typescript
// User uploads separate images for each variant
const newComponent: IComponentImageOptions = {
  id: generateId(),
  name: "hero_class",
  type: "imageOptions",

  position: { x: 50, y: 50, width: 150, height: 150 },
  zIndex: 1,

  values: [
    {
      value: "tanque",
      label: "Tank",
      imagePath: "assets/images/hero_class/tanque.webp"
    },
    {
      value: "dps",
      label: "Damage Dealer",
      imagePath: "assets/images/hero_class/dps.webp"
    }
  ],

  valueField: "field_hero_class"
};

// Save to DB
await db.insert("components", newComponent);
useTemplateStore.addComponent(newComponent);
```

### Creating Component - spriteOptions

```typescript
// User uploads sprite sheet with all values
const newComponent: IComponentSpriteOptions = {
  id: generateId(),
  name: "rarity",
  type: "spriteOptions",

  position: { x: 900, y: 100, width: 80, height: 80 },
  zIndex: 2,
  imagePath: "assets/images/rarity/spritesheet.webp",  // ONCE

  values: [
    {
      value: "common",
      label: "Common",
      imageCoords: { x: 0, y: 0, width: 80, height: 80 }
    },
    {
      value: "rare",
      label: "Rare",
      imageCoords: { x: 80, y: 0, width: 80, height: 80 }
    },
    {
      value: "epic",
      label: "Epic",
      imageCoords: { x: 160, y: 0, width: 80, height: 80 }
    }
  ],

  valueField: "field_rarity"
};

// Save to DB
await db.insert("components", newComponent);
useTemplateStore.addComponent(newComponent);

---

## Key Principles

1. **project.ctm is static**: Only infrastructure, never user data
2. **Template lives in DB**: All fields, components, layout in database
3. **Assets are relative paths**: Portable across machines
4. **Export-focused**: Goal is to export a usable template for other apps
5. **No card storage**: Cards are user's responsibility, outside our scope
6. **Validation is schema**: We export validation rules, not validate cards
7. **Future security**: Encrypt project.ctm DB credentials (v1.1+)
```
