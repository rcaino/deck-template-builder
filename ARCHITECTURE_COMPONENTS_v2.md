# Dynamic Components & Project Configuration

## Core Distinction: Configuration vs Data

### project.ctm = INFRASTRUCTURE CONFIGURATION

What it contains:

- ✅ Component schema (allowed components and their values)
- ✅ Canvas dimensions (default and ranges)
- ✅ Database configuration (connection type and credentials)
- ✅ Asset paths (relative, for portability)
- ✅ **Future**: encryption/password protection

What it does NOT contain:

- ❌ Card data
- ❌ Field values
- ❌ User-created content
- ❌ Any runtime application state

### data/project_db.json (or MongoDB) = APPLICATION DATA

What it contains:

- ✅ All cards (id, name, description)
- ✅ All fields (text, styling)
- ✅ Component value selections for each card
- ✅ User-created content
- ✅ Timestamps (createdAt, updatedAt)

Why this separation matters:

- **Portability**: project.ctm uses relative paths → projects move between machines
- **Security**: Database credentials in project.ctm can be encrypted (v1.1+)
- **Scalability**: Data can be local (Lowdb) or remote (MongoDB)
- **Versionability**: Configuration can be tracked in VCS, data cannot

---

## File Structure example (asset folders and file should vary for each project)

```
MyDeck/
├── project.ctm  ─────────────────────────────────┐
│   { version, components[], canvasConfig, db }   │ CONFIGURATION
│                                                 │ (readable, portable)
├── assets/
│   └── images/
│       ├── hero_class/
│       │   ├── tanque.webp
│       │   ├── dps.webp
│       │   └── healer.webp
│       └── rarity/
│           ├── common.webp
│           ├── rare.webp
│           └── epic.webp
│
└── data/  ─────────────────────────────────────┐
    └── project_db.json                         │ APPLICATION DATA
        [{ id, name, components, fields }, ...] │ (local, persistent)
```

---

## project.ctm Structure

### Complete Example

```json
{
  "version": "1.0",

  "components": [
    {
      "name": "hero_class",
      "label": "Hero Class",
      "description": "Character role/class type",
      "values": ["tanque", "dps", "healer"]
    },
    {
      "name": "rarity",
      "label": "Rarity",
      "description": "Card rarity level",
      "values": ["common", "rare", "epic", "legendary"]
    }
  ],

  "canvasConfig": {
    "width": 1000, //pixels
    "height": 1800, //pixels
    "ppc": 200 //pixels per centimeter
  },

  "db": {
    "type": "lowdb",
    "path": "data/project_db.json"
  }
}
```

**Alternative DB config (MongoDB):**

```json
{
  "db": {
    "type": "mongodb",
    "connectionString": "mongodb://user:pass@host:port/database"
  }
}
```

### Future (v1.1+): Encrypted Configuration

```json
{
  "version": "1.1",
  "encrypted": true,
  "encryptionMethod": "AES-256-GCM",

  "components": [...],
  "canvasConfig": {...},

  "db_encrypted": "U2FsdGVkX1...",
  "dbDecrypted": null
}
```

When user enters password:

1. Decrypt `db_encrypted` section
2. Load DB credentials
3. Initialize DbFactory
4. Keep password in memory (not stored)

---

## Data Structure: ICard

### Complete Example

```typescript
interface ICard {
  id: string; // "card_001"
  name: string; // "Fire Mage"
  description?: string; // "A powerful wizard"

  components: Record<string, string>; // User-selected component values
  // { "hero_class": "dps", "rarity": "epic" }
  // These map to assets via asset://{component}/{value}.webp

  fields: IField[]; // Text fields (name, description, etc.)

  createdAt?: number; // Timestamp
  updatedAt?: number; // Timestamp
}

interface IField {
  id: string; // "card_name"
  value: string; // "Fire Mage"
  fontSize: number; // 24
  color: string; // "#ffffff"
  bold: boolean; // true
  align: "left" | "center" | "right"; // "center"
}
```

