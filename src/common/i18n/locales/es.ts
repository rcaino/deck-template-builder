import { ILocale } from "../ILocale";

export const localeES: ILocale = {
  common: {
    appName: "🎴 Deck Template Builder",
    projectLabel: "Proyecto:",
    noProjectLoaded: "Sin proyecto cargado"
  },
  menu: {
    undo: "Deshacer",
    redo: "Rehacer",
    newProject: "Nuevo Proyecto",
    openProject: "Abrir Proyecto",
    editFields: "Editar Campos",
    exportTemplate: "Exportar Template"
  },
  leftPanel: {
    sectionNewLayerTitle: "Nueva Capa",
    newLayerAreaButtonText: "Área",
    newLayerDataButtonText: "Campo",
    sectionLayers: "Capas"
  },
  centralPanel: {
    project: "Proyecto",
    newProject: "Nuevo Proyecto",
    canvas: "Área de Carta",
    settings: {
      zoomOut: "Alejar",
      resetZoom: "Restablecer Zoom",
      zoomIn: "Acercar",
      turn: "Girar",
      calibrate: "Calibrar",
      previous: "Previo"
      generic: "Carta Base",
      next: "Avanzar Cambio"
    }
  },
  rightPanel: {
    sectionLayerTitle: "Gestionar",
    removeLayerButtonText: "Quitar Capa",
    reorderLayerButtonText: "Mover Capa",
    sectionEditorTitle: "Propiedades",
    formSubmit: "Confirmar",
    formCancel: "Cancelar",
    tabStatic: { title: "Estáticas" },
    tabDynamic: { title: "Dinámicas" }
  },
  dialogs: {
    canvasConfiguration: "Configuración del Lienzo",
    projectName: "Nombre del Proyecto",
    canvasWidth: "Ancho del Lienzo",
    canvasHeight: "Alto del Lienzo",
    pixelsPerCentimeter: "Píxeles por Centímetro",
    createProject: "Crear Proyecto",
    save: "Guardar",
    cancel: "Cancelar",
    fieldEditor: "Editor de Campos",
    componentEditor: "Editor de Componentes",
    name: "Nombre",
    type: "Tipo",
    position: "Posición",
    style: "Estilo",
    delete: "Eliminar",
    placeholder: {
      cardTemplate: "Mi Template de Cartas",
      fieldName: "Nombre del Campo",
      fontSize: "Tamaño de Fuente",
      optionValue: "Valor",
      optionLabel: "Etiqueta"
    }
  },
  fields: {
    newAreaLayer: "Nuevo Área",
    newFieldLayer: "Nuevo Campo"
  }
};
