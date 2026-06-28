"use client";

import { useState, useEffect } from "react";

// --- ORİJİNAL RƏNG PALİTRASI VƏ STİLLƏR ---
const THEMES = {
  dark: { 
    bg: "#0F1E2E", 
    bgAlt: "#162840", 
    card: "#1B3A5C", 
    text: "#F0EBE0", 
    textSub: "#8A9DB5", 
    border: "#2A4A6A", 
    navBg: "rgba(8,15,24,0.97)" 
  }
};

const C = {
  lapis: "#1B3A5C",
  lapisLight: "#2A5480",
  saffron: "#C9882A",
  saffronLight: "#E8A84A",
  ivory: "#F5F0E8",
  obsidian: "#0F2133", // Skrinşotdakı orijinal tünd göy fon rəngi
  ash: "#8A9DB5",
};

// --- DATA STRUKTURU ---
const QUIZ_QUESTIONS = [
  { q: "Cahiliyyə dövründə Kəbəyə asılan böyük şeirlər necə adlanırdı?", opts: ["Müəllaqat", "Mütənəbbi", "Müsnəd", "Müqəddimə"], ans: 0, exp: "Müəllaqat — 'asılmışlar' deməkdir." },
  { q: "'Əsəbiyyə' konsepsiyasını Müqəddimə əsərində nəzəri sistemə gətirən alim kimdir?", opts: ["İmam Ğəzzali", "İbn Xəldun", "İbn Sina", "İbn Rüşd"], ans: 1, exp: "İbn Xəldun əsəbiyyəni tayfa birliyi hissi kimi izah etmişdir." }
];

const LESSON = {
  id: "cahiliyye",
  arabicTitle: "الجاهلية",
  title: "Cahiliyyə",
  subtitle: "İslam öncəsi ərəb dünyasının hərtərəfli elmi-tarixi təhlili",
  coverTag: "Tarix · Sosiologiya · Mədəniyyət · Teologiya",
  intro: `Bu material Cahiliyyə dövrünü öz daxili qanunauyğunluqları, estetik zirvələri və sosioloji böhranları ilə araşdırır.`,
  sections: [
    { id: 1, romanNum: "I", icon: "🗺️", title: "Coğrafiya, Demoqrafiya və Geopolitik Müstəvi", text: `"Əl-Cazirə" — hərfən "ada" deməkdir — üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahilini boyunca uzanır; Nəcd platosu mərkəzdə küləklər altında əzəmətlə dayanır...` },
    { id: 2, romanNum: "II", icon: "⚖️", title: "Sosial Struktur, Tayfa Sistemi və Hüquq", text: "Cahiliyyə cəmiyyətinin əsas sütunu qan qohumluğuna əsaslanan tayfa sistemi və əsəbiyyə idi." }
  ]
};

