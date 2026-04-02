// src/common/types.ts

export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 1800;
export const DEFAULT_PIXELS_PER_CM = 200;
export const GRID_SNAP = 10;

export type DataType = "text" | "numeric" | "image" | "sprite";
export type DataSource = "project" | "parent";

export interface IComponentStyle {
  backgroundColor: string;
  border?: string;
  padding?: string;
}

export interface IComponentDefinition {
  id: string;
  name: string;
  type: DataType;
  source: DataSource;
  mappingKey: string; // The key in the JSON data
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: IComponentStyle;
  isPrimitive: boolean;
  children?: IComponentDefinition[]; // For grouping
}

export interface ICardProject {
  id: string;
  name: string;
  baseImage: string;
  components: IComponentDefinition[];
}
