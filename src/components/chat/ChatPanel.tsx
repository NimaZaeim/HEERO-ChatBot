import React, { useRef, useEffect } from "react";
import { useChatState } from "@/hooks/useChatState";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";

type ChatPanelProps = {
  variant?: string;
  apiUrl?: string;
  onClose?: () => void;
};

const ChatPanel = ({ variant = "emobility", apiUrl, onClose }: ChatPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesWrapperRef = useRef<HTMLDivElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);

  const {
    messages,
    isTyping,
    files,
    pills,
    inputValue,
    setInputValue,
    sendMessage,
    handleFilesAdded,
    handleFileRemove,
    clearFiles,
    resetChat,
  } = useChatState({ variant, apiUrl });

  // Keep fixed small bottom padding to reserve space for the input/pills
  useEffect(() => {
    const messagesEl = messagesWrapperRef.current;
    if (!messagesEl) return;
    messagesEl.style.paddingBottom = `12px`;
  }, []);

  return (
  <div className="w-[360px] max-w-full max-h-[600px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
      {/* Header (compact) */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <img src="/heero-logo.svg" alt="logo" className="w-8 h-8 object-contain rounded-full" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Ihr HEERO Assistant</div>
            <div className="text-xs text-gray-500">Schnelle Antworten zu HEERO</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Minimize chat"
            className="text-sm text-black hover:text-gray-700"
            onClick={() => onClose?.()}
          >
            &#x2013; {/* en dash as a minimize glyph */}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesWrapperRef} className="flex-1 overflow-y-auto p-0">
        <ChatContainer messages={messages} isTyping={isTyping} files={files} pills={pills} onPillClick={setInputValue} />
      </div>

      {/* Input area */}
  <div ref={inputWrapperRef} className="p-2 border-t mt-1">

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSendMessage={(message) => {
            sendMessage(message, files);
            clearFiles();
          }}
          onFileButtonClick={() => fileInputRef.current?.click()}
          hasFiles={files.length > 0}
          disabled={isTyping}
          fileBubbles={
            files.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/80 px-2 py-1 rounded shadow-sm border">
                    <span className="text-xs text-[color:var(--neutral-dark)]">{f.name}</span>
                    <button
                      onClick={() => handleFileRemove(i)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                      aria-label={`Remove ${f.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null
          }
        />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFilesAdded(Array.from(e.target.files));
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
