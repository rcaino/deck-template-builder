import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTemplateStore } from "../../store/useTemplateStore";
import { Content } from "antd/es/layout/layout";
import CanvasControls from "./CanvasControls";
import CanvasViewport from "./CanvasViewport";

const INITIAL_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;
const SCROLL_INCREMENT = 20;

const contentStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 120,
  minWidth: 120,
  height: "100%",
  width: "100%",
  overflow: "hidden",
  backgroundImage:
    "linear-gradient(to right, var(--ant-color-primary-bg-hover),var(--ant-color-primary-bg))"
};

const Canvas: React.FC = () => {
  const projectName = useTemplateStore((state) => state.projectName) || "Generic";
  const canvasHeight = useTemplateStore((state) => state.canvasHeight);
  const canvasWidth = useTemplateStore((state) => state.canvasWidth);
  const canvasPPC = useTemplateStore((state) => state.canvasPPC);

  // --- State Management ---
  const [zoomLevel, setZoomLevel] = useState<number>(INITIAL_ZOOM);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Zoom Helper Functions ---
  const constrainZoom = (zoom: number): number => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  };

  const calculateCenteredZoom = useCallback(
    (newZoom: number): void => {
      if (!viewportRef.current) return;

      const oldZoom = zoomLevel;
      newZoom = constrainZoom(newZoom);

      if (oldZoom === newZoom) return;

      // Update zoom
      setZoomLevel(newZoom);
    },
    [zoomLevel]
  );

  // --- Zoom Controls ---
  const handleZoomIn = useCallback(() => {
    calculateCenteredZoom(zoomLevel + ZOOM_STEP);
  }, [zoomLevel, calculateCenteredZoom]);

  const handleZoomOut = useCallback(() => {
    calculateCenteredZoom(zoomLevel - ZOOM_STEP);
  }, [zoomLevel, calculateCenteredZoom]);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1);
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
      viewportRef.current.scrollTop = 0;
    }
  }, []);

  const handlePrevious = useCallback(() => {
    console.log("handlePrevious");
  }, []);
  const handleNext = useCallback(() => {
    console.log("handleNext");
  }, []);

  const handleSliderChange = (value: number): void => {
    calculateCenteredZoom(value);
  };

  // --- Keyboard & Arrow Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Zoom shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "+":
            e.preventDefault();
            handleZoomIn();
            break;
          case "-":
            e.preventDefault();
            handleZoomOut();
            break;
          case "0":
            e.preventDefault();
            handleResetZoom();
            break;
          case "ArrowLeft":
            console.log("Left key pressed");
            break;
          case "ArrowRight":
            console.log("Right key pressed");
            break;
        }
      } else {
        // Arrow key navigation
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          const viewport = viewportRef.current;
          if (!viewport) return;

          e.preventDefault();
          const step = e.shiftKey ? SCROLL_INCREMENT * 3 : SCROLL_INCREMENT;

          switch (e.key) {
            case "ArrowUp":
              viewport.scrollTop -= step;
              break;
            case "ArrowDown":
              viewport.scrollTop += step;
              break;
            case "ArrowLeft":
              viewport.scrollLeft -= step;
              break;
            case "ArrowRight":
              viewport.scrollLeft += step;
              break;
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetZoom]);

  // --- Mouse Wheel Protection ---
  useEffect(() => {
    const handleWheel = (e: WheelEvent): void => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <Content style={contentStyle}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
        <CanvasControls
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canvasHeight={canvasHeight}
          canvasPPC={canvasPPC}
          canvasWidth={canvasWidth}
          onSliderChange={handleSliderChange}
          projectName={projectName}
        />
        <CanvasViewport
          canvasHeight={canvasHeight}
          canvasPPC={canvasPPC}
          canvasWidth={canvasWidth}
          zoomLevel={zoomLevel}
          viewportRef={viewportRef}
          canvasRef={canvasRef}
        />
      </div>
    </Content>
  );
};

export default Canvas;
