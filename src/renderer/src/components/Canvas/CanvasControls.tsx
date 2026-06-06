import React from "react";
import { Space, Button, Slider } from "antd";
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  BorderOuterOutlined,
  UndoOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  AppstoreOutlined,
  InteractionFilled
} from "@ant-design/icons";
import { useTemplateStore } from "../../store/useTemplateStore";

interface CanvasControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSliderChange: (value: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  projectName: string;
  canvasWidth: number;
  canvasHeight: number;
  canvasPPC: number;
}

const containerStyle: React.CSSProperties = {
  padding: "12px 16px",
  display: "flex",
  gap: "16px",
  alignItems: "center",
  borderBottom: "1px solid var(--ant-color-border)",
  backgroundColor: "var(--ant-color-bg-container)",
  justifyContent: "space-between"
};

const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSliderChange,
  onPrevious,
  onNext,
  projectName,
  canvasWidth,
  canvasHeight,
  canvasPPC
}) => {
  const swapXY = useTemplateStore((state) => state.swapXY);
  return (
    <div style={containerStyle}>
      <div>
        <Space>
          <Button
            {...{ disabled: zoomLevel <= 0.5 }}
            icon={<ZoomOutOutlined />}
            onClick={onZoomOut}
            title="Zoom Out (Ctrl+-)"
          />
          <Button icon={<UndoOutlined />} onClick={onResetZoom} title="Reset Zoom (Ctrl+0)" />
          <Button
            {...{ disabled: zoomLevel >= 2 }}
            icon={<ZoomInOutlined />}
            onClick={onZoomIn}
            title="Zoom In (Ctrl++)"
          />
          <Button icon={<InteractionFilled />} onClick={() => swapXY()} title="Turn" />
          <Button
            icon={<BorderOuterOutlined />}
            onClick={() => console.log("calibrate")}
            title="Calibrate"
          />
        </Space>

        <Slider
          style={{ width: 200 }}
          min={0.5}
          max={2}
          step={0.1}
          value={zoomLevel}
          onChange={onSliderChange}
          marks={{
            [0.5]: "x0.5",
            [1.5]: "x1.5",
            1: "x1",
            [2]: "x2"
          }}
          tooltip={{ formatter: (val) => `${Math.round((val as number) * 100)}%` }}
        />
      </div>
      <div style={{ textAlign: "center", verticalAlign: "center" }}>
        <span>Project: {projectName}</span>
        <br />
        <span>
          Canvas: {canvasWidth}px × {canvasHeight}px
        </span>
        <br />
        <span>
          {canvasWidth / canvasPPC}cm × {canvasHeight / canvasPPC}cm
        </span>
      </div>
      <div>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onPrevious} title="Previous (Ctrl+←)" />
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => console.log("genericData")}
            title="Generic "
          />
          <Button icon={<ArrowRightOutlined />} onClick={onNext} title="Next (Ctrl+→)" />
        </Space>
      </div>
    </div>
  );
};

export default CanvasControls;
