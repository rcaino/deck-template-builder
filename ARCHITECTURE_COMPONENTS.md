# Asset Categories & Component System - Architecture Update

## Important: project.ctm = Configuration Only

⚠️ **`project.ctm` is infrastructure configuration, NOT application data:**

- ✅ Project settings (canvas size, components schema, DB connection)
- ✅ Paths to assets (relative, for portability)
- ✅ Database configuration (type: lowdb/mongodb, connection details)
- ✅ Future: encryption/password protection for sensitive DB credentials

❌ **NOT in project.ctm:**

- Card data (stored in database)
- Field values (stored in database)
- User-created content (all in database)

**Data separation ensures:**

- Config is portable (move projects between machines)
- Data is persistent (database is source of truth)
- Future security (encrypt project.ctm to protect DB credentials)

---

## El Problema Anterior

- Asset categories hardcoded: `['hero_class', 'item_type']`
- ❌ No flexible para diferentes proyectos
- ❌ No permite componentes custom

## La Solución: Component-Based Asset Mapping

### Concepto

El usuario define **componentes custom** con **valores permitidos**:

```
Proyecto: "Fantasy Card Deck"
├─ Componente: "hero_class"
│  └─ Valores: ["tanque", "dps", "healer"]
│     └─ Cada valor → una imagen (assets/images/hero_class/tanque.webp)
│
├─ Componente: "rarity"
│  └─ Valores: ["common", "rare", "legendary"]
│     └─ Cada valor → una imagen
│
└─ Componente: "element"
   └─ Valores: ["fire", "ice", "nature"]
      └─ Cada valor → una imagen
```

### Archivos en Proyecto

```
proyecto/
├── project.ctm
│   {
│     "components": [
│       { "name": "hero_class", "values": ["tanque", "dps", "healer"] },
│       { "name": "rarity", "values": ["common", "rare", "legendary"] }
│     ]
│   }
│
├── assets/images/
│   ├── hero_class/
│   │   ├── tanque.webp
│   │   ├── dps.webp
│   │   └── healer.webp
│   │
│   └── rarity/
│       ├── common.webp
│       ├── rare.webp
│       └── legendary.webp
│
└── data/project_db.json (cards)
   [
     {
       "id": "card_001",
       "name": "Fire Mage",
       "components": {
         "hero_class": "dps",      ← mapeo value → asset
         "rarity": "rare"          ← mapeo value → asset
       }
     }
   ]
```

### Mapeo & Renderización

En el Canvas:

```javascript
// Card tiene: { hero_class: "dps", rarity: "rare" }
// Busco imagen:
const heroImage = asset://hero_class/dps.webp  ← Dynamic path!
const rarityImage = asset://rarity/rare.webp   ← Dynamic path!
```

---

## Cambios en Tipos (Phase 0)

### Antes

```typescript
// ❌ OLD
const ASSET_CATEGORIES = ["hero_class", "item_type"];
```

### Después

```typescript
// ✅ NEW

// Definición de un componente custom
interface IComponent {
  name: string; // "hero_class"
  label?: string; // "Hero Class" (para UI)
  description?: string; // "Classtype of the hero"
  values: string[]; // ["tanque", "dps", "healer"]
  imagePrefix?: string; // "assets/images/hero_class" (computed)
}

// Proyecto ahora incluye componentes, NO categorías fijas
interface ICTMManifest {
  version: string;
  components: IComponent[]; // ← Dynamic!
  canvasConfig: ICanvasConfig;
  db: IDBConfig;
}

// Card ahora mapea componentes → valores
interface ICard {
  id: string;
  name: string;
  description?: string;
  components: Record<string, string>; // { hero_class: "dps", rarity: "rare" }
  fields: IField[];
  createdAt?: number;
  updatedAt?: number;
}

// Para renderización en canvas
interface IComponentValue {
  componentName: string;
  selectedValue: string;
  imagePath: string; // "assets/images/hero_class/dps.webp"
}
```

---

## Flujo: Del Usuario a la UI

### 1. Usuario Define Componentes (Project Settings)

```
Dialog: Project Configuration
├─ Components
│  ├─ [+] Add Component
│  │  └─ Name: "hero_class"
│  │  └─ Values: "tanque, dps, healer" (CSV)
│  │
│  └─ [+] Add Component
│     └─ Name: "rarity"
│     └─ Values: "common, rare, epic, legendary"
```

**Resultado**: `project.ctm` incluye:

```json
{
  "components": [
    { "name": "hero_class", "values": ["tanque", "dps", "healer"] },
    { "name": "rarity", "values": ["common", "rare", "epic", "legendary"] }
  ]
}
```

### 2. Usuario Sube Imágenes (Asset Manager)

```
UI: Asset Import
├─ Select component: [hero_class ▼]
├─ Drag/upload: tanque.png
├─ Auto-convert: tanque.webp → assets/images/hero_class/
├─ Drag/upload: dps.png
├─ Auto-convert: dps.webp → assets/images/hero_class/
```

**AssetManager Workflow**:

