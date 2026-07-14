import React, { useEffect, useState } from "react";
import { Trash2Icon, FolderTree } from "lucide-react";
import {
  Button,
  Checkbox,
  CheckboxChangeEvent,
  Divider,
  Form,
  Space,
  Tabs,
  Tooltip,
  Typography
} from "antd";
import Sider from "antd/es/layout/Sider";
import { IComponentDefinition } from "@common/types";
import { useTemplateStore } from "@renderer/store/useTemplateStore";
import { useI18n } from "@renderer/hooks/useI18n";
import { LayerStaticFields } from "./LayerStaticFields";
import styles from "./RightPanel.module.css";
import { LayerDynamicFields } from "./LayerDynamicFields";

const buttonStyle: React.CSSProperties = {
  display: "auto",
  flexDirection: "column",
  height: "70px",
  width: "90px"
};

const dividerStyle: React.CSSProperties = {
  backgroundColor: "var(--ant-color-link-hover)",
  borderRadius: "5px 5px 0 0"
};

const { Text } = Typography;
const RightPanel: React.FC = () => {
  const { t } = useI18n();

  const selectedLayer = useTemplateStore((state) => state.selectedLayer);
  const removeLayer = useTemplateStore((state) => state.removeLayer);
  const currentLayer = useTemplateStore((state) => state.layers[selectedLayer]);
  const reorderLayer: (id: string) => void = (id) => console.log(id);
  const [isForPrint, setIsForPrint] = useState<boolean>(false);
  const handleCheckboxChange = (e: CheckboxChangeEvent): void => {
    setIsForPrint(e.target.checked);
  };
  const setCanvasDimensions = useTemplateStore((state) => state.setCanvasDimensions);
  const canvasWidth = useTemplateStore((state) => state.canvasWidth);
  const canvasHeight = useTemplateStore((state) => state.canvasHeight);

  const [form] = Form.useForm<IComponentDefinition>();

  useEffect(() => {
    form.resetFields();
  }, [currentLayer, form]);

  const handleCancel: () => void = () => {
    form.resetFields();
  };
  const isRoot = currentLayer.type == "root";
  return (
    <Sider className={styles.sider}>
      <Divider style={dividerStyle}>{t("rightPanel.sectionLayerTitle")}</Divider>
      <Space.Compact style={{ justifyContent: "center" }}>
        <Tooltip title={t("rightPanel.removeLayerButtonText")}>
          <Button
            style={buttonStyle}
            icon={<Trash2Icon />}
            iconPlacement="start"
            onClick={() => removeLayer(currentLayer.id)}
            disabled={isRoot}
          />
        </Tooltip>
        <Tooltip title={t("rightPanel.reorderLayerButtonText")}>
          <Button
            style={buttonStyle}
            icon={<FolderTree />}
            iconPlacement="start"
            onClick={() => reorderLayer(currentLayer.id)}
            disabled={isRoot}
          />
        </Tooltip>
      </Space.Compact>
      <Checkbox onChange={handleCheckboxChange} checked={isForPrint}>
        <Text strong>Destinado a impresión</Text>
      </Checkbox>
      <Divider style={dividerStyle}>{t("rightPanel.sectionEditorTitle")}</Divider>
      <Space.Compact>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={currentLayer}
          onFinish={(values) => {
            console.log(values);

            if (selectedLayer === "root") {
              const formData = form.getFieldsValue() as unknown as Record<string, unknown>;
              if (formData && typeof formData.ppc === "number") {
                setCanvasDimensions(canvasWidth, canvasHeight, formData.ppc);
              }
            }
          }}
        >
          <Tabs
            centered
            type="card"
            items={[
              {
                style: {
                  flex: "1"
                },
                label: t("rightPanel.tabStatic.title"),
                key: "Static",
                children: (
                  <LayerStaticFields isForPrint={isForPrint} layer={currentLayer} form={form} />
                )
              },
              {
                label: t("rightPanel.tabDynamic.title"),
                key: "Dynamic",
                children: <LayerDynamicFields isForPrint={isForPrint} layer={currentLayer} />
              }
            ]}
          />

          <Form.Item style={{ marginTop: 24 }}>
            <Space size="small">
              <Button type="primary" htmlType="submit">
                {t("rightPanel.formSubmit")}
              </Button>
              <Button htmlType="button" onClick={handleCancel}>
                {t("rightPanel.formCancel")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Space.Compact>
    </Sider>
  );
};
export default RightPanel;
