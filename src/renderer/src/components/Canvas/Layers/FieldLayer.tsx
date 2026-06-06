import React from "react";
import { IDataLayer } from "@common/layerTypes";
import ILayerProps from "./ILayerProps";

interface FieldLayerProps extends ILayerProps, IDataLayer {}

const FieldLayer: React.FC<FieldLayerProps> = (props) => {
  const styles: React.CSSProperties = {
    zIndex: props.level + 1
  };
  return <div style={styles}></div>;
};

export default FieldLayer;
