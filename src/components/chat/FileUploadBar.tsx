// This component represents a file upload bar in a chat interface.
// It allows users to drag and drop files or select files from their device.

import React, { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import FileBubble from "./FileBubble";

type FileUploadBarProps = {
  files: File[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  uploadInputRef?: React.RefObject<HTMLInputElement>;
};

const ACCEPTED_FORMATS = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
};

const FileUploadBar = ({
  files,
  onFilesAdded,
  onFileRemove,
  uploadInputRef,
}: FileUploadBarProps) => {
  const fallbackRef = useRef<HTMLInputElement>(null);
  const inputRef = uploadInputRef || fallbackRef;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => onFilesAdded(acceptedFiles),
    [onFilesAdded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: ACCEPTED_FORMATS,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFilesAdded(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  return (
    <>
      {files.length > 0 && (
        <div className="mb-2" {...getRootProps()}>
          <input {...getInputProps()} ref={inputRef} />
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <FileBubble
                key={`${file.name}-${index}`}
                fileName={file.name}
                onRemove={() => onFileRemove(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Render the hidden file input */} 
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleInputChange}
        multiple
        accept={Object.values(ACCEPTED_FORMATS).flat().join(",")}
      />
    </>
  );
};

export default FileUploadBar;
