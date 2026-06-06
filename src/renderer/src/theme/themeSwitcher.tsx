// App.tsx
import React, { useState, createContext } from "react";
import { ConfigProvider, FloatButton } from "antd";
import { SunIcon, MoonIcon } from "lucide-react";
import { lightTheme, darkTheme } from "./theme";

interface ThemeSwitcherProps {
  children?: React.ReactNode;
}

const ThemeModeContext = createContext<boolean | undefined>(undefined);

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ThemeModeContext.Provider value={isDarkMode}>
      <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <FloatButton
          style={{ bottom: 12, right: 220, width: "fit-content", height: "fit-content" }}
          onClick={() => setIsDarkMode(!isDarkMode)}
          icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
        />
        {children}
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeSwitcher;
export { ThemeModeContext };
