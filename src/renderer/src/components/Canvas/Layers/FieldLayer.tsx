import React, { JSX } from "react";
import { IDataLayer } from "@common/layerTypes";
import { DataType } from "@common/types";
import ILayerProps from "./ILayerProps";

interface FieldLayerProps extends ILayerProps, IDataLayer {
  cardData?: Record<string, DataType>;
}

const FieldLayer: React.FC<FieldLayerProps> = (props) => {
  const {
    position,
    size,
    level,
    fontColor,
    fontSize,
    fontFamily,
    mappingKey,
    dataType, // Este es tu "text" | "numeric" | "image" | "sprite"
    style,
    cardData
  } = props;

  const rawValue = cardData ? cardData[mappingKey] : undefined;

  const containerStyles: React.CSSProperties = {
    position: "absolute",
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    zIndex: level + 1,
    ...style
  };
  const renderContent: () => JSX.Element = () => {
    if (rawValue === undefined) {
      return (
        <span style={{ color: fontColor || "#888", fontSize, fontFamily }}>[{props.name}]</span>
      );
    }

    switch (dataType) {
      case "numeric":
        return (
          <span style={{ color: fontColor, fontSize, fontFamily, fontWeight: "bold" }}>
            {Number(rawValue)}
          </span>
        );

      case "image":
        return (
          <img
            src={String(rawValue)}
            alt={props.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        );

      case "sprite":
        try {
          const sprite = typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${sprite.sheet})`,
                backgroundPosition: `-${sprite.x}px -${sprite.y}px`,
                backgroundSize: "auto",
                backgroundRepeat: "no-repeat"
              }}
            />
          );
        } catch (error) {
          console.log("Sprite error: ", error);
          return <span style={{ color: "red" }}>⚠️ Sprite Error</span>;
        }

      case "text":
      default:
        return (
          <span style={{ color: fontColor, fontSize, fontFamily, wordBreak: "break-word" }}>
            {String(rawValue)}
          </span>
        );
    }
  };

  return (
    <div
      style={containerStyles}
      data-layer-id={props.id}
      className={`field-layer-type-${dataType}`}
    >
      {renderContent()}
    </div>
  );
};

export default FieldLayer;
