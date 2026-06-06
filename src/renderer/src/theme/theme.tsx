import { ThemeConfig, theme } from "antd";

// Paleta de colores base (Indigo & Slate)
const colors = {
  primaryLight: "#4f46e5", // Indigo 600
  primaryDark: "#6366f1", // Indigo 500 (Un poco más brillante para destacar en fondo oscuro)
  success: "#10b981", // Emerald 500
  warning: "#f59e0b", // Amber 500
  error: "#f43f5e", // Rose 500
  info: "#3b82f6", // Blue 500

  // Neutros claros
  bgLightBase: "#ffffff",
  bgLightLayout: "#f8fafc", // Slate 50
  bgLightContainer: "#fafafa",
  textLight: "#0f172a", // Slate 900

  // Neutros oscuros (Evitamos el negro puro #000 para un look más premium)
  bgDarkBase: "#0f172a", // Slate 900
  bgDarkLayout: "#020617", // Slate 950
  bgDarkContainer: "#1e293b", // Slate 800
  textDark: "#f8fafc" // Slate 50
};

// --- TEMA CLARO ---
export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Colores de marca y estado
    colorPrimary: colors.primaryLight,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    // Fondos y texto
    colorBgBase: colors.bgLightBase,
    colorBgLayout: colors.bgLightLayout,
    colorBgContainer: colors.bgLightContainer,
    colorTextBase: colors.textLight,

    // Tipografía y formas (Toque moderno)
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    borderRadius: 8, // Bordes ligeramente más redondeados
    wireframe: false // Desactiva el estilo alámbrico para un look más sólido
  },
  components: {
    Layout: {
      bodyBg: colors.bgLightLayout,
      headerBg: colors.bgLightContainer,
      siderBg: colors.bgLightContainer
    },
    Card: {
      boxShadowTertiary: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" // Sombra suave moderna
    },
    Tabs: {
      colorBgBase: "#a5a0a580",
      cardBg: "#a5adad",
      colorBorderBg: "#334155"
    }
  }
};

// --- TEMA OSCURO ---
export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Colores de marca y estado
    colorPrimary: colors.primaryDark,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,

    // Fondos y texto
    colorBgBase: colors.bgDarkBase,
    colorBgLayout: colors.bgDarkLayout,
    colorBgContainer: colors.bgDarkContainer,
    colorTextBase: colors.textDark,

    // Elevación y bordes
    colorBorder: "#334155", // Slate 700 para bordes sutiles en modo oscuro
    colorBorderSecondary: "#1e293b",

    // Tipografía y formas
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    borderRadius: 8,
    wireframe: false
  },
  components: {
    Layout: {
      bodyBg: colors.bgDarkLayout,
      headerBg: colors.bgDarkBase,
      siderBg: colors.bgDarkBase
    },
    Card: {
      // En modo oscuro, se prefieren bordes sutiles en lugar de sombras intensas
      colorBorderSecondary: "#334155"
    }
  }
};
