import { ILocale } from "../ILocale";

export const localeEN: ILocale = {
  common: {
    appName: "🎴 Deck Template Builder",
    projectLabel: "Project:",
    noProjectLoaded: "No project loaded"
  },
  menu: {
    undo: "Undo",
    redo: "Redo",
    newProject: "New Project",
    openProject: "Open Project",
    editFields: "Edit Data Model",
    exportTemplate: "Export Template"
  },

  leftPanel: {
    sectionNewLayerTitle: "New Layer",
    newLayerAreaButtonText: "Area",
    newLayerDataButtonText: "Data",
    sectionLayers: "Layers"
  },
  centralPanel: {
    project: "Project",
    newProject: "New Project",
    canvas: "Card Area",
    settings: {
      zoomOut: "Zoom Out",
      resetZoom: "Reset Zoom",
      zoomIn: "Zoom In",
      turn: "Turn",
      calibrate: "Calibrate",
      previous: "Previous",
      generic: "Generic Card",
      next: "Next"
    }
  },
  rightPanel: {
    sectionLayerTitle: "Admin",
    removeLayerButtonText: "Remove Layer",
    reorderLayerButtonText: "Reorder Layer",
    sectionEditorTitle: "Properties",
    formSubmit: "Confirm",
    formCancel: "Cancel",
    tabStatic: { title: "Static" },
    tabDynamic: { title: "Dynamic" }
  },
  dialogs: {
    canvasConfiguration: "Canvas Configuration",
    projectName: "Project Name",
    canvasWidth: "Canvas Width",
    canvasHeight: "Canvas Height",
    pixelsPerCentimeter: "Pixels per Centimeter",
    createProject: "Create Project",
    save: "Save",
    cancel: "Cancel",
    fieldEditor: "Field Editor",
    componentEditor: "Component Editor",
    name: "Name",
    type: "Type",
    position: "Position",
    style: "Style",
    delete: "Delete",
    placeholder: {
      cardTemplate: "My Card Template",
      fieldName: "Field Name",
      fontSize: "Font Size",
      optionValue: "Value",
      optionLabel: "Label"
    }
  },
  fields: {
    newAreaLayer: "New Area",
    newFieldLayer: "New Field"
  }
};
