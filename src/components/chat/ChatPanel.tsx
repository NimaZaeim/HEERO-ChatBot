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

  // Prevent ALL scroll events from propagating to parent page
  useEffect(() => {
    const messagesEl = messagesWrapperRef.current;
    if (!messagesEl) return;

    let touchStartY = 0;
    let isScrolling = false;

    // Stop all wheel events from propagating to parent
    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      
      // If we're at boundaries and trying to scroll beyond, prevent it
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } else {
        // Even when scrolling normally, stop propagation to prevent parent page scroll
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = messagesEl;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY;
      
      // If we're at boundaries and trying to scroll beyond, prevent it
      if ((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      } else {
        // Even when scrolling normally, stop propagation to prevent parent page scroll
        isScrolling = true;
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    // Use capture phase to catch events before they bubble
    messagesEl.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    messagesEl.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    messagesEl.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    messagesEl.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });

    return () => {
      messagesEl.removeEventListener('wheel', handleWheel, { capture: true } as any);
      messagesEl.removeEventListener('touchstart', handleTouchStart, { capture: true } as any);
      messagesEl.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
      messagesEl.removeEventListener('touchend', handleTouchEnd, { capture: true } as any);
    };
  }, []);

  // Prevent scroll events on the entire panel from propagating
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panelEl = panelRef.current;
    if (!panelEl) return;

    // Catch any scroll events that escape the messages container
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

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
