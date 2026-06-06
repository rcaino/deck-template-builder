import "./assets/main.css";
import "./assets/base.css";
import "./assets/default_project_template/card-back.png";
import "./assets/default_project_template/card-front-back.png";
import "./assets/default_project_template/card-front-border.png";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ThemeSwitcher from "./theme/themeSwitcher";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeSwitcher>
      <App />
    </ThemeSwitcher>
  </StrictMode>
);
