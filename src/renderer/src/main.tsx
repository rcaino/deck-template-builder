import "./assets/main.css";
import "./assets/base.css";
import.meta.glob("./assets/fonts/*.ttf", { eager: true });
import.meta.glob("./assets/default_project_template/*.png", { eager: true });

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ThemeSwitcher from "./theme/themeSwitcher";
import LanguageSwitcher from "./language/languageSwitcher";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeSwitcher>
      <LanguageSwitcher>
        <App />
      </LanguageSwitcher>
    </ThemeSwitcher>
  </StrictMode>
);
