import React from "react";
import ILayerProps from "./ILayerProps";
import { IRootLayer } from "@common/layerTypes";

interface LayerRootProps extends ILayerProps {
  layerProps: IRootLayer;
}

const isImage = (path: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|avif)$/i;
  return imageExtensions.test(path);
};

const RootLayer: React.FC<LayerRootProps> = ({ layerProps, scale }: LayerRootProps) => {
  const backgroundImgStyle: React.CSSProperties = {
    top: 0,
    left: 0,
    width: layerProps.size.width * scale,
    height: layerProps.size.height * scale,
    position: "absolute"
  };

  const canvasStyles: React.CSSProperties = {
    display: "flex",
    backgroundColor: "#f5f5f5",
    backgroundImage:
      "linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%, #e0e0e0)",
    backgroundSize: "40px 40px",
    backgroundPosition: "0 0, 20px 20px",
    cursor: "crosshair",
    position: "relative",
    width: layerProps.size.width * scale,
    height: layerProps.size.height * scale
  };

  const rootStyles: React.CSSProperties = {
    width: layerProps.size.width * scale,
    height: layerProps.size.height * scale,
    position: "relative",
    margin: 0,
    padding: 0
  };
  const hasBackgroundImage = isImage(layerProps.style.backgroundImage as string);
  return (
    <div style={canvasStyles}>
      <div
        id="rootLayer"
        className="root-layer"
        style={{ ...rootStyles, ...layerProps.style, position: "relative" }}
      >
        {hasBackgroundImage ? (
          <img
            draggable="false"
            style={{ ...backgroundImgStyle, position: "relative" }}
            src={layerProps.style.backgroundImage}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default RootLayer;
