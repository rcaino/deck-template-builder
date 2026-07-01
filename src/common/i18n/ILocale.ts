/**
 * Type definitions for i18n system
 * All locale files must conform to this interface
 */

interface ILocale {
  common: {
    appName: string;
    projectLabel: string;
    noProjectLoaded: string;
  };
  menu: {
    undo: string;
    redo: string;
    newProject: string;
    openProject: string;
    editFields: string;
    exportTemplate: string;
  };
  leftPanel: {
    sectionNewLayerTitle: string;
    newLayerAreaButtonText: string;
    newLayerDataButtonText: string;
    sectionLayers: string;
  };
  /* declaro las variables del panel central y configuracones */
  /* las desclaro en medio de panel izquierdo y derecho como en la app */
  centralPanel: {
    Project: string;
    NewProject: string;
    Canvas: string;
    settings: {
      ZoomOut: string;
      ResetZoom: string;
      ZoomIn: string;
      Turn: string;
      Calibrate: string;
      Previous: string;
      Generic: string;
      Next: string;
    };
  };
  rightPanel: {
    tabStatic: { title: string };
    tabDynamic: { title: string };
    sectionLayerTitle: string;
    removeLayerButtonText: string;
    reorderLayerButtonText: string;
    sectionEditorTitle: string;
    formSubmit: string;
    formCancel: string;
  };
  dialogs: {
    canvasConfiguration: string;
    projectName: string;
    canvasWidth: string;
    canvasHeight: string;
    pixelsPerCentimeter: string;
    createProject: string;
    save: string;
    cancel: string;
    fieldEditor: string;
    componentEditor: string;
    name: string;
    type: string;
    position: string;
    style: string;
    delete: string;
    placeholder: {
      cardTemplate: string;
      fieldName: string;
      fontSize: string;
      optionValue: string;
      optionLabel: string;
    };
  };
  fields: {
    newAreaLayer: string;
    newFieldLayer: string;
  };
}

type LeaveTypes = string;

type NestedPaths<T, P extends string = ""> = T extends LeaveTypes
  ? P
  : {
      [K in keyof T & string]: P extends "" ? NestedPaths<T[K], K> : NestedPaths<T[K], `${P}.${K}`>;
    }[keyof T & string];

type LocaleKeys = NestedPaths<ILocale>;

export type { LocaleKeys, ILocale };
