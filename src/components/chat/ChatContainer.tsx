// This component represents the main chat container in a chat interface.
// It displays a list of messages and handles typing indicators and file attachments.

import MessageList, { Message } from "./MessageList";

type ChatContainerProps = {
  messages: Message[];
  isTyping: boolean;
  files?: File[];
  pills?: string[];
  onPillClick?: (pill: string) => void;
};

const ChatContainer = ({ messages, isTyping, files, pills = [], onPillClick }: ChatContainerProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <MessageList messages={messages} isTyping={isTyping} pills={pills} onPillClick={onPillClick} />
      </div>
    </div>
  );
};

export default ChatContainer;
