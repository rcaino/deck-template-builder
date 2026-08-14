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
  const { size, style } = layerProps;

  const backgroundImgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: size.width * scale.x,
    height: size.height * scale.y,
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
    width: size.width * scale.x,
    height: size.height * scale.y
  };

  const rootStyles: React.CSSProperties = {
    position: "relative",
    width: size.width * scale.x,
    height: size.height * scale.y,
    margin: 0,
    padding: 0,
    overflow: "hidden"
  };
  const hasBackgroundImage = !style.backgroundColor && isImage(style.backgroundImage as string);

  const backgroundColor = (!hasBackgroundImage && { backgroundColor: style.backgroundColor }) || {};

  const hasBorder = style.border != undefined;

  const borderProperties = style.border as unknown as Record<string, unknown>;

  const borderWidthObj = borderProperties?.borderWidth as Record<string, unknown> | undefined;

  const computedBorderWidth =
    typeof borderWidthObj?.y === "number" && typeof borderWidthObj?.x === "number"
      ? `${borderWidthObj?.y * scale.y}px ${borderWidthObj?.x * scale.x}px`
      : undefined;

  return (
    <div style={canvasStyles} className="canvas-container">
      <div
        id="rootLayer"
        className="root-layer"
        style={{
          ...rootStyles,
          ...backgroundColor
        }}
        data-layer-id={layerProps.id}
      >
        {hasBackgroundImage && (
          <img
            draggable="false"
            style={backgroundImgStyle}
            src={style.backgroundImage}
            alt="Card Background"
          />
        )}
        {hasBorder && (
          <span
            style={
              {
                ...backgroundImgStyle,
                ...borderProperties,
                borderWidth: computedBorderWidth,
                borderImage: borderProperties?.borderImage
                  ? `url("${borderProperties.borderImage}")`
                  : undefined
              } as React.CSSProperties
            }
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default RootLayer;