1. Recibe archivo + componente + valor
2. Convierte a WebP
3. Guarda en `assets/images/{componente}/{valor}.webp`
4. Almacena ruta relativa: `assets/images/hero_class/dps.webp`

### 3. Renderizar en Canvas

```
Card: { hero_class: "dps", rarity: "rare" }
└─ Canvas busca:
   ├─ asset://hero_class/dps.webp
   └─ asset://rarity/rare.webp
```

---

## Cambios en Servicios (Phase 1)

### ProjectLauncher

- [ ] Leer `components` desde `project.ctm`
- [ ] Validar que cada componente tenga al menos 1 valor
- [ ] Cargar en Zustand store para acceso global

### AssetManager

- [ ] `importComponentImage(file, componentName, value, projectPath)`
  - Validar que componente + valor existan en project.ctm
  - Convertir a WebP
  - Guardar en `assets/images/{componente}/{valor}.webp`
- [ ] `getComponentImages(componentName, projectPath)`
  - Listar todas las imágenes para un componente
  - Retornar: `{ tanque: "assets/images/hero_class/tanque.webp", ... }`

### IPC Handlers

- [ ] `components:list` → retornar componentes del proyecto
- [ ] `components:getImages` → imágenes de un componente
- [ ] `assets:importComponentImage` → subir imagen para componente+valor

---

## Cambios en Frontend (Phase 2)

### Zustand Store

```typescript
interface CardStore {
  // ...existing...
  components: IComponent[]; // ← NEW

  // Actions
  loadComponents(components: IComponent[]);
}
```

### Sidebar (Asset Browser)

**Antes**: Tabs fijos (hero_class, item_type)  
**Después**: Tabs dinámicos basados en `components` del proyecto

```
Sidebar
├─ [hero_class] [rarity] [element] [+]
├─ hero_class:
│  ├─ 🖼️ tanque.webp
│  ├─ 🖼️ dps.webp
│  └─ 🖼️ healer.webp
```

- [ ] Leer componentes del store
- [ ] Mostrar tab por componente
- [ ] Click en imagen → `updateCard(cardId, { components: { hero_class: "dps" } })`

### Canvas (Renderización)

```typescript
// Card: { components: { hero_class: "dps", rarity: "rare" } }

function CardRenderer({ card }: CardRendererProps) {
  return (
    <div>
      {/* Renderizar cada componente dinámicamente */}
      {Object.entries(card.components).map(([name, value]) => (
        <ComponentImage
          key={name}
          componentName={name}
          value={value}
          imagePath={`asset://${name}/${value}.webp`}
        />
      ))}
      {/* ...fields... */}
    </div>
  );
}
```

### Component Manager Dialog (v1.1)

```
Dialog: Component Editor
├─ [+] Add Component
├─ hero_class
│  ├─ Values: tanque, dps, healer
│  ├─ [Edit] [Delete]
├─ rarity
│  ├─ Values: common, rare, epic
│  ├─ [Edit] [Delete]
```

---

## Validación & Error Handling

### Validaciones en ProjectLauncher

- [ ] Cada componente debe tener min. 1 valor
- [ ] Valores no pueden estar vacíos
- [ ] Nombres de componentes únicos
- [ ] Nombres válidos (alphanumeric + underscore)

### Validaciones en AssetManager

- [ ] Componente existe en project.ctm
- [ ] Valor existe en componente.values
- [ ] Archivo es imagen válida
- [ ] WebP conversion no falla

### Error Scenarios

```typescript
// En AssetManager.importComponentImage():
if (!project.components.find((c) => c.name === componentName)) {
  throw new Error(`Component "${componentName}" not found in project`);
}

if (!component.values.includes(value)) {
  throw new Error(`Value "${value}" not valid for component "${componentName}"`);
}
```

---

## Compatibilidad & Migración

### Proyecto sin Componentes

Si `project.ctm` no tiene `components`, aplicar defaults:

```typescript
// En ProjectLauncher
if (!manifest.components || manifest.components.length === 0) {
  manifest.components = [
    { name: "hero_class", values: ["tanque", "dps", "healer"] },
    { name: "rarity", values: ["common", "rare", "epic"] }
  ];
}
```

### Backward Compatibility

- Proyectos viejos (sin componentes) funcionan con defaults
- Usuarios pueden editar componentes luego

---

## Resumen de Cambios

| Área             | Antes                             | Después                            |
| ---------------- | --------------------------------- | ---------------------------------- |
| Asset Categories | Globales fijas                    | Dinámicas por proyecto             |
| Proyecto config  | Mínimo                            | Incluye componentes                |
| Card data        | Solo fields                       | + components mapping               |
| Sidebar UI       | Tabs fijos                        | Tabs dinámicos                     |
| Asset path       | `asset://hero_class/warrior.webp` | `asset://{component}/{value}.webp` |
| Validación       | Mínima                            | Estricta (componente + valor)      |

---

**Impact**: Mayor flexibilidad, pero requiere actualizar:

1. Common types (IComponent, ICard)
2. ProjectLauncher (cargar/validar componentes)
3. AssetManager (importar por componente+valor)
4. Sidebar (dinámicos tabs)
5. Canvas (renderización dinámica)
