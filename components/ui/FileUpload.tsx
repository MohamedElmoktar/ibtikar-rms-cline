import { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  PaperClipIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface FileUploadProps {
  onFilesChange: (files: any[]) => void;
  uploadedFiles: any[];
  onRemoveFile: (index: number) => void;
  isUploading: boolean;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  multiple?: boolean;
}

const FileUpload = ({
  onFilesChange,
  uploadedFiles,
  onRemoveFile,
  isUploading,
  maxFileSize = 10,
  acceptedTypes = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".gif"],
  multiple = true,
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = async (files: File[]) => {
    // Filter files by size and type
    const validFiles = files.filter((file) => {
      const isValidSize = file.size <= maxFileSize * 1024 * 1024;
      const isValidType = acceptedTypes.some((type) =>
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );

      if (!isValidSize) {
        alert(
          `File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`
        );
        return false;
      }

      if (!isValidType) {
        alert(`File ${file.name} has an unsupported format.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    // Upload files
    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onFilesChange(result.files);
      } else {
        console.error("Upload failed");
        alert("Failed to upload files. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files. Please try again.");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-2">
              Glissez-déposez vos fichiers ici
            </p>
            <p className="text-sm text-gray-600 mb-4">
              ou{" "}
              <span className="text-blue-600 hover:text-blue-500 font-medium">
                cliquez pour parcourir
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.join(", ")} jusqu'à {maxFileSize}MB chacun
            </p>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(",")}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Upload Progress */}
      {isUploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Upload en cours...</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            Fichiers uploadés ({uploadedFiles.length})
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <PaperClipIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.mimetype}
                      {file.uploadDate &&
                        ` • ${new Date(file.uploadDate).toLocaleDateString(
                          "fr-FR"
                        )}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(file.filePath, "_blank");
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Voir le fichier"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(index);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer le fichier"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
