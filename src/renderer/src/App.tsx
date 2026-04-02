import Versions from "./components/Versions";

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <div className="creator">Powered by electron-vite</div>
      <Versions></Versions>
    </>
  );
}

export default App;
