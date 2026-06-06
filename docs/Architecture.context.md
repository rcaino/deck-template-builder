# Documento Arquitectónico del Proyecto

Este documento establece la fuente de verdad para la arquitectura, el diseño y las prácticas de desarrollo de la aplicación.

## 1. Tecnologías (Technologies)

Esta sección detalla las tecnologías principales utilizadas en el proyecto.

### Frontend

- **Framework:** React (con TypeScript)
- **Librería de UI:** Ant Design (antd)
- **Estilos:** CSS/SCSS (o la estrategia de _styling_ implementada)
- **Build Tool:** Vite (implícito por la configuración de Vite)

### Backend (Si aplica)

- _A rellenar según la implementación_

### Datos y Estado

- **Gestión de Estado:** (Ej: Zustand)
- **Persistencia:** (Ej: LocalStorage, IndexedDB, API calls a un servidor)

## 2. Arquitectura (Architecture)

Esta sección describe la estructura general y el flujo de la aplicación.

### Patrón de Diseño

- **Estructura:** Componentes basados en funcionalidad (Feature-based).
- **Flujo de Datos:** Unidireccional, gestionado por el estado global (Zustand).
- **Comunicación:** Comunicación unidireccional desde el estado central hacia los componentes.

### Estructura de Carpetas

- **`src/components`**: Contendrá todos los componentes reutilizables.
- **`src/store`**: Lógica central de gestión de estado (Zustand stores).
- **`src/services`**: Lógica de interacción con APIs o servicios externos.

## 3. Prácticas (Practices)

Esta sección define las reglas y estándares que deben seguir todos los desarrolladores.

### Estándares de Código

- **Lenguaje:** TypeScript es obligatorio.
- **Componentes:** Se priorizarán los Componentes Funcionales.
- **Hooks:** Uso de Hooks de React es obligatorio.

### Estilo y Formato

- **Linting/Formato:** Uso estricto de ESLint y Prettier.
- **Nomenclatura:** Seguir convenciones de nomenclatura claras y consistentes.
- **Diseño:** Adherencia estricta a la guía de diseño de Ant Design y las directrices de UI/UX.

### Flujo de Trabajo (Workflow)

- **Control de Versiones:** Git.
- **Pruebas:** Implementación de pruebas unitarias/integración (Vitest/Jest).
- **Revisión de Código:** Obligatoria a través de Pull Requests.