export default function Page() {
  // İlk ekran skrinşotdakı kimi "hero" (giriş) olaraq təyin edilir!
  const [screen, setScreen] = useState("hero"); 
  const [activeTab, setActiveTab] = useState("home");
  const [geminiKey, setGeminiKey] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("cah_gemini_key") || "";
      setGeminiKey(savedKey);
    }
  }, []);

  const navigate = (targetScreen: string, tabId: string = "home") => {
    setScreen(targetScreen);
    setActiveTab(tabId);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.obsidian, color: "#FFFFFF", fontFamily: "'Segoe UI', Roboto, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflowX: "hidden" }}>
      
      {/* Geometrik Arxa Fon Teks-turu (Hexagon effekti üçün) */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(#FFF 1px, transparent 0), radial-gradient(#FFF 1px, transparent 0)", backgroundSize: "24px 24px", backgroundPosition: "0 0, 12px 12px", pointerEvents: "none", zIndex: 1 }}></div>

      <div style={{ width: "100%", maxWidth: 480, flex: 1, padding: "25px 20px 100px 20px", zIndex: 2, display: "flex", flexDirection: "column" }}>
        
        {/* ========================================================= */}
        {/* 1. İLK SƏHİFƏ — SKRİNŞOTDAKI ORİJİNAL GÖY HERO EKRANI      */}
        {/* ========================================================= */}
        {screen === "hero" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, justifyContent: "center", padding: "10px 0" }}>
            
            <button onClick={() => alert("Ana menyuya qayıdış")} style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFF", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", marginBottom: 35 }}>
              ← Geri
            </button>

            <span style={{ fontSize: 11, color: C.ash, letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 12 }}>
              DƏRS MATERİALI
            </span>
            
            <h1 style={{ fontSize: 56, color: C.saffron, fontFamily: "Georgia, serif", margin: "0 0 5px 0", fontWeight: "normal" }}>
              {LESSON.arabicTitle}
            </h1>
            
            <h2 style={{ fontSize: 34, fontWeight: "bold", letterSpacing: 0.5, margin: "0 0 15px 0", color: "#FFFFFF" }}>
              {LESSON.title}
            </h2>
            
            <p style={{ fontSize: 14, color: C.ash, lineHeight: 1.6, maxWidth: 320, margin: "0 0 25px 0" }}>
              {LESSON.subtitle}
            </p>

            <div style={{ border: `1px solid rgba(201, 136, 42, 0.25)`, borderRadius: 20, padding: "8px 22px", fontSize: 12, color: C.saffron, backgroundColor: "rgba(201, 136, 42, 0.04)", marginBottom: 40, fontWeight: "500" }}>
              {LESSON.coverTag}
            </div>

            {/* Böyük Statistika Bölməsi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", width: "100%", maxWidth: 340, gap: 15, marginBottom: 45 }}>
              <div style={{ textAlign: "center" }}>
                <b style={{ fontSize: 30, color: C.saffron, display: "block", fontFamily: "Georgia" }}>7</b>
                <span style={{ fontSize: 12, color: C.ash }}>Hissə</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <b style={{ fontSize: 30, color: C.saffron, display: "block", fontFamily: "Georgia" }}>30+</b>
                <span style={{ fontSize: 12, color: C.ash }}>Paraqraf</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <b style={{ fontSize: 30, color: C.saffron, display: "block", fontFamily: "Georgia" }}>17</b>
                <span style={{ fontSize: 12, color: C.ash }}>Mənbə</span>
              </div>
            </div>

            <button onClick={() => navigate("catalog", "lessons")} style={{ width: "100%", backgroundColor: C.saffron, color: C.obsidian, border: "none", padding: "16px", borderRadius: 14, fontSize: 15, fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 20px rgba(201, 136, 42, 0.25)", transition: "all 0.2s" }}>
              Oxumağa Başla ➔
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. MÜNDƏRİCAT (CATALOG) EKRANI                            */}
        {/* ========================================================= */}
        {screen === "catalog" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <h3 style={{ color: C.saffron, fontFamily: "Georgia", fontSize: 24, margin: "0 0 5px 0" }}>المحتويات</h3>
              <h2 style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>Mündəricat</h2>
            </div>
            
            {LESSON.sections.map((sec) => (
              <div key={sec.id} onClick={() => { setSelectedSection(sec); navigate("reading", "lessons"); }} style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 18, display: "flex", alignItems: "center", gap: 15, cursor: "pointer", transition: "transform 0.2s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(201, 136, 42, 0.12)", color: C.saffron, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14 }}>
                  {sec.romanNum}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 14, color: "#FFFFFF", fontWeight: "600", lineHeight: 1.4 }}>{sec.title}</h4>
                </div>
                <span style={{ color: C.saffron }}>➔</span>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MƏTN OXU REJİMİ (READING SCREEN)                      */}
        {/* ========================================================= */}
        {screen === "reading" && selectedSection && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <button onClick={() => navigate("catalog", "lessons")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: C.saffron, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 5 }}>
              ← Mündəricata qayıt
            </button>
            <div style={{ backgroundColor: "#FFFFFF", color: "#1E293B", padding: 25, borderRadius: 22, lineHeight: 1.8, fontSize: 15, textAlign: "justify", boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}>
              <h3 style={{ color: C.saffron, margin: "0 0 15px 0", fontSize: 18, fontWeight: "bold" }}>
                {selectedSection.romanNum}. {selectedSection.title}
              </h3>
              <p style={{ margin: 0, color: "#334155" }}>{selectedSection.text}</p>
            </div>
            <button onClick={() => navigate("ai_chat", "ai")} style={{ backgroundColor: C.saffron, color: C.obsidian, border: "none", padding: "14px", borderRadius: 12, fontWeight: "bold", cursor: "pointer", fontSize: 14 }}>
              🤖 Bu bölmə haqqında AI-a sual ver
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. AI SUAL-CAVAB PANELİ (AI CHAT)                         */}
        {/* ========================================================= */}
        {screen === "ai_chat" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 15, flex: 1 }}>
            <h3 style={{ color: C.saffron, margin: 0, fontSize: 20, fontWeight: "bold" }}>AI Araşdırma Rəhbəri</h3>
            <p style={{ fontSize: 12, color: C.ash, margin: "0 0 5px 0" }}>Cabiliyyə mövzusunda dərindən analiz və sual-cavab modulu.</p>
            
            <div style={{ flex: 1, minHeight: "35vh", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 16, padding: 15, border: "1px solid rgba(255,255,255,0.06)", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.length === 0 ? (
                <div style={{ textTransform: "none", color: C.ash, textAlign: "center", margin: "auto", fontSize: 13 }}>Hələ sual yazılmayıb. Mövzu ilə bağlı ilk sualınızı verin!</div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                    <div style={{ padding: "10px 14px", borderRadius: 12, backgroundColor: m.role === "user" ? C.saffron : "rgba(255,255,255,0.06)", color: m.role === "user" ? C.obsidian : "#FFF", fontSize: 14, lineHeight: 1.5 }}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Sualınızı bura yazın..." style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", color: "#FFF", fontSize: 14, outline: "none" }} />
              <button onClick={() => { if(!chatInput.trim())return; setMessages([...messages, { role: "user", text: chatInput }, { role: "ai", text: "Bu mövzu üzrə analiz hazırlanır..." }]); setChatInput(""); }} style={{ backgroundColor: C.saffron, color: C.obsidian, border: "none", padding: "0 20px", borderRadius: 12, cursor: "pointer", fontWeight: "bold", fontSize: 14 }}>
                Göndər
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. TEST / QUIZ EKRANI                                    */}
        {/* ========================================================= */}
        {screen === "quiz" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 style={{ color: C.saffron, margin: 0, fontSize: 20 }}>Bilik Qiymətləndirilməsi</h3>
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", padding: 20, borderRadius: 16 }}>
              <p style={{ fontSize: 13, color: C.saffron, margin: "0 0 10px 0" }}>Sual {currentQuiz + 1} / {QUIZ_QUESTIONS.length}</p>
              <h4 style={{ margin: "0 0 20px 0", fontSize: 16, lineHeight: 1.5 }}>{QUIZ_QUESTIONS[currentQuiz].q}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {QUIZ_QUESTIONS[currentQuiz].opts.map((opt, idx) => (
                  <button key={idx} onClick={() => {
                    if(idx === QUIZ_QUESTIONS[currentQuiz].ans) setQuizScore(quizScore + 1);
                    if(currentQuiz + 1 < QUIZ_QUESTIONS[currentQuiz].opts.length) {
                      setCurrentQuiz(currentQuiz + 1);
                    } else {
                      alert(`Test bitdi! Sizin nəticəniz: ${quizScore + (idx === QUIZ_QUESTIONS[currentQuiz].ans ? 1 : 0)} / ${QUIZ_QUESTIONS.length}`);
                      setCurrentQuiz(0);
                      setQuizScore(0);
                      navigate("hero");
                    }
                  }} style={{ width: "100%", textAlign: "left", padding: "12px 15px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", color: "#FFF", cursor: "pointer", fontSize: 14 }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* GLOBAL ALT NAVİQASİYA PANELİ (NAVBAR)                     */}
      {/* ========================================================= */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, backgroundColor: "#091522", display: "flex", justifyContent: "space-around", padding: "12px 0 15px 0", borderTop: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 -5px 25px rgba(0,0,0,0.4)" }}>
        <button onClick={() => navigate("hero", "home")} style={{ background: "none", border: "none", color: activeTab === "home" ? C.saffron : C.ash, cursor: "pointer", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 18 }}>🏠</span> Ana Səhifə
        </button>
        <button onClick={() => navigate("catalog", "lessons")} style={{ background: "none", border: "none", color: activeTab === "lessons" ? C.saffron : C.ash, cursor: "pointer", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 18 }}>📚</span> Dərslər
        </button>
        <button onClick={() => navigate("ai_chat", "ai")} style={{ background: "none", border: "none", color: activeTab === "ai" ? C.saffron : C.ash, cursor: "pointer", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 18 }}>🤖</span> AI Sual
        </button>
        <button onClick={() => navigate("quiz", "quiz_tab")} style={{ background: "none", border: "none", color: activeTab === "quiz_tab" ? C.saffron : C.ash, cursor: "pointer", fontSize: 11, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 18 }}>🎯</span> Quiz
        </button>
      </nav>

    </div>
  );
}