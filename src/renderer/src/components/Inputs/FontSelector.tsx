import React, { ReactElement } from "react";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useFontStore } from "@renderer/store/useFontStore";

interface FontSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }): ReactElement => {
  const { fonts, setLastUsedFont } = useFontStore();
  const onChangeHandler = (path: string): void => {
    setLastUsedFont(path);
    onChange?.(path);
  };

  const options: DefaultOptionType[] = [
    {
      label: "Local",
      options: fonts
        .filter((f): boolean => f.type === "local")
        .map((f): DefaultOptionType => ({ label: f.name, value: f.path }))
    },
    {
      label: "Sistema",
      options: fonts
        .filter((f): boolean => f.type === "system")
        .map((f): DefaultOptionType => ({ label: f.name, value: f.path }))
    }
  ];

  const handleRender = (option: DefaultOptionType): React.ReactNode => {
    if (!option.value) return option.label;

    return (
      <span
        style={{
          fontFamily: `"${option.label}"`,
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
      placeholder="Selecciona una fuente"
      style={{ width: "100%" }}
      optionRender={handleRender}
    />
  );
};

export default FontSelector;
