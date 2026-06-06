import React from "react";
import { IAreaLayer } from "@common/layerTypes";
import ILayerProps from "./ILayerProps";

interface AreaLayerProps extends ILayerProps, IAreaLayer {
  isRoot: false;
  children?: React.ReactNode;
}

const getPath: (path: AreaLayerProps["path"]) => React.CSSProperties["clipPath"] = (path) => {
  switch (path) {
    case "circle":
      return "circle(50% at 50% 50%);";
    case "hexagon":
      return "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);";
    case "l-chevron":
      return "polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%);";
    case "l-point":
      return "polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%);";
    case "pentagon":
      return "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);";
    case "r-chevron":
      return "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%);";
    case "r-point":
      return "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);";
    case "rhombus":
      return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);";
    case "star":
      return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 80% 100%, 50% 70%, 20% 100%, 32% 57%, 2% 35%, 39% 35%);";
    case "triangle":
      return "polygon(0% 0%, 0% 100%, 100% 100%);";
    default:
      return path;
  }
};

const AreaLayer: React.FC<AreaLayerProps> = (props) => {
  const styles: React.CSSProperties = {
    position: "absolute",
    left: props.position.x,
    top: props.position.y,
    width: props.size.width,
    height: props.size.height,
    zIndex: props.level + 1,
    backgroundColor: props.backgroundColor,
    backgroundImage: props.backgroundImage,
    clipPath: getPath(props.path),
    border: props.border,
    ...props.style
  };

  return (
    <div style={styles} data-layer-id={props.id}>
      {props.children}
    </div>
  );
};
export default AreaLayer;
