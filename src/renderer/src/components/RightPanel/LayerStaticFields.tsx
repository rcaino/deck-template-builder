import React, { useEffect, useState } from "react";
import { Input, Space, InputNumber, Form, Collapse, FormInstance } from "antd";
import type { IComponentDefinition } from "@common/types";
import { SmartImageUpload } from "../Inputs/SmartImageUpload";
import { SmartColorPicker } from "../Inputs/SmartColorPicker";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import FontSelector from "../Inputs/FontSelector";
import { useTemplateStore } from "../../store/useTemplateStore";

interface ILayerFieldsProps {
  layer: IComponentDefinition;
  isForPrint: boolean;
  form: FormInstance;
}

export const LayerStaticFields: React.FC<ILayerFieldsProps> = ({ layer, isForPrint, form }) => {
  const setCanvasDimensions = useTemplateStore((state) => state.setCanvasDimensions);
  const canvasWidth = useTemplateStore((state) => state.canvasWidth);
  const canvasHeight = useTemplateStore((state) => state.canvasHeight);
  const isRoot = layer.type === "root";
  const isDataLayer = layer.type === "data";
  const isTextOrNumeric = isDataLayer && ["text", "numeric"].includes(layer.dataType);
  const hasBackground = !isDataLayer;
  const hasBorder = layer.style.border != undefined;
  const [bgImage, setBgImage] = useState<string>(layer.style.backgroundImage as string);
  const [borderImage, setBorderImage] = useState<string>(
    layer.style.border?.["borderImage"] as string
  );
  useEffect(() => {
    if (isRoot) {
      const rootData = layer as unknown as Record<string, unknown>;
      form.setFieldsValue({
        ppc: rootData.ppc
      });
    }
  }, [layer, isRoot, form]);

  return (
    <>
      <Form.Item name="name" label="Layer Name">
        <Input disabled={isRoot} />
      </Form.Item>
      {isRoot && (
        <Form.Item name="ppc" label="PPC">
          <InputNumber
            placeholder="ppc"
            onChange={(value) => {
              if (value && typeof value === "number") {
                // 1. Forzamos al formulario de Antd a registrar el cambio visualmente
                form.setFieldsValue({ ppc: value });

                // 2. Transmitimos el cambio inmediatamente al store global
                setCanvasDimensions(canvasWidth, canvasHeight, value);
              }
            }}
          />
        </Form.Item>
      )}
      <Collapse accordion size="small">
        <CollapsePanel key="general" header="Coords">
          {!isRoot && (
            <Form.Item label="Position" style={{ marginBottom: 0 }}>
              <Space.Compact>
                <Form.Item name={["position", "x"]}>
                  <InputNumber placeholder="X" disabled={isRoot} />
                </Form.Item>
                <Form.Item name={["position", "y"]}>
                  <InputNumber placeholder="Y" disabled={isRoot} />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          )}
          <Form.Item label="Size" style={{ marginBottom: 0 }}>
            <Space.Compact>
              <Form.Item name={["size", "width"]}>
                <InputNumber placeholder="Width" />
              </Form.Item>
              <Form.Item name={["size", "height"]}>
                <InputNumber placeholder="Height" />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </CollapsePanel>
        {hasBackground && (
          <CollapsePanel key="background" header="Background">
            <>
              <Form.Item name="backgroundColor" label="Background Color">
                <SmartColorPicker isForPrint={isForPrint} />
              </Form.Item>
              <Form.Item label="Background Image" style={{ marginBottom: 0 }}>
                <Space.Compact>
                  <Form.Item name={"backgroundImage"} valuePropName="layer.style.backgroundImage">
                    <SmartImageUpload value={bgImage} onChange={setBgImage} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </>
          </CollapsePanel>
        )}
        {hasBorder && (
          <CollapsePanel key="border" header="Border">
            <>
              <Form.Item name="borderColor" label="Border Color">
                <SmartColorPicker isForPrint={isForPrint} />
              </Form.Item>
              <Form.Item label="Border Image" style={{ marginBottom: 0 }}>
                <Space.Compact>
                  <Form.Item name={"borderImage"} valuePropName="style.border.borderImage">
                    <SmartImageUpload value={borderImage} onChange={setBorderImage} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </>
          </CollapsePanel>
        )}
        {isTextOrNumeric && (
          <CollapsePanel key="typography" header="Typography">
            <Form.Item name={["fontFamily"]} label="Font Family">
              <FontSelector value="" />
            </Form.Item>

            <Form.Item name={["fontSize"]} label="Font Size">
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item name={["fontColor"]} label="Text Color">
              <SmartColorPicker isForPrint={isForPrint} />
            </Form.Item>
          </CollapsePanel>
        )}
      </Collapse>
    </>
  );
};
