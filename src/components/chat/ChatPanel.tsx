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

  // Prevent scroll events from propagating to parent page while allowing internal scrolling
  useEffect(() => {
    const messagesEl = messagesWrapperRef.current;
    if (!messagesEl) return;

    let touchStartY = 0;

    // Handle wheel events - use capture phase to stop propagation early, but allow normal scrolling
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      // If we're at boundaries and trying to scroll beyond, prevent default
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } else {
        // For normal scrolling, don't prevent default (allow internal scroll)
        // But stop propagation to prevent background scrolling
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;
      
      // If we're at boundaries and trying to scroll beyond, prevent default
      if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } else {
        // For normal scrolling, don't prevent default (allow internal scroll)
        // But stop propagation to prevent background scrolling
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    // Use capture phase to catch events early and prevent them from reaching document/body
    messagesEl.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    messagesEl.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    messagesEl.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

    return () => {
      messagesEl.removeEventListener('wheel', handleWheel, { capture: true } as any);
      messagesEl.removeEventListener('touchstart', handleTouchStart, { capture: true } as any);
      messagesEl.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
    };
  }, []);

  // Panel ref for styling and additional scroll prevention
  const panelRef = useRef<HTMLDivElement>(null);

  // Add panel-level event handlers to catch any events that escape
  useEffect(() => {
    const panelEl = panelRef.current;
    if (!panelEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Only stop propagation, don't prevent default to allow internal scrolling
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Only stop propagation, don't prevent default to allow internal scrolling
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    // Use capture phase to catch events before they bubble to document
    panelEl.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    panelEl.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

    return () => {
      panelEl.removeEventListener('wheel', handleWheel, { capture: true } as any);
      panelEl.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
    };
  }, []);

  return (
  <div 
    ref={panelRef}
    className="w-[360px] max-w-full max-h-[600px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    style={{ 
      overscrollBehavior: 'contain',
      touchAction: 'pan-y',
      isolation: 'isolate'
    }}
  >
      {/* Header (compact) */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <img src="/heero-logo.svg" alt="logo" className="w-8 h-8 object-contain rounded-full" />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Ihr HEERO Assistant</div>
            <div className="text-xs text-[color:var(--neutral-grey)]">Schnelle Antworten zu HEERO</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Minimize chat"
            className="text-sm text-[color:var(--neutral-dark)] hover:text-[color:var(--neutral-grey)]"
            onClick={() => onClose?.()}
          >
            &#x2013; {/* en dash as a minimize glyph */}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesWrapperRef} 
        className="flex-1 overflow-y-auto p-0"
        style={{ 
          overscrollBehavior: 'contain',
          overscrollBehaviorY: 'contain',
          overscrollBehaviorX: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
          isolation: 'isolate'
        }}
      >
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
                      className="text-xs text-[color:var(--neutral-grey)] hover:text-[color:var(--neutral-dark)]"
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
