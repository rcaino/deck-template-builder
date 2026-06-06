import React, { useState } from "react";
import { Upload, message } from "antd";
import type { UploadProps } from "antd";

interface SmartImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  placeholderUrl?: string;
}

export const SmartImageUpload: React.FC<SmartImageUploadProps> = ({
  value,
  onChange,
  placeholderUrl
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Simulación del evento preload (devuelve la URI local del archivo)
  // Simulación del evento preload usando FileReader (Genera data:image/...)
  const simulatePreload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setLoading(true);

      const reader = new FileReader();

      reader.onloadend = () => {
        setTimeout(() => {
          setLoading(false);
          resolve(reader.result as string);
        }, 1000); // Mantenemos el segundo de delay simulado
      };

      reader.onerror = () => {
        setLoading(false);
        reject(new Error("Error al leer el archivo"));
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadProps: UploadProps = {
    name: "file",
    showUploadList: false,
    accept: "image/*",
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;

      try {
        // Ejecutamos el preload para obtener la URI
        const responseUrl = await simulatePreload(file as File);

        // ¡Clave! Notificamos al Form de Ant Design el nuevo valor del input
        if (onChange) {
          onChange(responseUrl);
        }

        if (onSuccess) onSuccess("ok");
        message.success("Imagen cargada y procesada.");
      } catch (error) {
        if (onError) onError(error as Error);
        message.error("Error al procesar la imagen.");
      }
    }
  };

  const displayImage = value || placeholderUrl;

  return (
    <Upload {...uploadProps}>
      <div
        style={{
          cursor: "pointer",
          position: "relative",
          display: "inline-block",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px dashed #d9d9d9",
          height: "80px",
          minHeight: "80px",
          objectFit: "cover",
          opacity: loading ? 0.5 : 1,
          transition: "opacity 0.3s",
          textAlign: "center",
          alignContent: "center",
          verticalAlign: "center"
        }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt="Upload preview"
            style={{
              width: "100%",
              maxWidth: "300px",
              height: "80px",
              minHeight: "80px",
              objectFit: "cover",
              opacity: loading ? 0.5 : 1,
              transition: "opacity 0.3s",
              textAlign: "center",
              alignContent: "center",
              verticalAlign: "center"
            }}
          />
        ) : (
          "Upload preview"
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold"
            }}
          >
            Procesando...
          </div>
        )}
      </div>
    </Upload>
  );
};
