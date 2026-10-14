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

  const backgroundColor: React.CSSProperties =
    !hasBackgroundImage && style.backgroundColor ? { backgroundColor: style.backgroundColor } : {};

  const borderConfig = style.borderConfig;

  const getBorderStyle = (): React.CSSProperties => {
    if (!borderConfig) return {};

    const computedBorderWidth = `${borderConfig.borderWidth * scale.y}px ${borderConfig.borderWidth * scale.x}px`;

    if ("borderImage" in borderConfig && borderConfig.borderImage) {
      return {
        borderStyle: borderConfig.borderStyle,
        borderWidth: computedBorderWidth,
        borderImageSlice: borderConfig.borderImageSlice,
        borderImageRepeat: borderConfig.borderImageRepeat,
        borderImageSource: `url("${borderConfig.borderImage}")`
      };
    }

    return {
      borderWidth: computedBorderWidth,
      borderStyle: borderConfig.borderStyle,
      borderColor: borderConfig.borderColor
    };
  };

  const borderSpanStyle: React.CSSProperties = {
    ...backgroundImgStyle,
    ...getBorderStyle()
  };

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
        {borderConfig && <span style={borderSpanStyle} />}
        {children}
      </div>
    </div>
  );
};

export default RootLayer;
