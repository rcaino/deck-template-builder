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
    dataType,
    style,
    cardData,
    scale
  } = props;

  const rawValue = cardData ? cardData[mappingKey] : undefined;

  // 1. CORRECCIÓN: Armamos el objeto libremente y aplicamos el casteo al final para evitar herencias rotas de CSS
  const containerStyles = {
    position: "absolute",
    left: position.x * scale.x,
    top: position.y * scale.y,
    width: size.width * scale.x,
    height: size.height * scale.y,
    zIndex: level + 1,
    ...style
  } as React.CSSProperties;

  // 2. CORRECCIÓN: Aseguramos que fontSize sea numérico antes de multiplicarlo por la escala
  const scaledFontSize = typeof fontSize === "number" ? fontSize * scale.y : undefined;

  const renderContent: () => JSX.Element = () => {
    if (rawValue === undefined) {
      return (
        <span style={{ color: fontColor || "#888", fontSize: scaledFontSize, fontFamily }}>
          [{props.name}]
        </span>
      );
    }

    switch (dataType) {
      case "numeric":
        return (
          <span
            style={{ color: fontColor, fontSize: scaledFontSize, fontFamily, fontWeight: "bold" }}
          >
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
                backgroundPosition: `-${sprite.x * scale.x}px -${sprite.y * scale.y}px`,
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
          <span
            style={{
              color: fontColor,
              fontSize: scaledFontSize,
              fontFamily,
              wordBreak: "break-word"
            }}
          >
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
