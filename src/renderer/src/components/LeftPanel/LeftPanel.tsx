import React from "react";
import { Layout } from "antd";
import { AddLayerButtons } from "./AddLayerButtons";
import LayerTree from "./LayerTree.js";
import styles from "./LeftPanel.module.css";

const { Sider } = Layout;

const LeftPanel: React.FC = () => {
  return (
    <Sider className={styles.sider}>
      <AddLayerButtons />
      <LayerTree />
    </Sider>
  );
};

export default LeftPanel;
