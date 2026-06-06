import { Layout } from "antd";
// import { useTemplateStore } from "./store/useTemplateStore";
import Navbar from "./components/TopHeader/Navbar";
import Canvas from "./components/Canvas/Canvas";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
};

function App(): React.JSX.Element {
  // const projectName = useTemplateStore((state) => state.projectName);

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
