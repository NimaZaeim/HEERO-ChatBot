// This component represents a file bubble in a chat interface.
// It displays the file name and an icon, with options to remove the file if provided.

import React from "react";
import { File, X } from "lucide-react";

type FileBubbleProps = {
  fileName: string;
  isUserMessage?: boolean;
  onRemove?: () => void;
  showInBubble?: boolean;
};

const FileBubble = ({
  fileName,
  isUserMessage = true,
  onRemove,
  showInBubble = false,
}: FileBubbleProps) => {
  const handleRemove = (e: React.MouseEvent) => { // Handle the removal of the file when the remove button is clicked
    e.preventDefault();
    onRemove?.();
  };

  const RemoveButton = () =>
    onRemove ? (
      <button
        onClick={handleRemove}
        className="ml-2 p-1 rounded-full flex-shrink-0"
      >
        <X size={showInBubble ? 12 : 14} />
      </button>
    ) : null;

  if (showInBubble) {
    return (
      <div className="flex items-center px-2 py-1 rounded mb-1 text-sm">
        <File size={14} className="mr-2 flex-shrink-0" />
        <span className="truncate">{fileName}</span>
        <RemoveButton />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center px-3 py-2 rounded-lg bg-[color:var(--neutral-grey)] ${
        isUserMessage ? "ml-auto" : "mr-auto"
      } mb-2`}
    >
      <File size={16} className="mr-2" />
      <span className="text-sm truncate max-w-[200px]">{fileName}</span>
      <RemoveButton />
    </div>
  );
};

export default FileBubble;
