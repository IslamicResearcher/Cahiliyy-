"use client";

import { useState, useEffect } from "react";

// --- RƏNGLƏR VƏ STİLLƏR ---
const C = {
  bgLight: "#FDFBF7",
  cardLight: "#FFFFFF",
  textDark: "#1E293B",
  textMuted: "#64748B",
  navy: "#0F2942",
  gold: "#E29A32",
  goldLight: "#FBF3E6",
  sage: "#4A7B6F",
  sageLight: "#E8F2F0",
  border: "#E2E8F0",
};

// --- ORİJİNAL MƏLUMAT BAZASI ---
const MENU_ITEMS = [
  { id: "qa", title: "AI Sual-Cavab", desc: "Quran+Hədis+12 akademik mənbəyə istinadlı cavablar", icon: "🤖" },
  { id: "lessons", title: "Dərs Materialları", desc: "Mətn · Slayd · Audio formatlarında", icon: "📖" },
  { id: "search", title: "Axtarış", desc: "Bütün məzmun arasında açar söz axtarışı", icon: "🔍" },
  { id: "quiz", title: "Test / Quiz", desc: "Öyrəndiklərini yoxla — 8 sual", icon: "🧩" },
  { id: "daily", title: "Gündəlik Kartlar", desc: "Quran ayələri və hədislər", icon: "🌟" }
];

const SECTIONS = [
  { id: 1, label: "I", title: "Coğrafiya, Demoqrafiya və Geopolitik Müstəvi", icon: "🗺️", color: "#3B82F6", paragraphs: 4,
    text: `"Əl-Cazirə" — hərfən "ada" deməkdir — üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahilini boyunca uzanır; Nəcd platosu mərkəzdə küləklər altında əzəmətlə dayanır; cənubda Rub əl-Xali — dünyanın ən böyük qum dənizi — hər cür ssenari və insan məskunlaşmasının hüdudunu çəkir. Vahələr bu kəskin mənzarədə həyatın dinini və tarixini birbaşa şərtləndirmişdir.`
  },
  { id: 2, label: "II", title: "Sosial Struktur, Tayfa Sistemi və Hüquq", icon: "⚖️", color: "#10B981", paragraphs: 4, text: "Cahiliyyə cəmiyyətinin əsas sütunu qan qohumluğuna əsaslanan tayfa sistemi və əsəbiyyə hissi idi." },
  { id: 3, label: "III", title: "İqtisadi Həyat, Ticarət və İlaf Sistemi", icon: "🐫", color: "#F59E0B", paragraphs: 5, text: "Məkkənin iqtisadiyyatı Qüreyşin yay və qış aylarında təşkil etdiyi beynəlxalq İlaf ticarət karvanlarına söykənirdi." },
  { id: 4, label: "IV", title: "İnanc Sferası, Politeizm və Həniflik", icon: "🕌", color: "#8B5CF6", paragraphs: 6, text: "Kəbədəki bütlərə pərəstiş üstünlük təşkil etsə də, Həzrəti İbrahimin dininin qalıqlarını qoruyan Həniflər də mövcud idi." },
  { id: 5, label: "V", title: "Ailə, Qadın və Cahiliyyə Adətləri", icon: "👁️", color: "#EC4899", paragraphs: 4, text: "Qadın hüquqlarının məhdudluğu və bəzi qəbilələrdə qız uşaqlarının diri-diri basdırılması dövrün ən qaranlıq tərəfləri idi." },
  { id: 6, label: "VI", title: "Dil, Şeir və Cahiliyyə Ədəbiyyatı", icon: "📜", color: "#06B6D4", paragraphs: 5, text: "Müəllaqat-ı Səb'a (Yeddi Asılmış Şeir) ərəb dilinin həm bədii, həm də sosioloji zirvəsi hesab olunurdu." },
  { id: 7, label: "VII", title: "Tarixi Yaddas — Əyyamul-Ərəb", icon: "⚔️", color: "#64748B", paragraphs: 4, text: "Əyyamul-Ərəb — tayfalararası döyüşlər, intiqamlar və qəhrəmanlıq dastanlarının kollektiv yaddaşı idi." }
];

