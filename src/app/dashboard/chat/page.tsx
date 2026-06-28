"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Cahiliyyə dövründə qadınların vəziyyəti necə idi?",
  "Muallaqat nədir?",
  "Hilf al-Fudul haqqında məlumat ver",
  "Kəbənin cahiliyyə dövründəki rolu nə idi?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text?: string) {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages.slice(-8) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Xəta baş verdi." }]); }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-screen py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-[#C8A96E] text-sm">← Ana Səhifə</Link>
        <h1 className="text-xl font-bold text-[#C8A96E]">AI Müəllim</h1>
        <span className="text-[#5C4A2A] text-xs">Gemini</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="card border-[#1B3A6B]/50 bg-[#1B3A6B]/10">
              <p className="text-[#F5EDD8]/90 text-sm">Salam! Mən Cahiliyyə dövrü üzrə AI müəlliməm. İslamdan əvvəlki Ərəbistan tarixi haqqında hər şeyi soruşa bilərsiniz.</p>
            </div>
            <p className="text-[#5C4A2A] text-xs uppercase tracking-wider">Tövsiyə olunan suallar</p>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                className="w-full text-left p-3 rounded-lg border border-[#C8A96E]/15 hover:border-[#C8A96E]/40 text-sm text-[#F5EDD8]/80 hover:text-[#F5EDD8] transition-all">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${m.role === "user" ? "bg-[#C8A96E]/20 text-[#C8A96E]" : "bg-[#1B3A6B]/30 text-blue-400"}`}>
              {m.role === "user" ? "S" : "AI"}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === "user" ? "bg-[#C8A96E]/15 text-[#F5EDD8]" : "bg-[#2D1F0A] border border-[#C8A96E]/10 text-[#F5EDD8]/90"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1B3A6B]/30 text-blue-400 flex items-center justify-center text-sm">AI</div>
            <div className="bg-[#2D1F0A] border border-[#C8A96E]/10 rounded-2xl p-4">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-[#C8A96E]/50 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Sual yazın..." className="input-field flex-1" />
        <button onClick={() => send()} disabled={!input.trim() || loading} className="btn-primary px-4">→</button>
      </div>
    </div>
  );
}
