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
import { useI18n } from "../../hooks/useI18n";

interface CanvasControlsProps {
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSliderChange: (value: number) => void;
  onCalibrateClick: () => void;
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
  onCalibrateClick,
  onPrevious,
  onNext,
  projectName,
  canvasWidth,
  canvasHeight,
  canvasPPC
}) => {
  const { t } = useI18n();
  const swapXY = useTemplateStore((state) => state.swapXY);
  return (
    <div style={containerStyle}>
      <div>
        <Space>
          <Button
            {...{ disabled: zoomLevel <= 0.5 }}
            icon={<ZoomOutOutlined />}
            onClick={onZoomOut}
            title={t("centralPanel.settings.zoomOut")}
          />
          <Button
            icon={<UndoOutlined />}
            onClick={onResetZoom}
            title={t("centralPanel.settings.resetZoom")}
          />
          <Button
            {...{ disabled: zoomLevel >= 2 }}
            icon={<ZoomInOutlined />}
            onClick={onZoomIn}
            title={t("centralPanel.settings.zoomIn")}
          />
          <Button
            icon={<InteractionFilled />}
            onClick={() => swapXY()}
            title={t("centralPanel.settings.turn")}
          />
          <Button
            icon={<BorderOuterOutlined />}
            onClick={onCalibrateClick}
            title={t("centralPanel.settings.calibrate")}
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
      <div style={{ textAlign: "center", verticalAlign: "middle" }}>
        <span>
          {t("centralPanel.project")}:{" "}
          {projectName && projectName !== "New Project"
            ? projectName
            : t("centralPanel.newProject")}
        </span>
        <br />
        <span>
          {t("centralPanel.canvas")}: {canvasWidth}px × {canvasHeight}px
        </span>
        <br />
        <span>
          {`${(canvasWidth / canvasPPC).toFixed(2)}cm 📐 ${(canvasHeight / canvasPPC).toFixed(2)}cm`}
        </span>
      </div>
      <div>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onPrevious}
            title={t("centralPanel.settings.previous")}
          />
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => console.log(t("centralPanel.settings.generic"))}
            title={t("centralPanel.settings.generic")}
          />
          <Button
            icon={<ArrowRightOutlined />}
            onClick={onNext}
            title={t("centralPanel.settings.next")}
          />
        </Space>
      </div>
    </div>
  );
};

export default CanvasControls;
