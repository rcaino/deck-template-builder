// src/common/types.ts
import { IAreaLayer, IDataLayer, IRootLayer } from "./layerTypes";

export const GRID_SNAP = 10;

export type DataType = "text" | "numeric" | "image" | "sprite";
export type IComponentDefinition = IRootLayer | IAreaLayer | IDataLayer;
export type ILevelLayer = IAreaLayer | IDataLayer;

export interface IComponentStyle {
  backgroundImage?: React.CSSProperties["backgroundImage"];
  backgroundColor?: React.CSSProperties["backgroundColor"];
  border?: React.CSSProperties["border"];
}

export interface ICardProject {
  id: string;
  name: string;
  components: IComponentDefinition[];
}
