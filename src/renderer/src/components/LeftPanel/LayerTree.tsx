import React from "react";
import { useI18n } from "../../hooks/useI18n";
import { Divider, Tree } from "antd";
import { IComponentDefinition, ILevelLayer } from "@common/types";
import { useTemplateStore } from "@renderer/store/useTemplateStore";
import { DataNode } from "antd/es/tree";

const dividerStyle: React.CSSProperties = {
  backgroundColor: "var(--ant-color-link-hover)",
  borderRadius: "5px 5px 0 0"
};

const mapLayerNode: (layer: IComponentDefinition) => DataNode = (layer) => {
  return {
    key: layer.id,
    title: layer.name,
    children: []
  };
};

export const LayerTree: React.FC = () => {
  const { t } = useI18n();
  const selectedLayer = useTemplateStore((state) => state.selectedLayer);
  const setSelectedLayer = useTemplateStore((state) => state.setSelectedLayer);

  const layers = useTemplateStore((state) => state.layers);
  const root: DataNode = mapLayerNode(layers.root);
  const nodesMap: Record<string, DataNode> = {
    [root.key as string]: root
  };
  const otherLayers = Object.values(layers).filter((x) => x.id !== "root") as ILevelLayer[];
  otherLayers.sort((a, b) => a.level - b.level);
  otherLayers.forEach((layer) => {
    const newNode = mapLayerNode(layer);
    nodesMap[layer.id] = newNode;
    const parentNode = nodesMap[layer.parentId] || root;
    if (!parentNode.children) {
      parentNode.children = [];
    }
    parentNode.children.push(newNode);
  });

  const treeData: DataNode[] = [root];

  const handleSelectLayer = (selectedKeys: React.Key[]): void => {
    const layerId = selectedKeys[0] as string;
    setSelectedLayer(layerId);
  };

  return (
    <>
      <Divider style={dividerStyle}>{t("leftPanel.sectionLayers")}</Divider>
      <Tree
        style={{ display: "flex", flex: 1 }}
        styles={{
          itemTitle: { font: "status-bar" },
          root: { display: "flex", flex: 1, overflow: "auto" }
        }}
        defaultExpandAll={true}
        showLine={true}
        selectable={true}
        selectedKeys={[selectedLayer]}
        onSelect={handleSelectLayer}
        checkStrictly
        treeData={treeData}
      />
    </>
  );
};

export default LayerTree;
