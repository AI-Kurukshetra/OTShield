'use client';

import React from 'react';
import { sendChatMessage } from '@/src/lib/ai/chatApi';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatContextValue = {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  resetConversation: () => void;
};

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hello! I'm OTShield AI Copilot. I can help you analyze industrial security events, assess device risks, or provide security recommendations for your OT environment. What would you like to know today?",
    timestamp: new Date(),
  },
];

const ChatContext = React.createContext<ChatContextValue | null>(null);

function getMockResponse(query: string) {
  const q = query.toLowerCase();

  if (q.includes('plc-1')) {
    return 'PLC-1 is currently flagged as High Risk due to multiple unauthorized Modbus function calls detected in the last 24 hours. Additionally, it is running an outdated firmware version (v2.4.1) which is susceptible to CVE-2023-4567. I recommend isolating the device and applying the latest security patch.';
  }

  if (q.includes('alert')) {
    return "I've analyzed the 12 active alerts. The most critical is a 'Command Injection Attempt' on PLC-1. This appears to be a targeted probe using non-standard function codes. Other alerts are mostly related to protocol anomalies in Zone B.";
  }

  if (q.includes('modbus')) {
    return 'To secure Modbus devices: 1. Implement network segmentation (VLANs). 2. Use a deep packet inspection (DPI) firewall to filter function codes. 3. Monitor for unusual polling rates. 4. If possible, tunnel Modbus traffic through a secure VPN or use Modbus/TCP Security (TLS).';
  }

  return "That's an interesting question about your industrial environment. Based on current telemetry, I can see that your network traffic is within normal parameters, but there are some minor protocol deviations in the manufacturing zone. Would you like me to run a deeper diagnostic on a specific zone?";
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesRef = React.useRef(initialMessages);
  const isTypingRef = React.useRef(false);
  const messageCounterRef = React.useRef(initialMessages.length);

  const resetConversation = React.useCallback(() => {
    messagesRef.current = initialMessages;
    messageCounterRef.current = initialMessages.length;
    isTypingRef.current = false;
    setMessages(initialMessages);
    setIsTyping(false);
  }, []);

  const sendMessage = React.useCallback(async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isTypingRef.current) {
      return;
    }

    messageCounterRef.current += 1;
    const userMessage: ChatMessage = {
      id: `msg-${messageCounterRef.current}`,
      role: 'user',
      content: trimmedText,
      timestamp: new Date(),
    };

    const nextMessages = [...messagesRef.current, userMessage];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    isTypingRef.current = true;
    setIsTyping(true);

    const history = nextMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const aiContent = await sendChatMessage(history);

    messageCounterRef.current += 1;
    const aiMessage: ChatMessage = {
      id: `msg-${messageCounterRef.current}`,
      role: 'assistant',
      content: aiContent ?? getMockResponse(trimmedText),
      timestamp: new Date(),
    };

    const updatedMessages = [...messagesRef.current, aiMessage];
    messagesRef.current = updatedMessages;
    setMessages(updatedMessages);
    isTypingRef.current = false;
    setIsTyping(false);
  }, []);

  const value = React.useMemo(
    () => ({
      messages,
      isTyping,
      sendMessage,
      resetConversation,
    }),
    [isTyping, messages, resetConversation, sendMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = React.useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}
