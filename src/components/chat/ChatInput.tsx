import React, { useRef, useEffect, useState } from "react";
import { Send, Paperclip, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFileButtonClick?: () => void;
  hasFiles?: boolean;
  fileBubbles?: React.ReactNode;
};

const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Fragen Sie uns zu eMobilität...",
  value = "",
  onChange,
  onFileButtonClick,
  hasFiles = false,
  fileBubbles,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [visible, setVisible] = useState(false);

  // Auto-resize the textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if ((value.trim() || hasFiles) && !disabled) {
        onSendMessage(value);
      }
    }
  };

  const handleSend = () => {
    if ((value.trim() || hasFiles) && !disabled) {
      onSendMessage(value);
    }
  };

  const canSend = (value.trim() || hasFiles) && !disabled;

  return (
    <div className="flex flex-col bg-[color:var(--transparent-10)] backdrop-blur-md rounded-xl px-3 py-3 gap-y-2 z-0">
      {/* FILE BUBBLES ABOVE TEXTAREA */}
      {fileBubbles && (
        <div className="mb-1 flex justify-start">{fileBubbles}</div>
      )}

      {/* Top: Textarea full width */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full resize-none bg-transparent focus:outline-none text-md placeholder-[color:var(--neutral-grey)] text-[color:var(--neutral-dark)] min-h-[48px] max-h-[150px]"
        rows={1}
      />

      {/* Bottom: Buttons row with justify-between */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <Button
            onClick={onFileButtonClick}
            size="default"
            variant="ghost"
            className="text-xs px-3 py-3 md:text-sm md:px-3 md:py-3 bg-[color:var(--transparent-10)] hover:bg-[color:var(--transparent-20)] rounded-lg h-10"
            type="button"
            aria-label="Dokumente hochladen"
          >
            <Paperclip
              size={18}
              className="text-[color:var(--neutral-dark)]"
            />
            <span className="text-[color:var(--neutral-dark)] text-sm">
              Dokumente hochladen
            </span>
          </Button>

          <div className="relative inline-block">
            <button
              onClick={() => setVisible((v) => !v)}
              className="rounded-full border-none flex items-center justify-center"
              aria-label="Datenschutzhinweis"
            >
              <Info size={16} className="text-[color:var(--neutral-dark)]" />
            </button>

            {visible && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-[color:var(--secondary-darkblue)] text-white text-xs px-3 py-2 rounded shadow-md max-w-[70vw] w-max">
                Ihre Dokumente und Daten werden DSGVO-konform behandelt.
              </div>
            )}
          </div>
        </div>

        {/* Right: Send */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          variant="default"
          className="rounded-xl bg-[color:var(--primary-blue)] hover:bg-[color:var(--primary-hover)] text-white disabled:opacity-50 h-10"
          aria-label="Nachricht senden"
        >
          <Send size={18} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
