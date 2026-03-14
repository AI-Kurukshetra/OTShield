'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, MessageSquare, X, Maximize2 } from 'lucide-react';
import Link from 'next/link';
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
    content: "Hi! I'm OTShield AI. Ask about device risks, alerts, or network threats.",
    timestamp: new Date(),
  },
];

const suggestions = ['Why is PLC-1 high risk?', 'Explain recent alerts', 'How to secure Modbus?'];

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('plc-1'))
    return 'PLC-1 is High Risk due to unauthorized Modbus calls and outdated firmware (v2.4.1). I recommend isolating the device and applying the latest patch.';
  if (q.includes('alert'))
    return "I've analyzed the active alerts. The most critical is a 'Command Injection Attempt' on PLC-1. Other alerts are protocol anomalies in Zone B.";
  if (q.includes('modbus'))
    return 'To secure Modbus: 1) Network segmentation (VLANs). 2) DPI firewall for function codes. 3) Monitor polling rates. 4) Use Modbus/TCP Security (TLS) if possible.';
  return 'Based on current telemetry, traffic is within normal parameters with minor protocol deviations. Would you like a deeper diagnostic on a specific zone?';
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      {/* Floating button - always visible */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-primary/30 bg-brand-card/95 shadow-[0_0_24px_rgba(0,240,255,0.2)] backdrop-blur-xl transition-shadow hover:shadow-[0_0_32px_rgba(0,240,255,0.3)]"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label={isOpen ? 'Close chat' : 'Open AI Copilot'}
      >
        <MessageSquare className="h-6 w-6 text-brand-primary" />
      </motion.button>

      {/* Expandable panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-6 bottom-24 z-[45] flex h-[420px] w-[380px] flex-col overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-card/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-brand-border/50 bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-brand-primary/10 p-2 text-brand-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">AI Copilot</p>
                  <p className="text-[10px] text-zinc-500">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/copilot"
                  className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-brand-primary transition-colors"
                  title="Open full Copilot"
                >
                  <Maximize2 className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2 max-w-[92%]',
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
                  )}
                >
                  <div
                    className={cn(
                      'h-7 w-7 shrink-0 rounded-lg flex items-center justify-center border',
                      msg.role === 'assistant'
                        ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                        : 'bg-white/5 border-white/10 text-zinc-400',
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <Bot className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'rounded-xl px-3 py-2 text-xs leading-relaxed',
                      msg.role === 'assistant'
                        ? 'bg-white/5 border border-white/5 text-zinc-200 rounded-tl-none'
                        : 'bg-brand-primary/20 border border-brand-primary/20 text-zinc-100 rounded-tr-none',
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 mr-auto">
                  <div className="h-7 w-7 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-brand-primary" />
                  </div>
                  <div className="flex gap-1 rounded-xl rounded-tl-none bg-white/5 border border-white/5 px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary/60 animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-brand-border/50 bg-black/30 p-3">
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-primary/40 hover:text-brand-primary transition-all"
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
                  placeholder="Ask about alerts, devices..."
                  className="w-full rounded-xl border border-brand-border/50 bg-white/5 py-2.5 pl-3 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-brand-primary/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30 disabled:opacity-40 transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