---

## Types Definition

### IComponent (in project.ctm)

```typescript
interface IComponent {
  name: string; // "hero_class" (alphanumeric + _)
  label?: string; // "Hero Class" (for UI display)
  description?: string; // Documentation
  values: string[]; // ["tanque", "dps", "healer"]
}
```

### ICTMManifest (entire project.ctm)

```typescript
interface ICTMManifest {
  version: string; // "1.0"
  components: IComponent[]; // From project config
  canvasConfig: ICanvasConfig;
  db: IDBConfig;
  // Future fields:
  // encrypted?: boolean;
  // encryptionMethod?: string;
  // db_encrypted?: string;
  // passwordHash?: string;  (if encrypted)
}
```

### IDBConfig

```typescript
interface IDBConfig {
  type: "lowdb" | "mongodb";

  // For Lowdb:
  path?: string; // "data/project_db.json" (relative)

  // For MongoDB:
  connectionString?: string; // "mongodb://..."
}
```

### ICanvasConfig

```typescript
interface ICanvasConfig {
  width: number; // 1000
  height: number; // 1800
  ppc: number; //200
}
```

---

## Initialization Flow

### ProjectLauncher Responsibilities

```
1. Load project.ctm
   └─ Parse JSON
   └─ Validate ICTMManifest schema

2. Handle encryption (future)
   └─ If encrypted=true, prompt for password
   └─ Decrypt db section

3. Initialize database
   └─ Create DbFactory with db config
   └─ Test connection (log errors, don't crash)

4. Load data
   └─ Query database for all cards
   └─ Load components from config

5. Populate Zustand store
   └─ store.loadComponents(manifest.components)
   └─ store.loadCards(cardsFromDb)
   └─ store.setCanvasConfig(manifest.canvasConfig)

6. Return initialized state to renderer
```

---

## User Actions → Data Updates

### Action 1: Define Components (ProjectSettingsDialog)

```
User: "I want hero_class with values tanque, dps, healer"
└─ ProjectSettingsDialog.onSave()
   └─ API.invoke("project:updateComponents", newComponents)
      └─ ProjectLauncher validates + updates project.ctm
      └─ Publish event: components changed
      └─ Renderer reloads components in Zustand
```

**Result**: db.json updated

```json
{
  "components": [{ "name": "hero_class", "values": ["tanque", "dps", "healer"] }]
}
```

### Action 2: Upload Assets (AssetImportDialog)

```
User: Selects hero_class + tanque + tanque.png
└─ AssetImportDialog.onUpload()
   └─ AssetManager.importComponentImage(
       file: File,
       componentName: "hero_class",
       value: "tanque",
       projectPath: "/path/to/project"
     )
      └─ Validate: component exists in project.ctm
      └─ Validate: value exists in component.values
      └─ Convert to WebP (Sharp)
      └─ Save to assets/images/hero_class/tanque.webp (relative path)
      └─ Return success
```

**Result**: Asset file created on disk

```
assets/images/hero_class/tanque.webp
```

### Action 3: Create Card (CardEditor)

```
User: Clicks "New Card"
└─ CardStore.addCard({ name: "Fire Mage" })
   └─ API.invoke("cards:insert", newCard)
      └─ Database.insert("cards", newCard)
      └─ Store updated: cards list refreshes
```

**Result**: data/project_db.json updated

```json
[
  {
    "id": "card_001",
    "name": "Fire Mage",
    "components": {},
    "fields": []
  }
]
```

### Action 4: Select Component Value (Sidebar)

```
User: Clicks "dps" image in hero_class tab
└─ Sidebar triggers updateCard({
     components: { hero_class: "dps" }
   })
   └─ CardStore.updateCard("card_001", updates)
   └─ API.invoke("cards:update", cardId, updates)
      └─ Database.update("cards", cardId, updates)
      └─ Store updated: selectedCard reflects new component value

Result in database:
{
  "id": "card_001",
  "components": {
    "hero_class": "dps"  ← Now maps to asset://hero_class/dps.webp
  }
}
```

