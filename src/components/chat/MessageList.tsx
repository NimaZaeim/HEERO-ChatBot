// This component renders a list of messages in the chat interface.
// It handles both user and AI messages, displays files, and includes CTAs for specific actions.

import { useRef, useEffect } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import ChatBubble from "./ChatBubble";
import FileBubble from "./FileBubble";
import SourcesDropdown from "./SourcesDropdown";
import TypingIndicator from "./TypingIndicator";
import { CTA_CONFIG } from "@/lib/ctaConfig";

// Represents a single message in the chat
export type Message = {
  id: string;
  content: string; // Text content of the message (user)
  isUser: boolean; // Indicates if the message is from the user (true) or the AI (false)
  files?: MessageFile[]; // Optional array of files attached to the message
  html?: string; // Optional HTML content for the message (AI)
  sources?: { title: string; url: string }[]; // Optional sources for the message, each with a title and URL
  ctaType?:
    | "probefahrt"
    | "beratung"
    | "angebot"
    | "produkte"
    | "ebusse"
    | "etransporter"
    | "foerderung"; // Optional CTA type for specific message actions
};

// Represents a file attached to a message
export type MessageFile = {
  name: string;
  url?: string;
};

type MessageListProps = {
  messages: Message[]; // Array of messages to display in the chat
  isTyping: boolean; // Indicates if the AI is currently typing a response
  pills?: string[];
  onPillClick?: (pill: string) => void;
};

const MessageList = ({ messages, isTyping, pills = [], onPillClick }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the message list whenever messages change or when typing status updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Helper function to render HTML content safely
  // This function uses dangerouslySetInnerHTML to render HTML content in a React component.
  const renderHTML = (html: string) => (
    <div className="chat-content" dangerouslySetInnerHTML={{ __html: html }} />
  );

  // Function to render each message in the list
  // It checks if the message is from the user or AI, and formats it accordingly.
  const renderMessage = (message: Message, index: number) => {
    const isLast = index === messages.length - 1;

    return (
      <div
        key={message.id}
        className={`${
          message.isUser ? "items-end" : "items-start"
        } flex flex-col w-full mb-4 md:mb-3 message-enter`}
      >
        {message.files?.length > 0 && ( // If the message has files, render them in a bubble
          <div
            className={`mt-1 flex flex-wrap gap-2 ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {message.files.map((file, i) => (
              <FileBubble
                key={i}
                fileName={file.name}
                isUserMessage={message.isUser}
              />
            ))}
          </div>
        )}

        {(message.content?.trim() || // If the message has content or HTML, render it in a chat bubble
          message.html?.trim() ||
          message.ctaType) && (
          <ChatBubble isUser={message.isUser}>
            {message.html ? renderHTML(message.html) : message.content}

            {message.ctaType &&
              CTA_CONFIG[message.ctaType] && ( // If the message has a CTA type, render the corresponding button
                <div className="mt-3">
                  <Button asChild variant="default" size="default">
                    <a
                      href={CTA_CONFIG[message.ctaType].url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CTA_CONFIG[message.ctaType].label}
                      <IconArrowUpRight size={14} stroke={2} />
                    </a>
                  </Button>
                </div>
              )}

            {message.sources?.length > 0 && ( // If the message has sources, render the SourcesDropdown component
              <SourcesDropdown
                sources={message.sources}
                parentRef={messagesEndRef}
                isLastMessage={isLast}
              />
            )}
          </ChatBubble>
        )}
      </div>
    );
  };

  const containerClasses = "flex flex-col flex-1 pt-8 pb-8 pl-4 pr-2 w-full";

  return (
    <div className={containerClasses}>
      <div className="text-sm md:text-base w-full">
        {messages.map(renderMessage)}

        {isTyping && <TypingIndicator />}

        {/* Pills: when chat has messages, show under the last message; when empty show at top */}
        {pills && pills.length > 0 && (
          <div className={`mt-2 ${messages.length === 0 ? 'mb-4' : 'mb-2'}`}>
            <div className="w-full">
              <div className="flex flex-wrap gap-2 items-center overflow-visible px-1 pb-3">
                {pills.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPillClick?.(pill)}
                    className="text-xs px-2 py-1 rounded-full bg-[color:var(--secondary-lightblue)] shadow-sm text-[color:var(--neutral-dark)] hover:bg-[color:var(--secondary-accent)] whitespace-nowrap border-none"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
