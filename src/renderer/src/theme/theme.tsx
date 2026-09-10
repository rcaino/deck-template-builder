import { ThemeConfig, theme } from "antd";

// Paleta de colores base unificada (Indigo & Slate)
const colors = {
  primaryLight: "#4f46e5", // Indigo 600
  primaryDark: "#6366f1", // Indigo 500 (Más brillante para modo oscuro)
  primaryDarkHover: "#818cf8", // Indigo 400

  success: "#10b981", // Emerald 500
  warning: "#f59e0b", // Amber 500
  error: "#f43f5e", // Rose 500
  info: "#3b82f6", // Blue 500

  // Neutros claros
  bgLightBase: "#ffffff",
  bgLightLayout: "#f8fafc", // Slate 50
  bgLightContainer: "#fafafa",
  textLight: "#0f172a", // Slate 900
  textLightSecondary: "#475569", // Slate 600
  textLightPlaceholder: "#94a3b8", // Slate 400
  borderLight: "#cbd5e1", // Slate 300
  borderLightSecondary: "#6366f1",
  railLight: "#e2e8f0", // Slate 200

  // Neutros oscuros
  bgDarkBase: "#0f172a", // Slate 900
  bgDarkLayout: "#020617", // Slate 950
  bgDarkContainer: "#1e293b", // Slate 800
  textDark: "#f8fafc", // Slate 50
  textDarkSecondary: "#94a3b8", // Slate 400
  textDarkPlaceholder: "#64748b", // Slate 500
  borderDark: "#334155", // Slate 700
  borderDarkSecondary: "#1e293b", // Slate 800
  railDarkHover: "#475569", // Slate 600

  // Compartidos / Transparencias
  shadowLight: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  shadowLightLarge: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  shadowDarkLarge: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
};

// --- CONFIGURACIÓN BASE COMPARTIDA ---
const baseToken = {
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  borderRadius: 8,
  wireframe: false,
  colorSplit: "transparent"
};

// --- TEMA CLARO ---
export const lightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    ...baseToken,
    colorPrimary: colors.primaryLight,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorBgBase: colors.bgLightBase,
    colorBgLayout: colors.bgLightLayout,
    colorBgContainer: colors.bgLightContainer,
    colorTextBase: colors.textLight,
    colorTextDescription: colors.textLightSecondary,
    colorTextPlaceholder: colors.textLightPlaceholder,
    colorBorder: colors.borderLight,
    colorBorderSecondary: colors.borderLightSecondary
  },
  components: {
    Layout: {
      bodyBg: colors.bgLightLayout,
      headerBg: colors.bgLightContainer,
      siderBg: colors.bgLightContainer
    },
    Card: {
      boxShadowTertiary: colors.shadowLight
    },
    Tabs: {
      colorBgBase: colors.bgLightLayout,
      cardBg: colors.borderLight,
      colorBorderBg: colors.borderLight
    },
    Modal: {
      contentBg: colors.bgLightBase,
      headerBg: colors.bgLightBase,
      footerBg: "transparent",
      titleColor: colors.textLight,
      borderRadiusLG: 12,
      boxShadow: colors.shadowLightLarge
    },
    Slider: {
      railBg: colors.railLight,
      railHoverBg: colors.borderLight,
      trackBg: colors.primaryLight,
      trackHoverBg: colors.primaryLight,
      handleColor: colors.primaryLight,
      handleActiveColor: colors.primaryLight
    }
  }
};

// --- TEMA OSCURO ---
export const darkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...baseToken,
    colorPrimary: colors.primaryDark,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorBgBase: colors.bgDarkBase,
    colorBgLayout: colors.bgDarkLayout,
    colorBgContainer: colors.bgDarkContainer,
    colorTextBase: colors.textDark,
    colorTextDescription: colors.textDarkSecondary,
    colorTextPlaceholder: colors.textDarkPlaceholder,
    colorBorder: colors.borderDark,
    colorBorderSecondary: colors.borderDarkSecondary
  },
  components: {
    Layout: {
      bodyBg: colors.bgDarkLayout,
      headerBg: colors.bgDarkBase,
      siderBg: colors.bgDarkBase
    },
    Card: {
      colorBorderSecondary: colors.borderDark
    },
    Tabs: {
      colorBgBase: colors.bgDarkLayout,
      cardBg: colors.bgDarkContainer,
      colorBorderBg: colors.borderDark
    },
    Modal: {
      contentBg: colors.bgDarkContainer,
      headerBg: colors.bgDarkContainer,
      footerBg: "transparent",
      titleColor: colors.textDark,
      borderRadiusLG: 12,
      boxShadow: colors.shadowDarkLarge
    },
    Slider: {
      railBg: colors.borderDark,
      railHoverBg: colors.railDarkHover,
      trackBg: colors.primaryDark,
      trackHoverBg: colors.primaryDarkHover,
      handleColor: colors.primaryDark,
      handleActiveColor: colors.primaryDarkHover
    }
  }
};
