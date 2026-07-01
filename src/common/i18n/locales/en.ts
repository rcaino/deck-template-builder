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
  /* traduzco a ingles las variables el panel central y configuracones */
  centralPanel: {
    Project: "Project",
    NewProject: "New Project",
    Canvas: "Card Area",
    settings: {
      ZoomOut: "Zoom Out",
      ResetZoom: "Reset Zoom",
      ZoomIn: "Zoom In",
      Turn: "Turn",
      Calibrate: "Calibrate",
      Previous: "Previous",
      Generic: "Generic Card",
      Next: "Next"
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
