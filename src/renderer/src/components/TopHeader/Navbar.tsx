import React, { useRef, useEffect } from "react";
import { Button, Flex, FloatButton, Tooltip } from "antd";
import { Header } from "antd/es/layout/layout";
import { FloatButtonElement } from "antd/es/float-button/FloatButton";
import {
  UndoIcon,
  RedoIcon,
  SaveIcon,
  FolderOpenIcon,
  AsteriskIcon,
  FileArchiveIcon,
  TableConfigIcon
} from "lucide-react";
import { useI18n } from "../../hooks/useI18n";
import { useTemplateStore } from "@renderer/store/useTemplateStore";
import { useHistoryStore } from "@renderer/store/useHistoryStore";

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 0
};

const boxStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  textAlign: "center",
  justifyContent: "center",
  paddingLeft: 10,
  borderBottom: "1px solid var(--ant-color-info-border)",
  boxShadow: "0 10px 15px -3px var(--ant-color-info-border)",
  padding: 5,
  zIndex: -1
};

const buttonStyle: React.CSSProperties = {
  width: 100
};

const Navbar: React.FC = () => {
  const { t } = useI18n();

  // 1. Consumimos las acciones del Template Store
  const executeUndo = useTemplateStore((state) => state.executeUndo);
  const executeRedo = useTemplateStore((state) => state.executeRedo);

  // 2. Consumimos de forma reactiva los stacks del History Store
  // Nota: Ajusta 'undoStack' y 'redoStack' si en tu useHistoryStore se llaman diferente (ej. 'past' y 'future')
  const undoCount = useHistoryStore((state) => state.undoStack?.length || 0);
  const redoCount = useHistoryStore((state) => state.redoStack?.length || 0);

  // Referencias para los atajos de teclado
  const btnSaveRef = useRef<FloatButtonElement>(null);
  const btnUndoRef = useRef<FloatButtonElement>(null);
  const btnRedoRef = useRef<FloatButtonElement>(null);
  const btnNewProjectRef = useRef<HTMLButtonElement>(null);
  const btnLoadProjectRef = useRef<HTMLButtonElement>(null);
  const btnEditFieldsRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown: (event: KeyboardEvent) => void = (event) => {
      if (!(event.ctrlKey || event.altKey || event.shiftKey)) {
        switch (event.key) {
          case "F1":
            event.preventDefault();
            btnUndoRef.current?.click();
            break;
          case "F2":
            event.preventDefault();
            btnRedoRef.current?.click();
            break;
          case "F3":
            event.preventDefault();
            btnSaveRef.current?.click();
            break;
          case "F8":
            event.preventDefault();
            btnEditFieldsRef.current?.click();
            break;
          case "F9":
            event.preventDefault();
            btnNewProjectRef.current?.click();
            break;
          case "F10":
            event.preventDefault();
            btnLoadProjectRef.current?.click();
            break;
        }
      }
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "s":
          case "S":
            event.preventDefault();
            btnSaveRef.current?.click();
            break;
          // Opcional: Atajos estándar de software (Ctrl+Z / Ctrl+Y)
          case "z":
          case "Z":
            event.preventDefault();
            btnUndoRef.current?.click();
            break;
          case "y":
          case "Y":
            event.preventDefault();
            btnRedoRef.current?.click();
            break;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // undoEnabled = hasChanges
  const undoEnabled = undoCount > 0;
  const redoEnabled = redoCount > 0;

  return (
    <>
      <FloatButton.Group
        shape="square"
        placement="top"
        style={{ top: 12, width: "fit-content", height: "fit-content" }}
      >
        <FloatButton
          icon={<SaveIcon />}
          ref={btnSaveRef}
          onClick={() => console.log("save")}
          tooltip={<div>{t("dialogs.save")} (F3)</div>}
          {...{ disabled: !undoEnabled }}
        />
      </FloatButton.Group>

      <FloatButton.Group
        shape="circle"
        placement="right"
        style={{ top: 12, right: 100, width: "fit-content", height: "fit-content" }}
      >
        <FloatButton
          icon={<UndoIcon />}
          tooltip={<div>{t("menu.undo")} (F1)</div>}
          badge={{ count: undoCount }}
          onClick={executeUndo}
          ref={btnUndoRef}
          {...{ disabled: !undoEnabled }}
        />
        <FloatButton
          icon={<RedoIcon />}
          badge={{ count: redoCount }}
          tooltip={<div>{t("menu.redo")} (F2)</div>}
          onClick={executeRedo}
          ref={btnRedoRef}
          {...{ disabled: !redoEnabled }}
        />
      </FloatButton.Group>

      <Header style={headerStyle}>
        <Flex style={boxStyle}>
          <Flex flex={1} gap="medium" justify="flex-start" align="center">
            <Tooltip title={t("menu.newProject") + " (F10)"}>
              <Button
                icon={
                  <>
                    <FolderOpenIcon />
                    <AsteriskIcon />
                  </>
                }
                shape="round"
                style={buttonStyle}
                disabled={undoEnabled}
                type="dashed"
                onClick={() => console.log("new project")}
                ref={btnNewProjectRef}
              />
            </Tooltip>
            <Tooltip title={t("menu.openProject") + " (F9)"}>
              <Button
                icon={
                  <>
                    <FolderOpenIcon />
                    <FileArchiveIcon />
                  </>
                }
                shape="round"
                style={buttonStyle}
                disabled={undoEnabled}
                type="dashed"
                onClick={() => console.log("load project")}
                ref={btnLoadProjectRef}
              />
            </Tooltip>
            <Tooltip title={t("menu.editFields") + " (F8)"}>
              <Button
                icon={<TableConfigIcon />}
                shape="round"
                style={buttonStyle}
                type="dashed"
                onClick={() => console.log("edit fields")}
                ref={btnEditFieldsRef}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Header>
    </>
  );
};

export default Navbar;
