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
import { useI18n } from "@renderer/hooks/useI18n";//agregado la libreria

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
  /* projectName = "Mi Súper Carta"; */ /* hardcodeo para ver si funciona */
  const { t } = useI18n();//agregado, asigna a t la funcion de traduccion
  const swapXY = useTemplateStore((state) => state.swapXY);
  return (
    <div style={containerStyle}>
      <div>
        <Space>
          <Button
            {...{ disabled: zoomLevel <= 0.5 }}
            icon={<ZoomOutOutlined />}
            onClick={onZoomOut}
            title={t("centralPanel.settings.ZoomOut")}//cambiado
          />
          <Button
            icon={<UndoOutlined />}
            onClick={onResetZoom}
            title={t("centralPanel.settings.ResetZoom")}//cambiado
          />
          <Button
            {...{ disabled: zoomLevel >= 2 }}
            icon={<ZoomInOutlined />}
            onClick={onZoomIn}
            title={t("centralPanel.settings.ZoomIn")}//cambiado
          />
          <Button
            icon={<InteractionFilled />}
            onClick={() => swapXY()}
            title={t("centralPanel.settings.Turn")}//cambiado
          />
          <Button
            icon={<BorderOuterOutlined />}
            onClick={() => console.log("calibrate")}
            title={t("centralPanel.settings.Calibrate")}//cambiado
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
          {t("centralPanel.Project")}:{" "}{/*cambiado*/}
          {projectName && projectName !== "New Project"
            ? projectName
            : t("centralPanel.NewProject")}{/* cambie el hardcodeo de la palabar project y tambien el projectname por si carga un nombre y si no carga se pone en false y mostrara la traduccion */}
        </span>
        <br />
        <span>
          <span>{t("centralPanel.Canvas")}: </span> {canvasWidth}px × {canvasHeight}px{/* cambiado */}
        </span>
        <br />
        <span>
          {canvasWidth / canvasPPC}cm × {canvasHeight / canvasPPC}cm
        </span>
      </div>
      <div>
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onPrevious}
            title={t("centralPanel.settings.Previous")}
          />
          <Button
            icon={<AppstoreOutlined />}
            onClick={() => console.log(t("centralPanel.settings.Generic"))}
            title={t("centralPanel.settings.Generic")}
          />
          <Button
            icon={<ArrowRightOutlined />}
            onClick={onNext}
            title={t("centralPanel.settings.Next")}
          />
        </Space>
      </div>
    </div>
  );
};

export default CanvasControls;
