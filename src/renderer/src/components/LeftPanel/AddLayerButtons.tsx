import React from "react";
import { Button, Divider, Space } from "antd";
import { useI18n } from "@renderer/hooks/useI18n";
import { BoxIcon, FileJson2Icon } from "lucide-react";
import { useTemplateStore } from "@renderer/store/useTemplateStore";
import { IAreaLayer, IDataLayer } from "@common/layerTypes";
import { ulid } from "@common/ulid";
import { ILevelLayer } from "@common/types";
import { useFontStore } from "@renderer/store/useFontStore";

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

const _maxAreaLvl = 3;

const AddLayerButtons: React.FC = () => {
  const { t } = useI18n();
  const upsertLayer = useTemplateStore((state) => state.upsertLayer);
  const selectedLayer = useTemplateStore((state) => state.selectedLayer);
  const currentLayer = useTemplateStore((state) => state.layers[selectedLayer]);
  const setSelectedLayer = useTemplateStore((state) => state.setSelectedLayer);
  const { fonts, lastUsedFont } = useFontStore();

  const newAreaLayer: IAreaLayer = {
    id: ulid(),
    parentId: currentLayer.id,
    level: (currentLayer.type == "root" ? 0 : currentLayer.level) + 1,
    name: t("fields.newAreaLayer"),
    type: "area",
    position: currentLayer.position,
    conditionalStyle: [],
    size: { height: currentLayer.size.height / 2, width: currentLayer.size.width / 2 },
    style: {}
  };

  const newDataLayer: IDataLayer = {
    id: ulid(),
    parentId: currentLayer.id,
    level: (currentLayer.type == "root" ? 0 : currentLayer.level) + 1,
    name: t("fields.newFieldLayer"),
    type: "data",
    position: currentLayer.position,
    size: { height: currentLayer.size.height / 2, width: currentLayer.size.width / 2 },
    style: {},
    mappingKey: "",
    dataType: "text",
    fontSize: 14,
    fontFamily: lastUsedFont?.path ?? fonts[0]?.path
  };

  const addNewLayer: (newLayer: ILevelLayer) => void = (newLayer: ILevelLayer) => {
    if (currentLayer.type == "data") return;
    upsertLayer(newLayer);
    setSelectedLayer(newLayer.id);
  };

  return (
    <>
      <Divider style={dividerStyle}>{t("leftPanel.sectionNewLayerTitle")}</Divider>
      <Space.Compact style={{ justifyContent: "center" }}>
        <Button
          style={buttonStyle}
          icon={<BoxIcon />}
          iconPlacement="start"
          onClick={() => addNewLayer(newAreaLayer)}
          disabled={
            currentLayer.type == "data" ||
            (currentLayer.type == "area" && currentLayer.level > _maxAreaLvl)
          }
        >
          {t("leftPanel.newLayerAreaButtonText")}
        </Button>
        <Button
          style={buttonStyle}
          icon={<FileJson2Icon />}
          iconPlacement="start"
          disabled={
            currentLayer.type == "data" ||
            (currentLayer.type == "area" && currentLayer.level > _maxAreaLvl + 1)
          }
          onClick={() => addNewLayer(newDataLayer)}
        >
          {t("leftPanel.newLayerDataButtonText")}
        </Button>
      </Space.Compact>
    </>
  );
};

export { AddLayerButtons };
