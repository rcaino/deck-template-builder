import React, { ReactElement } from "react";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useFontStore } from "@renderer/store/useFontStore";
import { useI18n } from "@renderer/hooks/useI18n";

interface FontSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }): ReactElement => {
  const { t } = useI18n();
  const { fonts, setLastUsedFont } = useFontStore();
  const onChangeHandler = (path: string): void => {
    setLastUsedFont(path);
    onChange?.(path);
  };

  const options: DefaultOptionType[] = [
    {
      label: t("fields.props.font.selector.local"),
      options: fonts
        .filter((f): boolean => f.type === "local")
        .map((f): DefaultOptionType => ({ label: f.name, value: f.path }))
    },
    {
      label: t("fields.props.font.selector.system"),
      options: fonts
        .filter((f): boolean => f.type === "system")
        .map((f): DefaultOptionType => ({ label: f.name, value: f.path }))
    }
  ];

  const handleRender = (option: DefaultOptionType): React.ReactNode => {
    return (
      <span
        style={{
          fontFamily: option.value ? `"${option.label}"` : "inherit",
          fontSize: "14px"
        }}
      >
        {option.label}
      </span>
    );
  };

  return (
    <Select
      value={value}
      onChange={onChangeHandler}
      options={options}
      showSearch={true}
      style={{ width: "100%" }}
      optionRender={handleRender}
      labelRender={handleRender}
    />
  );
};

export default FontSelector;
