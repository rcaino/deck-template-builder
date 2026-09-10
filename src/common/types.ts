import type { CSSProperties } from "react";
import type { IAreaLayer, IDataLayer, IRootLayer } from "./layerTypes";

export const GRID_SNAP = 10 as const;

export type DataType = "text" | "numeric" | "image" | "sprite";
export type IComponentDefinition = IRootLayer | IAreaLayer | IDataLayer;
export type ILevelLayer = IAreaLayer | IDataLayer;

export interface IComponentStyle {
  readonly backgroundImage?: CSSProperties["backgroundImage"];
  readonly backgroundColor?: CSSProperties["backgroundColor"];
  readonly border?: Readonly<
    | {
        borderWidth: number;
        borderStyle: CSSProperties["borderStyle"];
        borderColor: CSSProperties["borderColor"];
        borderImage?: never;
        borderImageSlice: never;
        borderImageRepeat: never;
      }
    | {
        borderStyle: "solid";
        borderWidth: number;
        borderImage: CSSProperties["borderImage"];
        borderImageSlice: CSSProperties["borderImageSlice"];
        borderImageRepeat: "round";
        borderColor?: never;
      }
  >;
}

export interface ICardProject {
  readonly id: string;
  readonly name: string;
  readonly components: readonly IComponentDefinition[];
}

export type FontType = "local" | "system";

export interface IFontInfo {
  readonly name: string;
  readonly path: string;
  readonly type: FontType;
}

export interface IVector2D {
  readonly x: number;
  readonly y: number;
}

export interface IAppConfig {
  readonly canvasLocalScaleToReal: Readonly<IVector2D>;
}