const PRESET_QUESTIONS = [
  { q: "Namazın hökmü nədir?", ar: "ما حكم الصلاة؟", icon: "🕌" },
  { q: "İslam nədir?", ar: "ما هو الإسلام؟", icon: "☪️" },
  { q: "Elmin fəziləti nədir?", ar: "ما فضل العلم؟", icon: "📚" },
  { q: "Zəkat nədir?", ar: "ما هو الزكاة؟", icon: "🤲" },
  { q: "Orucun hökmü nədir?", ar: "ما حكم الصوم؟", icon: "🌙" },
  { q: "Tövhid nədir?", ar: "ما هو التوحيد؟", icon: "✨" }
];

export default function Page() {
  const [currentTab, setCurrentTab] = useState("home"); 
  const [subScreen, setSubScreen] = useState("main"); // main, catalog, reading
  const [selectedSec, setSelectedSec] = useState<any>(SECTIONS[0]);
  const [geminiKey, setGeminiKey] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("cah_gemini_key");
      if (savedKey) setGeminiKey(savedKey);
    }
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    const updated = [...messages, { role: "user", text: textToSend }];
    setMessages(updated);
    setLoading(true);

    if (!geminiKey) {
      setMessages([...updated, { role: "ai", text: "⚙️ Zəhmət olmasa, AI cavabları üçün Parametrlər bölməsindən Gemini API açarınızı daxil edin." }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Sən İslam elmləri və tarixi üzrə akademik bir bələdçisən. Geniş və mənbəli cavab ver: ${textToSend}` }] }] })
      });
      const data = await res.json();
      const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Cavab alınmadı, API açarınızı yoxlayın.";
      setMessages([...updated, { role: "ai", text: answer }]);
    } catch {
      setMessages([...updated, { role: "ai", text: "Şəbəkə xətası baş verdi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bgLight, color: C.textDark, fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* --- ƏSAS MƏZMUN SAHƏSİ --- */}
      <div style={{ width: "100%", maxWidth: 480, flex: 1, padding: "20px 20px 80px 20px", display: "flex", flexDirection: "column" }}>
        
        {currentTab === "home" && subScreen === "main" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Orijinal Göy Hero Kartı */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1E3A5F 100%)`, borderRadius: 24, padding: "35px 25px", textAlign: "center", color: "#FFFFFF", boxShadow: "0 10px 25px rgba(15,41,66,0.15)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.04, background: "radial-gradient(circle, #FFF 10%, transparent 11%)", backgroundSize: "12px 12px" }}></div>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: C.gold, fontWeight: "bold" }}>İslam Araşdırma Rəhbərim</span>
              <h1 style={{ fontSize: 36, margin: "10px 0", fontFamily: "Georgia, serif", color: C.gold }}>الدليل الإسلامي</h1>
              <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.5, maxWidth: 300, margin: "0 auto 25px auto" }}>İslam dini haqqında elmi, mənbəyə istinadlı biliklərə çıxış nöqtəniz</p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: 30, marginBottom: 25, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 15 }}>
                <div><b style={{ fontSize: 18, color: C.gold }}>22+</b><p style={{ fontSize: 11, opacity: 0.6, margin: 0 }}>Mövzu</p></div>
                <div><b style={{ fontSize: 18, color: C.gold }}>17</b><p style={{ fontSize: 11, opacity: 0.6, margin: 0 }}>DB Mənbə</p></div>
                <div><b style={{ fontSize: 18, color: C.gold }}>4</b><p style={{ fontSize: 11, opacity: 0.6, margin: 0 }}>Dil</p></div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setCurrentTab("qa")} style={{ flex: 1, backgroundColor: C.gold, color: C.navy, border: "none", padding: "12px", borderRadius: 12, fontWeight: "bold", cursor: "pointer", fontSize: 14 }}>Sual Ver ➔</button>
                <button onClick={() => setSubScreen("catalog")} style={{ flex: 1, backgroundColor: "transparent", color: "#FFF", border: "1px solid rgba(255,255,255,0.3)", padding: "12px", borderRadius: 12, fontWeight: "bold", cursor: "pointer", fontSize: 14 }}>Dərslər ➔</button>
              </div>
            </div>

            {/* Ayə Lentası */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid " + C.border, borderRadius: 16, padding: "15px 20px", textAlign: "center", fontStyle: "italic" }}>
              <p style={{ margin: "0 0 5px 0", fontSize: 15, fontWeight: "500", color: C.navy }}>"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"</p>
              <span style={{ fontSize: 12, color: C.textMuted }}>"Elm öyrənmək hər bir müsəlmana fərzdir." — İbn Macə</span>
            </div>

            {/* Əsas Menyu Siyahısı */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MENU_ITEMS.map(item => (
                <div key={item.id} onClick={() => { if(item.id === "lessons") setSubScreen("catalog"); else setCurrentTab(item.id); }} style={{ backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 15, cursor: "pointer", transition: "transform 0.2s" }}>
                  <div style={{ fontSize: 24, width: 45, height: 45, borderRadius: 12, backgroundColor: C.goldLight, display: "flex", alignItems: "center", justifyAll: "center", justifyContent: "center" }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: "bold", color: C.navy }}>{item.title}</h4>
                    <p style={{ margin: "2px 0 0 0", fontSize: 12, color: C.textMuted }}>{item.desc}</p>
                  </div>
                  <span style={{ color: C.textMuted, fontSize: 16 }}>➔</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- DƏRSLƏR KATAQLOQU --- */}
        {currentTab === "home" && subScreen === "catalog" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
              <button onClick={() => setSubScreen("main")} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>⬅️</button>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: "bold", color: C.navy }}>Mündəricat</h2>
            </div>
            <p style={{ textCenter: "center", textAlign: "center", fontSize: 24, color: C.gold, margin: "0 0 10px 0", fontFamily: "Georgia" }}>المحتويات</p>
            
            {SECTIONS.map(sec => (
              <div key={sec.id} onClick={() => { setSelectedSec(sec); setSubScreen("reading"); }} style={{ backgroundColor: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 15, cursor: "pointer" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: sec.color + "15", color: sec.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{sec.label}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: "600", color: C.navy }}>{sec.title}</h4>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11, color: C.textMuted }}>{sec.paragraphs} paraqraf</p>
                </div>
                <span style={{ color: C.textMuted }}>➔</span>
              </div>
            ))}
          </div>
        )}

        {/* --- OXU REJİMİ --- */}
        {currentTab === "home" && subScreen === "reading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setSubScreen("catalog")} style={{ background: "none", border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>⬅️ Geri</button>
              <span style={{ fontSize: 12, color: C.gold, fontWeight: "bold" }}>BÖLMƏ {selectedSec.label}</span>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1E3A5F 100%)`, borderRadius: 20, padding: 25, color: "#FFF", textAlign: "center" }}>
              <h2 style={{ fontSize: 28, fontFamily: "Georgia", color: C.gold, margin: "0 0 10px 0" }}>الجاهلية</h2>
              <h3 style={{ fontSize: 18, margin: 0 }}>{selectedSec.title}</h3>
            </div>

            <p style={{ fontSize: 16, lineHeight: 1.8, color: C.textDark, textAlign: "justify", backgroundColor: "#FFF", padding: 20, borderRadius: 16, border: `1px solid ${C.border}` }}>
              {selectedSec.text}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button style={{ flex: 1, backgroundColor: "#E2E8F0", color: C.textDark, border: "none", padding: "12px", borderRadius: 12, fontWeight: "bold" }}>⬅️ Əvvəlki</button>
              <button onClick={() => setSubScreen("catalog")} style={{ flex: 2, backgroundColor: C.navy, color: "#FFF", border: "none", padding: "12px", borderRadius: 12, fontWeight: "bold", cursor: "pointer" }}>Növbəti ➔</button>
            </div>
          </div>
        )}

        {/* --- AI SUAL CAVAB SƏHİFƏSİ --- */}
        {currentTab === "qa" && (
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 15 }}>
            <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
              <h3 style={{ margin: 0, color: C.gold, fontSize: 13, letterSpacing: 1 }}>AI SUAL-CAVAB</h3>
              <span style={{ fontSize: 11, color: C.textMuted }}>Claude · Quran · Hədis · 17 mənbə</span>
            </div>

            {/* Sürətli Sual Kartları Grid-i */}
            {messages.length === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "10px 0" }}>
                {PRESET_QUESTIONS.map((pq, i) => (
                  <div key={i} onClick={() => handleSendMessage(pq.q)} style={{ backgroundColor: "#FFFFFF", border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, cursor: "pointer", display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 18 }}>{pq.icon}</span>
                    <b style={{ fontSize: 13, color: C.navy }}>{pq.q}</b>
                    <span style={{ fontSize: 11, color: C.textMuted, direction: "rtl" }}>{pq.ar}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Mesaj Siyahısı */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, minHeight: "40vh" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", backgroundColor: m.role === "user" ? C.navy : "#FFF", color: m.role === "user" ? "#FFF" : C.textDark, padding: "12px 16px", borderRadius: 14, maxWidth: "85%", fontSize: 14, border: m.role === "user" ? "none" : `1px solid ${C.border}`, lineHeight: 1.5 }}>
                  {m.text}
                </div>
              ))}
              {loading && <div style={{ color: C.textMuted, fontSize: 13, italic: "true" }}>Araşdırılır... 🔎</div>}
            </div>

            {/* Giriş İnput Sahəsi */}
            <div style={{ display: "flex", gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
              <input type="text" placeholder="Sualınızı yazın... (Quran, fiqh, tarix...)" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage(chatInput)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${C.border}`, backgroundColor: "#FFF" }} />
              <button onClick={() => handleSendMessage(chatInput)} style={{ backgroundColor: C.gold, border: "none", color: "#FFF", width: 45, height: 45, borderRadius: 12, cursor: "pointer", fontWeight: "bold" }}>➔</button>
            </div>
          </div>
        )}

        {/* --- PARAMETRLƏR SƏHİFƏSİ --- */}
        {currentTab === "search" && (
          <div style={{ padding: 20, backgroundColor: "#FFF", borderRadius: 16, border: `1px solid ${C.border}` }}>
            <h3>⚙️ Sistem Parametrləri</h3>
            <p style={{ fontSize: 13, color: C.textMuted }}>AI funksiyalarının aktiv olması üçün Gemini API açarınızı bura daxil edin:</p>
            <input type="password" placeholder="AI Açarını daxil et (AI Key)..." value={geminiKey} onChange={e => { setGeminiKey(e.target.value); localStorage.setItem("cah_gemini_key", e.target.value); }} style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, marginTop: 10 }} />
            <p style={{ fontSize: 11, color: "green", marginTop: 5 }}>✓ Açar brauzerin yaddaşında təhlükəsiz saxlanılır.</p>
          </div>
        )}

      </div>

      {/* --- ALT NAVİQASİYA PANELİ (Orijinal Skrinşot Stilində) --- */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, backgroundColor: "#0F2133", display: "flex", justifyContent: "space-around", padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.1)", zIndex: 1000 }}>
        <button onClick={() => { setCurrentTab("home"); setSubScreen("main"); }} style={{ background: "none", border: "none", color: currentTab === "home" ? C.gold : "#8A9DB5", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11 }}>
          <span style={{ fontSize: 18 }}>🏠</span> Ana Səhifə
        </button>
        <button onClick={() => { setCurrentTab("home"); setSubScreen("catalog"); }} style={{ background: "none", border: "none", color: subScreen === "catalog" ? C.gold : "#8A9DB5", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11 }}>
          <span style={{ fontSize: 18 }}>📚</span> Dərslər
        </button>
        <button onClick={() => setCurrentTab("qa")} style={{ background: "none", border: "none", color: currentTab === "qa" ? C.gold : "#8A9DB5", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11 }}>
          <span style={{ fontSize: 18 }}>🤖</span> Sual Ver
        </button>
        <button onClick={() => setCurrentTab("search")} style={{ background: "none", border: "none", color: currentTab === "search" ? C.gold : "#8A9DB5", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11 }}>
          <span style={{ fontSize: 18 }}>⚙️</span> Parametrlər
        </button>
      </nav>

    </div>
  );
}