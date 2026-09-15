import React from "react";
import { Button, theme } from "antd";

export interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText: string;
  confirmText: string;
  isConfirmLoading?: boolean;
  isConfirmDisabled?: boolean;
  width?: string;
  style?: React.CSSProperties;
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  isConfirmLoading = false,
  isConfirmDisabled = false,
  width,
  style
}) => {
  const { token } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    width: width ?? "100%",
    ...style
  };

  const cancelButtonStyle: React.CSSProperties = {
    flex: 1,
    border: `2px solid ${token.colorBorderSecondary}`
  };

  const confirmButtonStyle: React.CSSProperties = {
    flex: 1
  };

  return (
    <div style={containerStyle}>
      <Button onClick={onCancel} style={cancelButtonStyle}>
        {cancelText}
      </Button>
      <Button
        type="primary"
        onClick={onConfirm}
        loading={isConfirmLoading}
        disabled={isConfirmDisabled}
        style={confirmButtonStyle}
      >
        {confirmText}
      </Button>
    </div>
  );
};
