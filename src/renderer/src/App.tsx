import { Layout } from "antd";
import Navbar from "./components/TopHeader/Navbar";
import Canvas from "./components/Canvas/Canvas";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import { useFontStore } from "./store/useFontStore";
import { useLocalConfigStore } from "./store/useLocalConfigStore";

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

useFontStore.getState().loadFonts();
useLocalConfigStore.getState().loadLocalConfig();

function App(): React.JSX.Element {
  return (
    <Layout style={layoutStyle}>
      <Navbar />
      <Layout>
        <LeftPanel />
        <Canvas />
        <RightPanel />
      </Layout>
    </Layout>
  );
}

export default App;
