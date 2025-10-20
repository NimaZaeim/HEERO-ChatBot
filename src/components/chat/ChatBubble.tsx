// This component represents a chat bubble in a chat interface.
// It displays messages from either the user or the AI, with appropriate styling and avatars.

import React from "react";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  isUser: boolean;
  children: React.ReactNode;
};

const ChatBubble = ({ isUser, children }: ChatBubbleProps) => { // Determines if the message is from the user or AI
  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar only for AI */}
      {!isUser && (
        <div className="w-8 h-8 mt-1 rounded-full bg-[color:var(--primary-300)] flex items-center justify-center shrink-0 overflow-hidden p-1">
          <img
            src="/heero-logo.png"
            alt="HEERO"
            className="w-full h-full object-contain filter brightness-0 invert"
          />
        </div>
      )}

      <div
        className={cn(
          "rounded-xl p-3 mb-3",
          isUser
            ? "bg-[color:var(--solar-spirit)] text-[color:var(--radial)]"
            : "bg-[color:var(--white)] backdrop-blur-sm shadow-lg border border-[color:var(--white-300)] text-[color:var(--radial)] max-w-[90%] md:max-w-[80%]"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ChatBubble;
