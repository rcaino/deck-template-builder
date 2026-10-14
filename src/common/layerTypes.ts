import type { CSSProperties } from "react";
import type { DataType, IComponentStyle, IVector2D } from "./types";

export interface IDataDefinitionField {
  fieldName: string;
  dataType: DataType;
}

export interface ISize2D {
  width: number;
  height: number;
}

export interface IBaseLayer {
  id: string;
  name: string;
  position: IVector2D;
  size: ISize2D;
  style: IComponentStyle;
}

export interface IRootLayer extends IBaseLayer {
  type: "root";
  position: { x: 0; y: 0 };
  ppc: number;
}

export type CustomShapePath =
  | "circle"
  | "hexagon"
  | "l-chevron"
  | "l-point"
  | "pentagon"
  | "r-chevron"
  | "r-point"
  | "rhombus"
  | "star"
  | "triangle";

export type LayerClipPath = CSSProperties["clipPath"] | CustomShapePath;

export interface IAreaLayer extends IBaseLayer {
  type: "area";
  level: number;
  parentId: string;
  mappingKey?: string;
  conditionalStyle?: (keyof IComponentStyle)[];
  path?: LayerClipPath;
}

export interface IDataLayer extends IBaseLayer {
  type: "data";
  level: number;
  parentId: string;
  dataType: DataType;
  mappingKey: string;
  fontColor?: CSSProperties["color"];
  fontSize?: CSSProperties["fontSize"];
  fontFamily?: CSSProperties["fontFamily"];
}
