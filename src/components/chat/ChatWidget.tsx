import React, { useState, Suspense, lazy } from "react";

const ChatPanel = lazy(() => import("./ChatPanel"));

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Floating bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Open chat"
          onClick={() => setOpen((v) => !v)}
          className="w-14 h-14 rounded-full bg-[color:var(--primary-blue)] hover:bg-[color:var(--primary-hover)] text-white shadow-lg flex items-center justify-center text-2xl transition-transform transform-gpu hover:scale-105"
        >
          💬
        </button>
      </div>

      {/* Panel (lazy-loaded) */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50">
          <Suspense fallback={<div className="w-[360px] h-[480px] bg-white rounded-2xl shadow-lg flex items-center justify-center">Loading…</div>}>
            <div className="animate-scale-up origin-bottom-right">
              <ChatPanel onClose={() => setOpen(false)} />
            </div>
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
