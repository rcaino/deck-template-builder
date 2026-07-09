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
  centralPanel: {
    project: string;
    newProject: string;
    canvas: string;
    settings: {
      zoomOut: string;
      resetZoom: string;
      zoomIn: string;
      turn: string;
      calibrate: string;
      previous: string;
      generic: string;
      next: string;
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
