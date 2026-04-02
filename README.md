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
