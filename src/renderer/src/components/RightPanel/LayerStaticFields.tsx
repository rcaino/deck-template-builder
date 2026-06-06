import React, { useState } from "react";
import { Input, Space, InputNumber, Form } from "antd";
import { IComponentDefinition } from "@common/types";
import { SmartImageUpload } from "../Inputs/SmartImageUpload";
import { SmartColorPicker } from "../Inputs/SmartColorPicker";

interface ILayerFieldsProps {
  layer: IComponentDefinition;
  isForPrint: boolean;
}

export const LayerStaticFields: React.FC<ILayerFieldsProps> = ({ layer, isForPrint }) => {
  const isRoot = layer.type === "root";
  const hasBackground = ["root", "area"].includes(layer.type);
  const [bgImage, setBgImage] = useState<string>(layer.style.backgroundImage as string);
  return (
    <>
      <Form.Item name="name" label="Layer Name">
        <Input disabled={isRoot} />
      </Form.Item>
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
      {isRoot && (
        <Form.Item name="ppc" label="PPC">
          <InputNumber placeholder="ppc" />
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
      {hasBackground && (
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
      )}
    </>
  );
};
