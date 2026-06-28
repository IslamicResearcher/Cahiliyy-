"use client";

import { useState, useEffect } from "react";

// --- ORİJİNAL RƏNG PALİTRASI VƏ GEOMETRİK ARXAFON ---
const STYLES = {
  mainBg: "#0F2133", // Tünd göy arxafon
  gold: "#E29A32",   // Orijinal qızılı rəng
  textMuted: "#8A9DB5",
  cardBg: "rgba(255, 255, 255, 0.03)",
  border: "rgba(226, 154, 50, 0.2)",
};

const SECTIONS_DATA = [
  { id: 1, label: "I", title: "Coğrafiya, Demoqrafiya və Geopolitik Müstəvi", text: `"Əl-Cazirə" — hərfən "ada" deməkdir — üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahilini boyunca uzanır; Nəcd platosu mərkəzdə küləklər altında əzəmətlə dayanır...` },
  { id: 2, label: "II", title: "Sosial Struktur, Tayfa Sistemi və Hüquq", text: "Cahiliyyə cəmiyyətinin əsas sütunu qan qohumluğuna əsaslanan tayfa sistemi idi." },
];

export default function Page() {
  const [view, setView] = useState("hero"); // hero, catalog, reading, qa
  const [geminiKey, setGeminiKey] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("cah_gemini_key");
      if (key) setGeminiKey(key);
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: STYLES.mainBg, color: "#FFFFFF", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflowX: "hidden" }}>
      
      {/* --- GEOMETRİK HEXAGON TEKS-TURU (CSS EMULATION) --- */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(#FFF 1px, transparent 0), radial-gradient(#FFF 1px, transparent 0)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px", zIndex: 1, pointerEvents: "none" }}></div>

      <div style={{ width: "100%", maxWidth: 450, flex: 1, padding: "30px 20px 100px 20px", zIndex: 2, display: "flex", flexDirection: "column" }}>
        
        {/* === 1. SKRİNŞOTDAKI ORİJİNAL HERO EKRANI === */}
        {view === "hero" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1, justifyContent: "center", padding: "20px 0" }}>
            
            <button onClick={() => alert("Ana menyuya qayıdış")} style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#FFF", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", marginBottom: 40 }}>
              ← Geri
            </button>

            <span style={{ fontSize: 11, color: STYLES.textMuted, letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 15 }}>DƏRS MATERİALI</span>
            
            <h1 style={{ fontSize: 52, color: STYLES.gold, fontFamily: "Georgia, serif", margin: "0 0 10px 0", fontWeight: "normal" }}>الجاهلية</h1>
            
            <h2 style={{ fontSize: 32, fontWeight: "bold", letterSpacing: 0.5, margin: "0 0 20px 0", color: "#FFFFFF" }}>Cahiliyyə</h2>
            
            <p style={{ fontSize: 14, color: STYLES.textMuted, lineHeight: 1.6, maxWidth: 320, margin: "0 0 25px 0" }}>
              İslam öncəsi ərəb dünyasının hərtərəfli elmi-tarixi təhlili
            </p>

            {/* Qızılı Haşiyəli Tag Paneli */}
            <div style={{ border: `1px solid ${STYLES.border}`, borderRadius: 20, padding: "8px 20px", fontSize: 12, color: STYLES.gold, backgroundColor: "rgba(226, 154, 50, 0.03)", marginBottom: 45 }}>
              Tarix · Sosiologiya · Mədəniyyət · Teologiya
            </div>

            {/* Böyük Statistika Bölməsi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", width: "100%", maxWidt: 340, gap: 20, marginBottom: 50 }}>
              <div>
                <b style={{ fontSize: 28, color: STYLES.gold, display: "block" }}>7</b>
                <span style={{ fontSize: 12, color: STYLES.textMuted }}>Hissə</span>
              </div>
              <div>
                <b style={{ fontSize: 28, color: STYLES.gold, display: "block" }}>30+</b>
                <span style={{ fontSize: 12, color: STYLES.textMuted }}>Paraqraf</span>
              </div>
              <div>
                <b style={{ fontSize: 28, color: STYLES.gold, display: "block" }}>17</b>
                <span style={{ fontSize: 12, color: STYLES.textMuted }}>Mənbə</span>
              </div>
            </div>

            {/* Əsas Hərəkət Düyməsi */}
            <button onClick={() => setView("catalog")} style={{ width: "100%", backgroundColor: STYLES.gold, color: "#0F2133", border: "none", padding: "16px", borderRadius: 14, fontSize: 15, fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 20px rgba(226, 154, 50, 0.2)" }}>
              Oxumağa Başla ➔
            </button>
          </div>
        )}

        {/* === 2. MÜNDƏRİCAT EKRANI === */}
        {view === "catalog" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <button onClick={() => setView("hero")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: STYLES.gold, cursor: "pointer", fontSize: 14 }}>← Geri</button>
            <h3 style={{ textAlign: "center", color: STYLES.gold, fontFamily: "Georgia", fontSize: 24, margin: "10px 0 0 0" }}>المحتويات</h3>
            <h2 style={{ textAlign: "center", margin: "0 0 20px 0", fontSize: 22 }}>Mündəricat</h2>
            
            {SECTIONS_DATA.map(sec => (
              <div key={sec.id} onClick={() => setView("reading")} style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 15, cursor: "pointer" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(226, 154, 50, 0.1)", color: STYLES.gold, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{sec.label}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 14, color: "#FFF" }}>{sec.title}</h4>
                </div>
                <span>➔</span>
              </div>
            ))}
          </div>
        )}

        {/* === 3. OXU REJİMİ === */}
        {view === "reading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <button onClick={() => setView("catalog")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: STYLES.gold, cursor: "pointer" }}>← Mündəricat</button>
            <div style={{ backgroundColor: "#FFFFFF", color: "#1E293B", padding: 25, borderRadius: 20, lineHeight: 1.8, fontSize: 15, textAlign: "justify" }}>
              <h3 style={{ color: STYLES.gold, margin: "0 0 15px 0" }}>I. Coğrafiya və Demoqrafiya</h3>
              "Əl-Cazirə" — hərfən "ada" deməkdir — üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahilini boyunca uzanır...
            </div>
            <button onClick={() => setView("qa")} style={{ backgroundColor: STYLES.gold, color: "#0F2133", border: "none", padding: 14, borderRadius: 12, fontWeight: "bold", cursor: "pointer" }}>Sual-Cavab Moduluna Keç</button>
          </div>
        )}

        {/* === 4. AI SUAL-CAVAB === */}
        {view === "qa" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <h3 style={{ color: STYLES.gold, margin: 0 }}>AI Sual-Cavab</h3>
            <div style={{ flex: 1, minHeight: "30vh", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 15, border: "1px solid rgba(255,255,255,0.05)" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ marginBottom: 10, textAlign: m.role === "user" ? "right" : "left" }}>
                  <p style={{ display: "inline-block", padding: 10, borderRadius: 8, backgroundColor: m.role === "user" ? STYLES.gold : "rgba(255,255,255,0.1)", color: m.role === "user" ? "#000" : "#FFF" }}>{m.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Sualınızı yazın..." style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "none", color: "#FFF" }} />
              <button onClick={() => { setMessages([...messages, { role: "user", text: chatInput }]); setChatInput(""); }} style={{ backgroundColor: STYLES.gold, border: "none", padding: "0 20px", borderRadius: 10, cursor: "pointer" }}>Göndər</button>
            </div>
          </div>
        )}

      </div>

      {/* --- ALT NAVİQASİYA PANELİ (NAVBAR) --- */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 450, backgroundColor: "#071421", display: "flex", justifyContent: "space-around", padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={() => setView("hero")} style={{ background: "none", border: "none", color: view === "hero" ? STYLES.gold : STYLES.textMuted, cursor: "pointer", fontSize: 11 }}>🏠 Ana Səhifə</button>
        <button onClick={() => setView("catalog")} style={{ background: "none", border: "none", color: view === "catalog" ? STYLES.gold : STYLES.textMuted, cursor: "pointer", fontSize: 11 }}>📚 Dərslər</button>
        <button onClick={() => setView("qa")} style={{ background: "none", border: "none", color: view === "qa" ? STYLES.gold : STYLES.textMuted, cursor: "pointer", fontSize: 11 }}>🤖 Sual Ver</button>
      </nav>

    </div>
  );
}