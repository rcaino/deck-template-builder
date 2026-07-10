# Deck Template Builder

**Deck template Builder** is a desktop development environment designed for the creation of high-fidelity board games and trading card games (TCG). Unlike conventional graphic design tools, this system acts as a **dynamic data interpreter**, enabling the mass generation of printed assets through an automated optimization pipeline and an intelligent templating engine.

---

## 🎯 Intent and Purpose

This project was born to bridge the gap between **visual design** and **game data balancing**. In game development, values, icons, and attributes change constantly during playtesting.

**Deck Template Builder** allows these changes to be instantly reflected across hundreds of final files without manual intervention.

---

## 🚀 Technological Pillars

### 1. High-Density Canvas

- **DOM-Based Architecture:** Utilizes HTML5 and CSS3 layers for rendering, allowing for more agile, data-bindable object manipulation than traditional bitmaps.
- **GPU-Accelerated Visualization:** Implements a zoom system via `transform: scale()` that offloads processing to the graphics card, maintaining main-thread fluidity regardless of asset load.
- **Immutable Export:** Output resolution is independent of the user's zoom level, ensuring the final render is always the defined size.

### 2. Smart Data Mapping

- **Logical Components:** Elements such as `OptionSprite` or `OptionImage` are not static; they react to CSV or JSON data through an internal project "Lookup Table."
- **Dynamic Theming:** Ability to alter CSS styles (colors, borders, fonts) in real-time based on data file variables (e.g., changing the frame color based on a character's faction).
- **Auto-Fit Text:** Text fields monitor overflow and dynamically adjust font size to fit the predefined design area.

### 3. Asset Pipeline and Source Intelligence

- **Real-Time Optimization:** Integrated with **Sharp** to automatically convert any asset to **WebP**, drastically reducing RAM consumption.
- **Source Synchronization (Auto-Sync):** The system maintains a link to the original file (`source`). Upon detecting a change in the original file (e.g., a save in Photoshop), the application transparently regenerates the optimized version.
- **Alias Management:** Centralized asset registry with fuzzy search for quick assignment via descriptive names (Aliases).

---

## 🛠 Technical Stack

- **Framework:** Electron (Main/Renderer process architecture).
- **UI:** React + TypeScript (Strict Mode).
- **Build Tool:** Vite + `electron-vite`.
- **Native Processing:** Sharp (Node.js).
- **Persistence:** `lowdb` (JSON-based atomic storage) for `.ctm` project files.
- **Interactivity:** `interactjs` for the Drag, Resize, and Snapping engine.

---

## 📂 Ecosystem Structure

- `/src/main`: System logic, file management, and image processing pipeline.
- `/src/renderer`: User interface, Canvas engine, and React state management.
- `/src/preload`: Secure communication bridge (IPC) via `contextBridge`.
- `/src/common`: Single definition of interfaces and global coordinate constants.

---

## 📝 Output Specifications

- **Project Format:** `.ctm` (Card Template Model).
- **Working Resolution:** setup at each project, default is $1000 \times 1800$ px.
- **Print Density:** $200$ px/cm.
- **Image Pipeline:** Try to reduce filesize without loose quality

---

**Card Engine Pro** — _Technical precision for next-generation game design._

# Deck Template Builder

**Deck Template Builder** es un entorno de desarrollo de escritorio diseñado para la creación de juegos de mesa y cartas coleccionables (TCG) de **alta fidelidad**. A diferencia de las herramientas de diseño convencionales, este sistema funciona como un **intérprete dinámico de datos**, permitiendo la generación masiva de archivos para impresión mediante un pipeline de optimización automatizado.

---

## 🎯 Propósito y Visión

Este proyecto nace para cerrar la brecha entre el **diseño visual** y el **balanceo de datos** del juego. En el desarrollo de juegos, los valores, iconos y atributos cambian constantemente durante el playtesting. **Deck Template Builder** permite que estos cambios se reflejen instantáneamente en cientos de archivos finales sin necesidad de intervención manual.

---

## 🚀 Pilares Tecnológicos

### 1. Canvas de Alta Densidad
- **Arquitectura basada en DOM:** Utiliza capas HTML5 y CSS3 para el renderizado, permitiendo una manipulación de objetos ágil y vinculable a datos.
- **Visualización acelerada por GPU:** Implementa un sistema de zoom (vía `transform: scale()`) que delega el procesamiento a la tarjeta gráfica, manteniendo la fluidez de la interfaz.
- **Exportación Inmutable:** La resolución de salida es independiente del nivel de zoom, asegurando que el render final siempre mantenga el tamaño definido.

### 2. Mapeo Inteligente de Datos (Smart Data Mapping)
- **Componentes Lógicos:** Elementos como las capas de **Área** (imágenes) o **Campo** (texto) reaccionan a datos CSV o JSON mediante una **"Lookup Table"** interna.
- **Tematización Dinámica:** Capacidad de alterar estilos CSS (colores, bordes, fuentes) en tiempo real basados en las variables del archivo de datos.
- **Auto-Fit de Texto:** Los campos de texto monitorean el desbordamiento y ajustan dinámicamente el tamaño de la fuente para encajar en el área predefinida.

### 3. Pipeline de Activos (Asset Pipeline)
- **Optimización en Tiempo Real:** Integración con **Sharp** para convertir automáticamente cualquier recurso a **WebP**, reduciendo drásticamente el consumo de memoria RAM.
- **Sincronización Automática (Auto-Sync):** El sistema mantiene un vínculo con el archivo original (**source**). Al detectar un cambio, la aplicación regenera la versión optimizada de forma transparente.

---

## 🏗️ Arquitectura de Capas (Layers)

El diseño se organiza jerárquicamente bajo un nodo **Root**, gestionando dos tipos de capas fundamentales:

- **Capa de Área:** Nodo destinado a **activos visuales y gráficos**. Se procesa mediante el pipeline de **Sharp** para optimizar la memoria.
- **Capa de Campo:** Nodo de **texto dinámico** con soporte de **Auto-Fit** para evitar desbordamientos en el diseño.

---

## ⚙️ Propiedades Estáticas y Dinámicas

- **Estáticas:** Configuración fija del diseño base (fuentes permanentes, estructuras de bordes, colores corporativos).
- **Dinámicas:** Parámetros vinculados a la **Lookup Table**, permitiendo que el contenido cambie según el archivo de datos externo (CSV/JSON).

---

## 📊 Especificaciones Técnicas de Salida

- **Formato de Proyecto:** **.ctm** (Card Template Model).
- **Resolución de Trabajo:** Estándar de **1000 x 1800 px**.
- **Densidad de Impresión:** **200 px/cm** (ajustable mediante el control de **PPC**).

---

## 📝 Propuestas de Análisis Funcional

- **Mejora de UI (Renombramiento):** Se propone cambiar el nombre del módulo **"Coords"** por **"Tamaño y Posición o algo similar"**. Actualmente agrupa tanto la ubicación ($X, Y$) como las dimensiones físicas (**Width** / **Height**). También en el panel de arriba, ponerle un nombre antes de ver las medidas 

- **Validación de Límites:** Implementar una restricción funcional para que las capas no superen las dimensiones máximas del Canvas (por defecto **750 x 1350 px** o **5 x 9 cm**).

- **Panel derecho interactividad:** Evitar los desplazamientos actuales en el panel derecho, evitar que se vaya de pantalla cuando hacemos clic en alguna de las opciones del menú

- **Nombres de área y campo** Al confirmar, no se muestra el nombre correcto en el panel izquierdo 

- **Imagen nueva área:** cargar la imagen en el preview al subirla desde área nueva

---


