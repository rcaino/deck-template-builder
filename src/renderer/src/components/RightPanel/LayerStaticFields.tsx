import React, { useState } from "react";
import { Input, Space, InputNumber, Form, Collapse } from "antd";
import type { IComponentDefinition } from "@common/types";
import { SmartImageUpload } from "../Inputs/SmartImageUpload";
import { SmartColorPicker } from "../Inputs/SmartColorPicker";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import FontSelector from "../Inputs/FontSelector";
import { useI18n } from "@renderer/hooks/useI18n";

interface ILayerFieldsProps {
  layer: IComponentDefinition;
  isForPrint: boolean;
}

export const LayerStaticFields: React.FC<ILayerFieldsProps> = ({ layer, isForPrint }) => {
  const { t } = useI18n();
  const isRoot = layer.type === "root";
  const isDataLayer = layer.type === "data";
  const isTextOrNumeric = isDataLayer && ["text", "numeric"].includes(layer.dataType);
  const hasBackground = !isDataLayer;
  const hasBorder = layer.style.border != undefined;
  const [bgImage, setBgImage] = useState<string>(layer.style.backgroundImage as string);
  const [borderImage, setBorderImage] = useState<string>(
    layer.style.border?.["borderImage"] as string
  );

  return (
    <>
      <Form.Item name="name" label={t("fields.props.layerName")}>
        <Input disabled={isRoot} />
      </Form.Item>
      {isRoot && (
        <Form.Item name="ppc" label="PPC">
          <InputNumber placeholder="ppc" />
        </Form.Item>
      )}
      <Collapse accordion size="small">
        {!isRoot && (
          <CollapsePanel key="position" header={t("fields.props.coords.header")}>
            <Space.Compact>
              <Form.Item name={["position", "x"]} label={t("fields.props.coords.x")}>
                <InputNumber placeholder="X" disabled={isRoot} />
              </Form.Item>
              <Form.Item name={["position", "y"]} label={t("fields.props.coords.y")}>
                <InputNumber placeholder="Y" disabled={isRoot} />
              </Form.Item>
            </Space.Compact>
          </CollapsePanel>
        )}
        <CollapsePanel key="size" header={t("fields.props.size.header")}>
          <Space.Compact>
            <Form.Item name={["size", "width"]} label={t("fields.props.size.width")}>
              <InputNumber placeholder={t("fields.props.size.width")} />
            </Form.Item>
            <Form.Item name={["size", "height"]} label={t("fields.props.size.height")}>
              <InputNumber placeholder={t("fields.props.size.height")} />
            </Form.Item>
          </Space.Compact>
        </CollapsePanel>
        {hasBackground && (
          <CollapsePanel key="background" header={t("fields.props.background.header")}>
            <>
              <Form.Item name="backgroundColor" label={t("fields.props.background.color")}>
                <SmartColorPicker isForPrint={isForPrint} />
              </Form.Item>
              <Form.Item label={t("fields.props.background.image")} style={{ marginBottom: 0 }}>
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
          <CollapsePanel key="border" header={t("fields.props.border.header")}>
            <>
              <Form.Item name="borderColor" label={t("fields.props.border.color")}>
                <SmartColorPicker isForPrint={isForPrint} />
              </Form.Item>
              <Form.Item label="Border Image" style={{ marginBottom: 0 }}>
                <Space.Compact>
                  <Form.Item
                    name={"borderImage"}
                    valuePropName="style.border.borderImage"
                    label={t("fields.props.border.image")}
                  >
                    <SmartImageUpload value={borderImage} onChange={setBorderImage} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </>
          </CollapsePanel>
        )}
        {isTextOrNumeric && (
          <CollapsePanel key="typography" header={t("fields.props.font.typo")}>
            <Form.Item name={["fontFamily"]} label={t("fields.props.font.family")}>
              <FontSelector value={layer.fontFamily} />
            </Form.Item>

            <Form.Item name={["fontSize"]} label={t("fields.props.font.size")}>
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item name={["fontColor"]} label={t("fields.props.font.color")}>
              <SmartColorPicker isForPrint={isForPrint} />
            </Form.Item>
          </CollapsePanel>
        )}
      </Collapse>
    </>
  );
};
