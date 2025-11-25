import React, { useState, Suspense, lazy, useEffect } from "react";
import { useIsMobileOrTablet } from "../../hooks/use-mobile";

const ChatPanel = lazy(() => import("./ChatPanel"));

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const isMobileOrTablet = useIsMobileOrTablet();
  const [parentViewportWidth, setParentViewportWidth] = useState<number | null>(null);
  const AVATAR_SIZE_PX = 60; // matches w-[60px] h-[60px]
  const GAP_PX = 12; // matches mr-3
  const SLIDE_PX = AVATAR_SIZE_PX - 8; // slide under the icon without overshooting

  // Slide dialog in on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setDialogVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // When embedded, prefer using the parent page viewport width to decide mobile vs desktop
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      try {
        const data = event.data as any;
        if (data && data.type === 'embed-parent-viewport' && typeof data.width === 'number') {
          setParentViewportWidth(data.width);
        }
      } catch (_) {}
    };
    window.addEventListener('message', onMessage);
    // Ask parent for current viewport width (parent script may respond)
    try {
      window.parent.postMessage({ type: 'heero-viewport-request' }, '*');
    } catch (_) {}
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Helpers: open/close/toggle with postMessage to parent (for iframe embed)
  const postParent = (msg: any) => {
    try {
      // send both a simple message (requested) and the structured one used by parent listener
      window.parent.postMessage(msg, '*');
    } catch (e) {}
  };

  // Lock body scroll when chatbot is open (prevents Safari background scroll)
  useEffect(() => {
    if (open) {
      // Store original overflow values
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      
      // Get current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

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

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  return (
    <div>
      {/* Panel (lazy-loaded) - when open, render in the same bottom-right area so it replaces the floating icon */}
      {open && (
        <div 
          className="fixed bottom-6 right-6 z-50"
          style={{ 
            overscrollBehavior: 'contain'
          }}
        >
          <Suspense fallback={<div className="w-[360px] h-[480px] bg-white rounded-2xl shadow-lg flex items-center justify-center">Loading…</div>}>
            <div className="animate-scale-up origin-bottom-right">
              <ChatPanel onClose={() => closeChat()} />
            </div>
          </Suspense>
        </div>
      )}

      {/* New Dialog with Floating Icon */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Container for both elements */}
          <div className="relative flex items-center min-h-[56px]">
            {/* Floating Icon - slightly larger than pill, white ring */}
            <button
              onClick={toggleChat}
              aria-label="Open chat"
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] flex-shrink-0 rounded-full ring-4 ring-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] bg-white flex items-center justify-center transition-transform transform-gpu z-10 ${
                !isMobileOrTablet ? 'hover:scale-95 focus:scale-95' : 'focus:scale-95'
              }`}
            >
              <img 
                src="/WidgetImage.jpg" 
                alt="HEERO Assistant" 
                className="w-full h-full object-cover rounded-full overflow-hidden" 
              />
              {/* Presence dot - floats slightly outside the avatar with pulse glow */}
              <span className="pointer-events-none absolute w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-white shadow-sm" style={{ bottom: '-2px', right: '-2px' }}>
                <span className="presence-glow absolute inset-0 rounded-full border border-[#22c55e]" />
              </span>
            </button>

            {/* Dialog Pill - desktop/tablet only (decided based on parent viewport if available) */}
            {!(parentViewportWidth !== null ? parentViewportWidth < 810 : isMobileOrTablet) && (
              <div 
                className={`relative flex items-center bg-white rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.25)] border border-[rgba(0,0,0,0.06)] pl-2 pr-16 py-2.5 mr-1 transition-[transform,opacity] duration-500 ease-out`}
                style={{ transform: dialogVisible ? 'translateX(0px)' : `translateX(${SLIDE_PX}px)`, opacity: dialogVisible ? 1 : 0 }}
              >
                {/* Close bubble inside the pill next to the text */}
                <button
                  onClick={handleCloseDialog}
                  aria-label="Close dialog"
                  className="w-8 h-8 mr-3 rounded-full bg-white border border-[rgba(0,0,0,0.12)] shadow-[0_8px_20px_rgba(0,0,0,0.18)] flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Text */}
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-semibold text-[15px] text-gray-900 whitespace-nowrap">
                  Schnelle Antworten zu HEERO
                  </span>
                  <span className="text-[13px] text-[#6b7280] whitespace-nowrap">
                  Ihr HEERO Assistant
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