### Action 5: Render Canvas

```
CardRenderer receives card:
{
  "id": "card_001",
  "components": { "hero_class": "dps", "rarity": "epic" }
}

For each component:
  ├─ Get asset path: `assets/images/hero_class/dps.webp`
  ├─ Load via asset:// protocol (backend serves WebP)
  └─ Render on canvas

For each field:
  ├─ Apply styling (fontSize, color, bold, align)
  └─ Render text on canvas
```

---

## Security: Current vs Future

### v1.0 (Current)

```json
{
  "db": {
    "type": "mongodb",
    "connectionString": "mongodb://user:password@prod.mongodb.com/deck-db"
  }
}
```

⚠️ Problem: Connection string visible in project.ctm

- Anyone with file access can see credentials
- Not safe for shared/team projects

### v1.1+ (Future)

```json
{
  "version": "1.1",
  "encrypted": true,
  "encryptionMethod": "AES-256-GCM",

  "components": [...],        // Unencrypted (portable schema)
  "canvasConfig": {...},      // Unencrypted (portable dimensions)

  "db_encrypted": "U2FsdGVkX1c2Vm5hVUVzSmhadjBPQkVsekhXeG5SVJQ=",
  "passwordHash": "argon2id$v=19$m=65540,t=3,p=4$abc123def456",

  "salt": "abc123def456",
  "iv": "fedcba9876543210"
}
```

Implementation:

1. User sets password on project creation or via settings
2. Password → Argon2 hash (verify only)
3. Password → KDF derivation → AES key
4. AES-256-GCM encrypts db section only
5. On project load: prompt password → decrypt → initialize DB
6. Password never stored, only used in memory during session

Benefits:

- Portable schema (components, canvasConfig) always visible
- Sensitive credentials (DB connection) encrypted
- Team-safe: share project folder, but only authorized users can access DB

---

## Implementation Checklist

### Phase 0: Types

- [ ] `IComponent` interface
- [ ] `ICard` with `components` field
- [ ] `ICTMManifest` (config only, no data)
- [ ] `IDBConfig` (type + path OR connectionString)
- [ ] `ICanvasConfig` (dimensions)
- [ ] `IField` with styling fields

### Phase 1: ProjectLauncher

- [ ] Read + parse project.ctm
- [ ] Validate ICTMManifest schema
- [ ] Initialize DbFactory with db config
- [ ] Load cards from database
- [ ] Load components from config
- [ ] Future: decrypt if encrypted
- [ ] Return { manifest, cards, components }

### Phase 2: Frontend Store

- [ ] `useCardStore.components` (from config)
- [ ] `useCardStore.loadComponents()`
- [ ] `useCardStore.updateCard()` (with components field)
- [ ] Keep store in sync with database

### Phase 3: Dialogs

- [ ] ProjectSettingsDialog: manage components, canvas, DB
- [ ] AssetImportDialog: component + value selectors
- [ ] Future: EncryptionDialog (password protection)

### Phase 4: Asset Management

- [ ] AssetManager: validate component + value before save
- [ ] Backend asset:// protocol: serve from ./assets/images/

### Phase 5: Security (v1.1)

- [ ] Encryption library (tweetnacl or libsodium)
- [ ] Password derivation (Argon2 or PBKDF2)
- [ ] Encrypt/decrypt db section
- [ ] Password prompt on project load
- [ ] Update ProjectSettingsDialog for password management

---

## Key Principles

1. **Separate concerns**: Configuration ≠ Data
2. **Portable paths**: Relative paths only (no C:\\Users\\...)
3. **Pluggable DB**: DbFactory makes Lowdb/MongoDB interchangeable
4. **User-configurable**: Components defined per project, not globally
5. **Future-secure**: Infrastructure for password protection ready
6. **Graceful degradation**: Missing assets don't crash renderer
