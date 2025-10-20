// This custom hook is used to manage chat state, including messages, typing status, files, and pills.
// It handles sending messages to the API and saving/loading chat history from localStorage.

import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/components/chat/MessageList";
import { convertFileToBase64 } from "@/lib/files.ts";
import { loadSession, saveSession } from "@/lib/session.ts";

type ApiResponse = {
  chatResponse: string; // HTML response from the chat API
  pills?: string[]; // Optional pills to display in the chat
  sources?: { url: string; title: string }[]; // Optional sources for the message, each with a title and URL
  ctaType?:
    | "probefahrt"
    | "beratung"
    | "angebot"
    | "produkte"
    | "ebusse"
    | "etransporter"
    | "foerderung"; // Optional CTA type for specific message actions
};

type UseChatStateProps = {
  initialMessages?: Message[]; // Initial messages to load into the chat
  variant?: string; // Variant of the chat, e.g., "valuation"
  apiUrl?: string; // URL of the API endpoint to send messages to
};

const STORAGE_KEY = "heero-emobility-chat-session"; // Key for localStorage to save chat session

export function useChatState({
  initialMessages = [],
  variant = "emobility",
  apiUrl = import.meta.env.VITE_API_URL,
}: UseChatStateProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [pills, setPills] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Effect to prefill the input value from URL parameters
  // This allows the chat to be pre-populated with a message when the page is loaded
  // If users enter something on the HEERO landing page, they will be redirected to the chat with a prefilled message

  useEffect(() => {
    // One-time cleanup of old localStorage data
    const oldKey = "heero-chat-session";
    if (localStorage.getItem(oldKey)) {
      console.log("🧹 Cleaning up old localStorage data");
      localStorage.removeItem(oldKey);
    }

    const params = new URLSearchParams(window.location.search);
    const prefill = params.get("prefill");
    const sessionData = loadSession(STORAGE_KEY);

    if (prefill !== null && prefill !== "") {
      setInputValue(prefill);
    }

    if (sessionData) {
      if (Array.isArray(sessionData.messages)) {
        console.log("📝 Loading messages from localStorage:", sessionData.messages);
        setMessages(sessionData.messages);
      }
      if (Array.isArray(sessionData.pills)) {
        setPills(sessionData.pills);
      }
    } else {
      console.log("✅ No cached session data found - starting fresh");
    }
  }, []);

  // Function to send a message to the API
  // It handles both text content and file uploads, converting files to Base64
  const sendMessage = useCallback(
    async (content: string, uploadedFiles: File[] = []) => {
      if (!content.trim() && uploadedFiles.length === 0) return; // Do not send empty messages

      const userMessage: Message = {
        id: uuidv4(), // Generate a unique ID for the message
        content, // Text content of the message
        isUser: true, // Indicates this message is from the user
        files: uploadedFiles.map((file) => ({ name: file.name })), // Store only file names in the message
      };

      setMessages((prev) => [...prev, userMessage]); // Add user message to chat
      setInputValue(""); // Clear input field
      setPills([]); // Clear pills
      setIsTyping(true); // Set typing status to true

      // Guard: ensure apiUrl is configured correctly to avoid calls to `fetch(undefined)`
      if (!apiUrl || apiUrl === "undefined") {
        console.error("Chat API URL is not configured. VITE_API_URL is missing or invalid:", apiUrl);
        toast({
          title: "Configuration error",
          description:
            "Chat API URL not configured (VITE_API_URL). Please set your API URL and reload.",
          variant: "destructive",
        });
        setIsTyping(false);
        return;
      }

      // Convert uploaded files to Base64 format
      const messageFiles = await Promise.all(
        uploadedFiles.map((file) => convertFileToBase64(file))
      );

      const requestData = {
        message: content,
        files: await Promise.all(
          uploadedFiles.map((file) => convertFileToBase64(file))
        ),
        variant,
        // Variant is a chat context identifier, that can be used by n8n to trigger different flows per use case
        // It is identified as a query parameter, e.g. `https://api.example.com/chat?variant=valuation`
        // So when you link to https://api.example.com/chat?variant=makler, the variant will be "makler" and the n8n workflow will be triggered accordingly
      };

      console.log("🚀 Sending to API:", apiUrl);
      console.log("📤 Request Data:", requestData);
      console.log("🎯 Variant being sent:", variant);

      // Prepare the request data for the API
      try {
        // Abort any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const conversationId =
          localStorage.getItem("conversation-id") || crypto.randomUUID(); // Use existing conversation ID or generate a new one
        localStorage.setItem("conversation-id", conversationId); // Save conversation ID to localStorage

        console.log("🔑 Conversation ID:", conversationId);

        // Send the request to the API
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-conversation-id": conversationId, // Include conversation ID in headers
          },
          body: JSON.stringify(requestData),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          // LOG: bei Fehlern response body als Text lesen
          const errorText = await response.text();
          throw new Error("Request failed");
        }

        const data: ApiResponse = await response.json(); // Parse the JSON response

        console.log("🔍 API Response Data:", data);
        console.log("🔍 Chat Response Content:", data.chatResponse);

        // Response from n8n
        const botMessage: Message = {
          id: uuidv4(),
          content: "",
          html: data.chatResponse, // HTML content from the API response
          isUser: false,
          sources: data.sources || [], // Optional sources for the message
          ctaType: data.ctaType, // Optional CTA type for specific message actions
        };
        console.log("🤖 Bot message created:", botMessage);

        setMessages((prev) => [...prev, botMessage]); // Add bot message to chat
        setPills(data.pills || []); // Set pills from API response
        setFiles([]); // Clear files after sending message
      } catch (error) {
        // Ignore AbortError when request was intentionally cancelled
        if (error instanceof Error && error.name !== 'AbortError') {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsTyping(false);
      }
    },
    [variant, apiUrl]
  );

  // Function to handle files added by the user
  const handleFilesAdded = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Function to remove a file from the list
  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setFiles([]);
  };

  // Function to reset the entire chat state
  const resetChat = useCallback(() => {
    // Abort any running requests first
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Clear ALL localStorage keys (including old ones)
    localStorage.removeItem("conversation-id");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("heero-chat-session"); // Clear old key too
    
    console.log("🧹 Cleared all localStorage data");
    
    // Reset all state
    setMessages([]);
    setIsTyping(false);
    setFiles([]);
    setPills([]);
    setInputValue("");
  }, []);

  // Auto-save messages when they change
  useEffect(() => {
    if (messages.length > 0 || pills.length > 0) {
      saveSession(STORAGE_KEY, { messages, pills });
    }
  }, [messages, pills]);

  return {
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
  };
}
