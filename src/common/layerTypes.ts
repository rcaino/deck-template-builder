import type { CSSProperties } from "react";
import type { DataType, IComponentStyle, IVector2D } from "./types";

export interface IDataDefinitionField {
  readonly fieldName: string;
  readonly dataType: DataType;
}

export interface ISize2D {
  readonly width: number;
  readonly height: number;
}

export interface IBaseLayer {
  readonly id: string;
  readonly name: string;
  readonly position: Readonly<IVector2D>;
  readonly size: Readonly<ISize2D>;
  readonly style: Readonly<IComponentStyle>;
}

export interface IRootLayer extends IBaseLayer {
  readonly type: "root";
  readonly position: { readonly x: 0; readonly y: 0 };
  readonly ppc: number;
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
  readonly type: "area";
  readonly level: number;
  readonly parentId: string;
  readonly mappingKey?: string;
  readonly conditionalStyle?: readonly (keyof IComponentStyle)[];
  readonly path?: LayerClipPath;
}

export interface IDataLayer extends IBaseLayer {
  readonly type: "data";
  readonly level: number;
  readonly parentId: string;
  readonly dataType: DataType;
  readonly mappingKey: string;
  readonly fontColor?: CSSProperties["color"];
  readonly fontSize?: CSSProperties["fontSize"];
  readonly fontFamily?: CSSProperties["fontFamily"];
}
