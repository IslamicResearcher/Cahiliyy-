"use client";
import { useState } from "react";
import Link from "next/link";
import { QUESTIONS, CATEGORIES } from "@/lib/quiz-data";

type Stage = "setup" | "playing" | "result";

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [category, setCategory] = useState("all");
  const [questions, setQuestions] = useState<typeof QUESTIONS>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showExp, setShowExp] = useState(false);

  function startQuiz() {
    const pool = category === "all" ? QUESTIONS : QUESTIONS.filter(q => q.category === category);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setIdx(0); setScore(0); setSelected(null); setAnswered(false); setShowExp(false);
    setStage("playing");
  }

  function handleAnswer(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === questions[idx].correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (idx + 1 >= questions.length) { setStage("result"); return; }
    setIdx(i => i + 1); setSelected(null); setAnswered(false); setShowExp(false);
  }

  if (stage === "setup") return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <Link href="/" className="text-[#C8A96E] text-sm mb-6 block">← Ana Səhifə</Link>
      <h1 className="text-3xl font-bold text-[#C8A96E] mb-8">Bilik Testi</h1>
      <div className="card mb-6">
        <p className="text-[#5C4A2A] text-sm mb-3 uppercase tracking-wider">Kateqoriya</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${category === c.id ? "bg-[#C8A96E] text-[#1A1208]" : "border border-[#C8A96E]/20 text-[#F5EDD8] hover:border-[#C8A96E]/40"}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <button onClick={startQuiz} className="btn-primary w-full">Testi Başlat</button>
    </div>
  );

  if (stage === "result") return (
    <div className="max-w-md mx-auto py-12 px-6 text-center">
      <div className="card">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-[#C8A96E] mb-2">Nəticəniz</h2>
        <p className="text-6xl font-bold text-[#F5EDD8] mb-4">{score}/{questions.length}</p>
        <p className="text-[#5C4A2A] mb-6">{Math.round(score/questions.length*100)}%</p>
        <div className="flex gap-3">
          <button onClick={() => setStage("setup")} className="btn-ghost flex-1">Geri</button>
          <button onClick={startQuiz} className="btn-primary flex-1">Yenisi</button>
        </div>
      </div>
    </div>
  );

  const q = questions[idx];
  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="text-[#C8A96E] text-sm">← Çıxış</Link>
        <span className="text-[#5C4A2A] text-sm">{idx+1}/{questions.length} · {score} ✓</span>
      </div>
      <div className="w-full bg-[#2D1F0A] rounded-full h-1.5 mb-6">
        <div className="bg-[#C8A96E] h-1.5 rounded-full transition-all" style={{width:`${((idx+1)/questions.length)*100}%`}} />
      </div>
      <div className="card mb-4">
        <p className="text-lg font-semibold text-[#F5EDD8]">{q.q}</p>
      </div>
      <div className="space-y-3 mb-4">
        {q.options.map((opt, i) => {
          let cls = "border-[#C8A96E]/20 text-[#F5EDD8] hover:border-[#C8A96E]/40 cursor-pointer";
          if (answered) {
            if (i === q.correct) cls = "border-emerald-500 bg-emerald-900/30 text-emerald-300";
            else if (i === selected) cls = "border-red-500 bg-red-900/20 text-red-400";
            else cls = "border-[#C8A96E]/10 text-[#5C4A2A]";
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${cls}`}>
              <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                {["A","B","C","D"][i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`card border mb-4 ${selected === q.correct ? "border-emerald-500/30" : "border-red-500/30"}`}>
          <p className={`font-semibold mb-2 ${selected === q.correct ? "text-emerald-400" : "text-red-400"}`}>
            {selected === q.correct ? "✓ Düzgün!" : "✗ Yanlış"}
          </p>
          {showExp ? <p className="text-[#F5EDD8]/80 text-sm">{q.explanation}</p> :
            <button onClick={() => setShowExp(true)} className="text-[#C8A96E] text-sm">İzahat →</button>}
        </div>
      )}
      {answered && (
        <button onClick={handleNext} className="btn-primary w-full">
          {idx+1 >= questions.length ? "Bitir" : "Növbəti →"}
        </button>
      )}
    </div>
  );
}
