import React from "react";
import ILayerProps from "./ILayerProps";
import { IRootLayer } from "@common/layerTypes";

interface LayerRootProps extends ILayerProps {
  layerProps: IRootLayer;
  children?: React.ReactNode;
}

const isImage = (path: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg|avif)$/i;
  return imageExtensions.test(path);
};

const RootLayer: React.FC<LayerRootProps> = ({ layerProps, scale, children }: LayerRootProps) => {
  const backgroundImgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: layerProps.size.width * scale,
    height: layerProps.size.height * scale,
    // objectFit: "cover",
    pointerEvents: "none"
  };

  const canvasStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    position: "relative",
    width: layerProps.size.width * scale,
    height: layerProps.size.height * scale,
    margin: 0,
    padding: 0,
    overflow: "hidden"
  };
  const hasBackgroundImage =
    typeof layerProps.style.backgroundColor === "string"
      ? false
      : isImage(layerProps.style.backgroundImage as string);

  return (
    <div style={canvasStyles} className="canvas-container">
      <div
        id="rootLayer"
        className="root-layer"
        style={{
          ...rootStyles,
          ...layerProps.style,
          backgroundImage: hasBackgroundImage ? undefined : layerProps.style.backgroundImage
        }}
        data-layer-id={layerProps.id}
      >
        {hasBackgroundImage && (
          <img
            draggable="false"
            style={backgroundImgStyle}
            src={layerProps.style.backgroundImage}
            alt="Card Background"
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default RootLayer;
