import React, { useState, Suspense, lazy } from "react";
import { useIsMobileOrTablet } from "../../hooks/use-mobile";

const ChatPanel = lazy(() => import("./ChatPanel"));

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const isMobileOrTablet = useIsMobileOrTablet();

  // Helpers: open/close/toggle with postMessage to parent (for iframe embed)
  const postParent = (msg: any) => {
    try {
      // send both a simple message (requested) and the structured one used by parent listener
      window.parent.postMessage(msg, '*');
    } catch (e) {}
  };

  const openChat = () => {
    setOpen(true);
    // requested simple message
    postParent({ type: 'chatbot-open' });
    // structured message the parent script expects
    postParent({ source: 'heero-chatbot', type: 'open' });
  };

  const closeChat = () => {
    setOpen(false);
    postParent({ type: 'chatbot-close' });
    postParent({ source: 'heero-chatbot', type: 'close' });
  };

  const toggleChat = () => {
    if (open) closeChat(); else openChat();
  };

  return (
    <div>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Avatar-only circle by default; expands to pill on hover/focus. When open, hide the avatar and show the panel in the same place. */}
  <div className="relative group" tabIndex={0}>
          {/* Avatar circle (default) */}
          {!open && (
              <button
              aria-label="Open chat"
              onClick={() => toggleChat()}
              className={`relative w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-[0_8px_30px_rgba(0,0,0,0.28)] bg-white flex items-center justify-center transition-transform transform-gpu ${!isMobileOrTablet ? 'group-hover:scale-95 focus:scale-95' : 'focus:scale-95'}`}
            >
              <img src="/heero-logo.svg" alt="avatar" className="w-full h-full object-cover" />
              {/* persistent green presence dot */}
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-white" />
            </button>
          )}

          {/* Expanding pill - hidden by default, slides in from the right on hover/focus - COMPLETELY HIDDEN on mobile/tablet */}
          {!open && !isMobileOrTablet && (
              <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 group-hover:pointer-events-auto group-focus-within:pointer-events-auto pointer-events-none transition-all duration-240 ease-out">
              <div onClick={() => openChat()} role="button" tabIndex={0} className="inline-flex items-center gap-4 bg-white text-[color:var(--neutral-dark)] px-4 py-2 rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.25)] border border-[rgba(0,0,0,0.06)] cursor-pointer whitespace-nowrap w-auto">
                {/* Text block only (no duplicated avatar) - single-line */}
                <div className="flex flex-col items-start text-left leading-tight">
                  <span className="font-semibold text-sm">Schnelle Antworten zu HEERO</span>
                  <span className="text-sm text-[#6b7280]">Ihr HEERO Assistant</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Panel (lazy-loaded) - when open, render in the same bottom-right area so it replaces the floating icon */}
          {open && (
        <div className="fixed bottom-6 right-6 z-50">
          <Suspense fallback={<div className="w-[360px] h-[480px] bg-white rounded-2xl shadow-lg flex items-center justify-center">Loading…</div>}>
            <div className="animate-scale-up origin-bottom-right">
              <ChatPanel onClose={() => closeChat()} />
            </div>
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
