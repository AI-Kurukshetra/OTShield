'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCcw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { sendChatMessage } from '@/src/lib/ai/chatApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hello! I'm OTShield AI Copilot. I can help you analyze industrial security events, assess device risks, or provide security recommendations for your OT environment. What would you like to know today?",
    timestamp: new Date(),
  },
];

const suggestions = [
  'Why is PLC-1 high risk?',
  'Explain recent alerts',
  'How can I secure a Modbus device?',
  'Summarize network activity',
];

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(initialMessages.length);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    messageCounterRef.current += 1;

    const userMessage: Message = {
      id: `msg-${messageCounterRef.current}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const history = [...messages, userMessage].map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const aiContent = await sendChatMessage(history);

    messageCounterRef.current += 1;

    const aiResponse: Message = {
      id: `msg-${messageCounterRef.current}`,
      role: 'assistant',
      content: aiContent ?? getMockResponse(text),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const getMockResponse = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('plc-1'))
      return 'PLC-1 is currently flagged as High Risk due to multiple unauthorized Modbus function calls detected in the last 24 hours. Additionally, it is running an outdated firmware version (v2.4.1) which is susceptible to CVE-2023-4567. I recommend isolating the device and applying the latest security patch.';
    if (q.includes('alert'))
      return "I've analyzed the 12 active alerts. The most critical is a 'Command Injection Attempt' on PLC-1. This appears to be a targeted probe using non-standard function codes. Other alerts are mostly related to protocol anomalies in Zone B.";
    if (q.includes('modbus'))
      return 'To secure Modbus devices: 1. Implement network segmentation (VLANs). 2. Use a deep packet inspection (DPI) firewall to filter function codes. 3. Monitor for unusual polling rates. 4. If possible, tunnel Modbus traffic through a secure VPN or use Modbus/TCP Security (TLS).';
    return "That's an interesting question about your industrial environment. Based on current telemetry, I can see that your network traffic is within normal parameters, but there are some minor protocol deviations in the manufacturing zone. Would you like me to run a deeper diagnostic on a specific zone?";
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.2)]">
            <Bot className="text-brand-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-primary">AI Copilot</h1>
            <p className="text-white/40 text-xs">Intelligent Industrial Security Assistant</p>
          </div>
        </div>
        <button
          onClick={() => setMessages(initialMessages)}
          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 cyber-card flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  'flex gap-4 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center border',
                    msg.role === 'assistant'
                      ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                      : 'bg-white/5 border-white/10 text-white/60',
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    'p-4 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'assistant'
                      ? 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none'
                      : 'bg-brand-primary/20 border border-brand-primary/20 text-white rounded-tr-none',
                  )}
                >
                  {msg.content}
                  <div className="mt-2 text-[10px] opacity-40">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 mr-auto"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-primary/40 hover:text-brand-primary transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask OTShield AI about device risks, alerts, or network threats..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-[10px] text-white/20 text-center mt-3 uppercase tracking-widest">
            AI can make mistakes. Verify critical security findings.
          </p>
        </div>
      </div>
    </div>
  );
}
