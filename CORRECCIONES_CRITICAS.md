# Correcciones Críticas - Arquitectura Finalizada

## Lo que fue INCORRECTO

1. ❌ Poner componentes en `project.ctm`
2. ❌ Almacenar definición de template en `project.ctm`
3. ❌ Generar/almacenar cartas en nuestra BD
4. ❌ Hablar de "seleccionar valores de componente"

## Lo que es CORRECTO

### project.ctm (MANIFEST DE INFRAESTRUCTURA - Valida estructura sin tocar BD)

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
    "description": "Expected folder structure for validation",
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

**Propósito del project.ctm:**

- Validar estructura SIN consultar BD (rápido)
- Si falta imagen: buscar enlace externo basado en component/valor name, descargar, optimizar, guardar
- Si no existe recurso externo: avisar que falta la imagen
- NADA de canvas config, NADA de campos en el ctm

### Base de Datos (DEFINICIÓN DEL TEMPLATE)

El usuario define el template mediante:

1. **Configurar CANVAS**: "Quiero que el template tenga 1000x1800px con 96 ppc"
2. **Agregar FIELDS**: "Quiero un campo 'Card Name' en X,Y con fontSize=32"
3. **Agregar COMPONENTS**: "Quiero un componente 'hero_class' que muestre imagen según el valor"
4. **Subir ASSETS**: "Aquí está la imagen para hero_class=tanque"

La BD contiene:

```javascript
// canvas config: configuración del template (ancho, alto, densidad dePixeles)
{
  canvasWidth: 1000,
  canvasHeight: 1800,
  ppc: 96  // pixels per centimeter
}

// template metadata
{
  id: "tpl_001",
  name: "Fantasy Card"
}

// fields: lo que el usuario final podrá rellenar
{
  id: "field_name",
  name: "Card Name",
  type: "text",
  position: { x: 100, y: 100, width: 800, height: 50 },
  style: { fontSize: 32, color: "#fff", bold: true }
}

// components: imágenes que se muestran condicionalmente
// TIPO 1: imageOptions (imágenes separadas)
{
  id: "comp_class",
  name: "hero_class",
  type: "imageOptions",
  position: { x: 50, y: 50, width: 150, height: 150 },
  zIndex: 1,
  valueField: "field_hero_class",
  values: [
    { value: "tanque", label: "Tank", imagePath: "assets/images/hero_class/tanque.webp" },
    { value: "dps", label: "Damage Dealer", imagePath: "assets/images/hero_class/dps.webp" }
  ]
}

// TIPO 2: spriteOptions (sprite sheet con crop coords)
{
  id: "comp_rarity",
  name: "rarity",
  type: "spriteOptions",
  position: { x: 900, y: 100, width: 80, height: 80 },
  zIndex: 2,
  imagePath: "assets/images/rarity/spritesheet.webp",  // UNA SOLA
  valueField: "field_rarity",
  values: [
    { value: "common", label: "Common", imageCoords: { x: 0, y: 0, width: 80, height: 80 } },
    { value: "rare", label: "Rare", imageCoords: { x: 80, y: 0, width: 80, height: 80 } },
    { value: "epic", label: "Epic", imageCoords: { x: 160, y: 0, width: 80, height: 80 } }
  ]
}
```

### Lo que NO hacemos

- ❌ NO generamos cartas
- ❌ NO almacenamos cartas
- ❌ NO generamos imágenes finales
- ❌ NO validamos datos de usuario

## Flujo Correcto

### Fase 1: Usuario diseña template (nuestra app)

```
App abre proyecto
  ↓
Lee project.ctm (infraestructura)
  ↓
Inicializa BD
  ↓
Carga template definition de BD
  ↓
Muestra canvas con preview
  ↓
Usuario edita fields → se guardan en BD
  ↓
Usuario agrega components → se guardan en BD
  ↓
Usuario sube imágenes → se guardan en assets/
```

### Fase 2: Usuario usa template (su app)

```
App del usuario obtiene template.json (lo que exportamos)
  ↓
Usuario proporciona datos: { hero_class: "tanque", name: "Fire Mage" }
  ↓
App del usuario aplica template:
  - Posiciona field "name" en X,Y con style
  - Busca componente hero_class
  - Ve que hero_class="tanque"
  - Carga imagen assets/images/hero_class/tanque.webp
  - La posiciona en canvas
  - Renderiza a PNG/WebP
  ↓
Cartas generadas (FUERA DE NUESTRO ALCANCE)
```

## Cambios en Documentación

| Archivo                           | Cambio                                              |
| --------------------------------- | --------------------------------------------------- |
| `ARCHITECTURE_MANIFESTO.md`       | **Nuevo**: Explicación completa y correcta          |
| `.github/copilot-instructions.md` | ✅ Actualizado: project.ctm es solo infraestructura |
| `BREAKDOWN.md` Phase 0            | ✅ Tipos corregidos: NO ICard, SÍ ITemplate         |
| `BREAKDOWN.md` Phase 1.2.1        | ✅ ProjectLauncher: carga template de BD            |
| `BREAKDOWN.md` Phase 1.2.2        | ✅ AssetManager: valida desde BD                    |
| `BREAKDOWN.md` Phase 2.1.1        | ✅ Renombrado: TemplateStore (no CardStore)         |
| `BREAKDOWN.md` Phase 2.3.1        | ✅ Canvas: TemplatePreview (no CardRenderer)        |
| `BREAKDOWN.md` Phase 2.3.2        | ✅ Renamed y corrected                              |
| `BREAKDOWN.md` Phase 2.3.4        | ✅ Sidebar: fields + components + assets            |
| `BREAKDOWN.md` Phase 2.3.5        | ✅ Inspector: editor de fields/components           |
| `BREAKDOWN.md` Phase 2.3.6        | ✅ Dialogs: sin ProjectSettingsDialog para comps    |

## Resumen: Qué Somos

**Deck Template Builder** = Herramienta de DISEÑO de templates

No somos:

- ❌ Generador de cartas
- ❌ Almacenamiento de cartas
- ❌ Validador de datos de usuario
- ❌ Renderizador de imágenes finales

Sí somos:

- ✅ Diseñador visual de templates
- ✅ Editor de fields + componentes
- ✅ Gestor de assets
- ✅ Exportador de definiciones
- ✅ Infraestructura portable

**Output final**: Un archivo template.json + assets/ que otros apps pueden usar.
