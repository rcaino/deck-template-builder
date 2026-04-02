// src/common/types.ts

export const DEFAULT_CANVAS_WIDTH = 1000;
export const DEFAULT_CANVAS_HEIGHT = 1800;
export const PIXELS_PER_CM = 200;
export const GRID_SNAP = 10;

export type DataType = "text" | "numeric" | "icon" | "image" | "sprite";
export type DataSource = "project" | "parent";

export interface ComponentStyle {
  backgroundColor: string;
  border?: string;
  padding?: string;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  type: DataType;
  source: DataSource;
  mappingKey: string; // The key in the JSON data
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: ComponentStyle;
  isPrimitive: boolean;
  children?: ComponentDefinition[]; // For grouping
}

export interface CardProject {
  id: string;
  name: string;
  baseImage: string;
  components: ComponentDefinition[];
}
