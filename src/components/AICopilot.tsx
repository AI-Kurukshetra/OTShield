'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, RefreshCcw } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from '@/src/components/providers/ChatProvider';

const suggestions = [
  'Why is PLC-1 high risk?',
  'Explain recent alerts',
  'How can I secure a Modbus device?',
  'Summarize network activity',
];

export function AICopilot() {
  const { messages, isTyping, sendMessage, resetConversation } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) {
      return;
    }

    setInput('');
    await sendMessage(text);
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
          onClick={resetConversation}
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
