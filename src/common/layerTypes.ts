import { DataType, IComponentStyle } from "./types";

export interface IDataDefinitionField {
  fieldName: string;
  dataType: DataType;
}

export interface IRootLayer {
  id: string;
  name: string;
  type: "root";
  position: { x: 0; y: 0 };
  size: { width: number; height: number };
  ppc: number;
  style: IComponentStyle;
}

export interface IAreaLayer {
  id: string;
  name: string;
  type: "area";
  mappingKey?: string; // The attribute key in the JSON data
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: IComponentStyle;
  conditionalStyle: Array<keyof IComponentStyle>;
  backgroundColor?: React.CSSProperties["backgroundColor"];
  backgroundImage?: React.CSSProperties["backgroundImage"];
  path?:
    | React.CSSProperties["clipPath"]
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
  border?: React.CSSProperties["border"];
  level: number;
  parentId: string;
}

export interface IDataLayer {
  id: string;
  name: string;
  type: "data";
  dataType: DataType;
  mappingKey: string; // The attribute key in the JSON data
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: IComponentStyle;
  fontColor?: React.CSSProperties["color"];
  fontSize: React.CSSProperties["fontSize"];
  fontFamily: React.CSSProperties["fontFamily"];
  level: number;
  parentId: string;
}
