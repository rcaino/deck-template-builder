import React, { useEffect, useRef, useState } from "react";
import interact from "interactjs";

interface CalibratorProps {
  onCalibrationComplete: (calculatedPpc: number) => void;
  onCancel: () => void;
}

// Dimensiones oficiales ISO ID-1 de una tarjeta de crédito en cm
const CARD_REAL_WIDTH_CM = 8.56;
const CARD_REAL_HEIGHT_CM = 5.398;
const ASPECT_RATIO = CARD_REAL_WIDTH_CM / CARD_REAL_HEIGHT_CM;

export const Calibrator: React.FC<CalibratorProps> = ({ onCalibrationComplete, onCancel }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  // Estado interno para almacenar las dimensiones en píxeles del recuadro digital
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 / ASPECT_RATIO });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!boxRef.current) return;

    // Inicializar interactjs para arrastrar y redimensionar manteniendo el aspecto
    const instance = interact(boxRef.current)
      .draggable({
        listeners: {
          move(event) {
            setPosition((prev) => ({
              x: prev.x + event.dx,
              y: prev.y + event.dy
            }));
          }
        }
      })
      .resizable({
        edges: { left: true, right: true, top: true, bottom: true },
        modifiers: [
          // Forzar a interactjs a mantener la proporción de la tarjeta bancaria
          interact.modifiers.aspectRatio({
            ratio: ASPECT_RATIO
          })
        ],
        listeners: {
          move(event) {
            setDimensions({
              width: event.rect.width,
              height: event.rect.height
            });
            setPosition((prev) => ({
              x: prev.x + event.deltaRect.left,
              y: prev.y + event.deltaRect.top
            }));
            const { target } = event;
            if (target) {
              target.style.width = `${event.rect.width}px`;
              target.style.height = `${event.rect.height}px`;
            }
            setDimensions({
              width: event.rect.width,
              height: event.rect.height
            });
          }
        }
      });

    return () => instance.unset();
  }, []);

  const handleConfirm = (): void => {
    // Tomamos los píxeles lógicos y los convertimos a píxeles físicos reales de tu hardware
    const pixelesFisicos = dimensions.width * window.devicePixelRatio;

    // Calculamos el PPC real basado en tu hardware
    const finalPpc = pixelesFisicos / CARD_REAL_WIDTH_CM;

    onCalibrationComplete(finalPpc);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          color: "#fff",
          marginBottom: "20px",
          textAlign: "center",
          fontFamily: "sans-serif"
        }}
      >
        <h2>Calibración de Pantalla</h2>
        <p>Coloca una tarjeta de banco física sobre tu pantalla.</p>
        <p>Ajusta los bordes del recuadro hasta que coincida exactamente con el tamaño real.</p>
      </div>

      {/* Recuadro interactivo de calibración */}
      <div
        ref={boxRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
          border: "3px solid #4CAF50",
          borderRadius: "12px", // Simula las esquinas redondeadas de la tarjeta
          boxShadow: "0 0 15px rgba(76, 175, 80, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          touchAction: "none",
          position: "absolute",
          cursor: "move",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4CAF50",
          fontWeight: "bold"
        }}
      >
        Alinea tu Tarjeta Aquí
      </div>

      <div style={{ position: "absolute", bottom: "40px", display: "flex", gap: "20px" }}>
        <button
          onClick={onCancel}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Cancelar
        </button>
        <button
          onClick={handleConfirm}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
        >
          Confirmar Calibración
        </button>
      </div>
    </div>
  );
};
