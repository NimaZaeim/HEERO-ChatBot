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
          <img src="/heero-favicon.png" alt="logo" className="w-8 h-8 object-contain" />
          <div className="text-sm font-semibold">Heero Chat</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Close chat"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => onClose?.()}
          >
            ✕
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
          fileBubbles={null}
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
