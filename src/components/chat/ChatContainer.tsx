// This component represents the main chat container in a chat interface.
// It displays a list of messages and handles typing indicators and file attachments.

import MessageList, { Message } from "./MessageList";

type ChatContainerProps = {
  messages: Message[];
  isTyping: boolean;
  files?: File[];
};

const ChatContainer = ({ messages, isTyping, files }: ChatContainerProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isTyping={isTyping} />
      </div>
    </div>
  );
};

export default ChatContainer;
