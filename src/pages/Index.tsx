// This is the main chat page component
// It initializes the chat state and renders the chat interface

import React from "react";
import ChatWidget from "@/components/chat/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ChatWidget />
    </div>
  );
};

export default Index;
