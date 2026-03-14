"use client";

import React from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Shield,
  Zap,
  Info,
  ChevronRight,
  MessageSquare,
  Terminal,
  AlertCircle,
  CheckCircle2,
  BrainCircuit,
  Cpu,
  ShieldAlert,
} from "lucide-react";
import { CyberCard } from "./UI";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export const AICopilot = () => {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I am your OTShield AI Security Copilot. I have analyzed your industrial network and identified 3 critical anomalies in the last hour. How can I assist you with your security posture today?",
      timestamp: "09:00 AM",
    },
    {
      id: 2,
      role: "user",
      content: "What are the critical anomalies you found?",
      timestamp: "09:02 AM",
    },
    {
      id: 3,
      role: "assistant",
      content:
        "I detected unauthorized Modbus write commands targeting PLC-01 (192.168.1.10) from an external IP. This matches a known reconnaissance pattern. I recommend isolating the segment immediately.",
      timestamp: "09:03 AM",
      suggestions: [
        "Isolate PLC-01",
        "Generate Incident Report",
        "View Network Forensics",
      ],
    },
  ]);

  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "I am processing your request. Based on current telemetry, I suggest reviewing the firewall logs for port 502.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-zinc-100">
              AI Copilot
            </h1>
            <div className="px-2 py-0.5 rounded-md bg-brand-primary/10 border border-brand-primary/20">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">
                v2.5 Beta
              </span>
            </div>
          </div>
          <p className="text-sm text-zinc-500 font-medium">
            Intelligent security assistant for industrial control systems.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
            <span className="text-xs font-bold text-zinc-400">
              AI Engine Online
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <CyberCard className="flex-1 flex flex-col p-0 overflow-hidden border-brand-border/30">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                      msg.role === "assistant"
                        ? "bg-brand-primary text-black shadow-brand-primary/20"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700",
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-zinc-900/80 border border-zinc-800 text-zinc-200"
                          : "bg-brand-primary/10 border border-brand-primary/20 text-zinc-100",
                      )}
                    >
                      {msg.content}
                    </div>

                    {msg.suggestions && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => setInput(s)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    <p
                      className={cn(
                        "text-[10px] font-mono text-zinc-600",
                        msg.role === "user" ? "text-right" : "",
                      )}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-brand-border/30 bg-white/[0.01]">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl blur-xl group-focus-within:bg-brand-primary/10 transition-all" />
              <div className="relative flex items-center gap-3 bg-brand-bg/80 border border-brand-border/50 rounded-2xl p-2 focus-within:border-brand-primary/40 transition-all">
                <div className="p-2 text-zinc-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask AI Copilot about network security..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-200 placeholder:text-zinc-600"
                />
                <button
                  onClick={handleSend}
                  className="p-2.5 bg-brand-primary text-black rounded-xl hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CyberCard>

        <div className="hidden lg:flex flex-col gap-6 w-80">
          <CyberCard className="p-6 border-brand-border/30">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
              Capabilities
            </h4>
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: "Threat Analysis",
                  desc: "Real-time anomaly detection.",
                },
                {
                  icon: Zap,
                  title: "Rapid Response",
                  desc: "Automated mitigation suggestions.",
                },
                {
                  icon: Terminal,
                  title: "Log Forensics",
                  desc: "Deep packet inspection analysis.",
                },
              ].map((cap, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <cap.icon className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200">
                      {cap.title}
                    </p>
                    <p className="text-[10px] text-zinc-500">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>

          <CyberCard className="p-6 border-brand-border/30 flex-1">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
              Quick Insights
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-brand-danger/5 border border-brand-danger/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-brand-danger" />
                  <span className="text-[10px] font-black text-brand-danger uppercase tracking-widest">
                    Critical Alert
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  Suspicious Modbus traffic detected on Segment B.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-success/5 border border-brand-success/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                  <span className="text-[10px] font-black text-brand-success uppercase tracking-widest">
                    System Health
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  All security sensors are reporting optimal performance.
                </p>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};
