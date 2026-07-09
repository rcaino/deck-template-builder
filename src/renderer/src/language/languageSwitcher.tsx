import React from "react";
import { FloatButton } from "antd";
import { useI18n } from "../hooks/useI18n";
import { SpanishFlag, EnglishFlag, FlagContainer } from "./language";

interface LanguageSwitcherProps {
  children?: React.ReactNode;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ children }) => {
  const { locale, setLocale } = useI18n();

  const handleToggleLanguage = (): void => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <>
      <FloatButton
        style={{ bottom: 70, right: 220, width: "fit-content", height: "fit-content" }}
        shape="circle"
        onClick={handleToggleLanguage}
        icon={<FlagContainer>{locale === "es" ? <EnglishFlag /> : <SpanishFlag />}</FlagContainer>}
      />
      {children}
    </>
  );
};

export default LanguageSwitcher;
