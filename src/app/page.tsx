"use client";

import { useState, useRef, useEffect } from "react";

const THEMES = {
  light: { bg:"#F5F0E8", bgAlt:"#E8E0D0", card:"#FFFFFF", text:"#1A1A1A", textSub:"#8A8F9A", border:"#E8E0D0", navBg:"rgba(15,30,46,0.96)" },
  dark:  { bg:"#0F1E2E", bgAlt:"#162840", card:"#1B3A5C", text:"#F0EBE0", textSub:"#8A9DB5", border:"#2A4A6A", navBg:"rgba(8,15,24,0.97)" },
  sepia: { bg:"#F2E8D5", bgAlt:"#E8D9BC", card:"#FBF4E6", text:"#3B2A1A", textSub:"#8A7260", border:"#D9C8A8", navBg:"rgba(40,25,10,0.96)" },
};
const FONT_SIZES = { small:0.88, normal:1, large:1.15 };
const C = {
  lapis:"#1B3A5C", lapisLight:"#2A5480", saffron:"#C9882A", saffronLight:"#E8A84A",
  ivory:"#F5F0E8", obsidian:"#0F1E2E", sage:"#4A7B6F", sageMuted:"#D4E8E3",
  ash:"#8A8F9A", ashLight:"#C8CDD6",
};

const DAILY_CARDS = [
  { type:"ayah",  arabic:"وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا", text:"Allah Adəmə bütün şeylərin adlarını öyrətdi.", ref:"əl-Bəqərə, 2:31", note:"Bilik ilahi bir əmanətdir — insan ona görə xəlifə seçildi." },
  { type:"hadith",arabic:"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", text:"Elm öyrənmək hər bir müsəlmana fərzdir.", ref:"İbn Macə, Müqəddimə: 17", note:"Bu hədis yalnız dini elmi deyil, insanın həyatına faydalı hər elmi əhatə edir." },
  { type:"ayah",  arabic:"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ", text:"Məgər oni Quranı düşünüb anlamırlarmı?", ref:"Məhəmməd, 47:24", note:"Quranın məqsədi oxumaq deyil — düşünmək, anlamaq, tətbiq etməkdir." },
  { type:"hadith",arabic:"إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكارِمَ الْأَخْلَاقِ", text:"Mən yalnız əxlaqı tamamlamaq üçün göndərildim.", ref:"Muvatta, İmam Malik: Həsnul-Xülq 8", note:"İslam mövcud insani dəyərləri ilahi əsasa oturtdu." },
  { type:"ayah",  arabic:"وَقُل رَّbِّ زِدْنِي عِلْمًا", text:"De: Ey Rəbbim, elmimi artır!", ref:"Taha, 20:114", note:"Quran boyu peyğəmbərə verilən nadir şəxsi dua — bütün insanlığa örnəkdir." },
];

const QUIZ_QUESTIONS = [
  { q:"Cahiliyyə dövründə Kəbəyə asılan böyük şeirlər necə adlanırdı?", opts:["Müəllaqat","Mütənəbbi","Müsnəd","Müqəddimə"], ans:0, exp:"Müəllaqat — 'asılmışlar' deməkdir. Ən gözəl şeirlər qızıl hərflərlə yazılıb Kəbənin divarına asılırdı." },
  { q:"'Əsəbiyyə' konsepsiyasını Müqəddimə əsərində nəzəri sistemə gətirən alim kimdir?", opts:["İmam Ğəzzali","İbn Xəldun","İbn Sina","İbn Rüşd"], ans:1, exp:"İbn Xəldun (XIV əsr) əsəbiyyəni — tayba birliyi hissini — sivilizasiyaların yaranmasının əsas mexanizmi kimi izah etdi." },
  { q:"Qüreyşin yay və qış ticarət səfərlərinə verilən ad nədir?", opts:["Əsvaq","Civar","İlaf","Müruvvə"], ans:2, exp:"İlaf — 'öyrəşkənlik, ittifaq' mənasında. Quranın əl-Qüreyş surəsi bu sistemi birbaşa xatırladır." },
];

const LESSON = {
  id:"cahiliyye", arabicTitle:"الجاهلية", title:"Cahiliyyə",
  subtitle:"İslam öncəsi ərəb dünyasının hərtərəfli elmi-tarixi təhlili",
  coverTag:"Tarix · Sosiologiya · Mədəniyyət · Teologiya",
  intro:`Allah Quranda buyurur: "Onlar cahiliyyə hökmünü mü istəyirlər?" (əl-Maidə, 5:50). Bu ayə yalnız bir dövrü deyil, bir düşüncə sistemini xarakterizə edir.`,
  sections:[
    { id:1,romanNum:"I",icon:"🗺️",color:C.lapis,
      title:"Coğrafiya, Demoqrafiya və Geopolitik Müstəvi",
      keywords:["coğrafiya","bədəvi","hadar","bizans"],
      paragraphs:[
        { id:"1.1", heading:"Ərəbistan yarımadasının fiziki coğrafiyası",
          text:`"Əl-Cazirə" — hərfən "ada" deməkdir — üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahilini boyunca uzanır; Nəcd platosu mərkəzdə küləklər altında əzəmətlə dayanır; cənubda Rub əl-Xali — dünyanın ən böyük qum dənizi — hər cür ssenari və insan məskunlaşmasının hüdudunu çəkir.` },
        { id:"1.2", heading:"Oturaq və bədəvi ayrımı: iki dünya, bir mədəniyyət",
          text:`Bədəvilər dəvə sürüləri arxasınca mövsümlük köç edirdilər — bu həyat azadlıq, güc, könüllülük simvolu idi. Hadarilər isə — Məkkə, Yəsrib, Taif sakinləri — ticarət yollarının kəsişmə nöqtələrini tutmuş, şəhər həyatının mürəkkəbliyini mənimsəmişdilər.` }
      ]}
  ]
};

const TABS = [
  { id:"home", icon:"📖", label:"Dərs" },
  { id:"qa", icon:"💬", label:"Sual-Cavab" },
  { id:"quiz", icon:"🎯", label:"Test" },
  { id:"daily", icon:"✨", label:"Günün Kartı" },
  { id:"bookmarks", icon:"🔖", label:"Əlfəcin" },
];

export default function Page() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("normal");
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(null);
  const [geminiKey, setGeminiKey] = useState("");

  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const mainRef = useRef<HTMLElement>(null);

  const th = THEMES[theme as keyof typeof THEMES] || THEMES.light;
  const fontSizeMultiplier = FONT_SIZES[fontSize as keyof typeof FONT_SIZES] || 1;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("cah_theme");
      const savedFont = localStorage.getItem("cah_font");
      const savedKey = localStorage.getItem("cah_gemini_key");
      const savedBms = localStorage.getItem("cah_bookmarks");

      if (savedTheme) setTheme(savedTheme);
      if (savedFont) setFontSize(savedFont);
      if (savedKey) setGeminiKey(savedKey);
      if (savedBms) setBookmarks(JSON.parse(savedBms));
    }
  }, []);

  const saveToLocal = (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const toggleBookmark = (id: string, heading?: string) => {
    let updated;
    const exists = bookmarks.find((b: any) => b.id === id);
    if (exists) {
      updated = bookmarks.filter((b: any) => b.id !== id);
    } else {
      updated = [...bookmarks, { id, heading }];
    }
    setBookmarks(updated);
    saveToLocal("cah_bookmarks", JSON.stringify(updated));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");

    const updatedMessages = [...messages, { role: "user", text: userMsg }];
    setMessages(updatedMessages);
    setChatLoading(true);

    if (!geminiKey) {
      setMessages([...updatedMessages, { role: "ai", text: "⚠️ Zəhmət olmasa, AI cavabları üçün sağ yuxarıdakı dişli çarx (⚙️) düyməsinə klikləyərək Gemini API açarınızı daxil edin." }]);
      setChatLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Sən İslam öncəsi Ərəbistanı və Cahiliyyə dövrünü araşdıran elmi və obyektiv bir bələdçisən. İstifadəçinin sualına elmi şəkildə cavab ver: ${userMsg}` }] }]
          })
        }
      );
      const data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Bağışlayın, cavab alına bilmədi. Zəhmət olmasa API açarınızı və internetinizi yoxlayın.";
      setMessages([...updatedMessages, { role: "ai", text: aiResponse }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "ai", text: "Şəbəkə xətası baş verdi. İnternet bağlantınızı yoxlayın." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const navigate = (tabId: string) => {
    setActiveTab(tabId);
    setScreen(tabId);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const goLesson = (pId: string) => {
    setSelectedParagraphId(pId);
    navigate("home");
    setTimeout(() => {
      const el = document.getElementById(`p-${pId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  return (
    <div style={{ minHeight:"100vh", backgroundColor:th.bg, color:th.text, fontFamily:"'Georgia', serif", transition:"background 0.3s, color 0.3s", display:"flex", flexDirection:"column", alignItems:"center" }}>
      
      <header style={{ width:"100%", maxWidth:680, padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${th.border}`, position:"sticky", top:0, background:th.bg, zIndex:100 }}>
        <div>
          <span style={{ fontSize:12, color:C.saffron, fontWeight:"bold", letterSpacing:1.5 }}>{LESSON.arabicTitle}</span>
          <h1 style={{ margin:0, fontSize:22, fontWeight:"bold" }}>{LESSON.title}</h1>
        </div>
        
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <select value={theme} onChange={(e) => { setTheme(e.target.value); saveToLocal("cah_theme", e.target.value); }} style={{ background:th.card, color:th.text, border:`1px solid ${th.border}`, padding:"5px", borderRadius:6, fontSize:12, cursor:"pointer" }}>
            <option value="light">Açıq</option>
            <option value="dark">Tünd</option>
            <option value="sepia">Sepiya</option>
          </select>
          <select value={fontSize} onChange={(e) => { setFontSize(e.target.value); saveToLocal("cah_font", e.target.value); }} style={{ background:th.card, color:th.text, border:`1px solid ${th.border}`, padding:"5px", borderRadius:6, fontSize:12, cursor:"pointer" }}>
            <option value="small">Kiçik</option>
            <option value="normal">Normal</option>
            <option value="large">Böyük</option>
          </select>
          <button onClick={() => {
            const key = prompt("Google Gemini API Açarınızı daxil edin:", geminiKey);
            if (key !== null) { setGeminiKey(key); saveToLocal("cah_gemini_key", key); }
          }} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer" }}>⚙️</button>
        </div>
      </header>

      <main ref={mainRef} style={{ width:"100%", maxWidth:680, padding:"20px 20px 100px 20px", flex:1, overflowY:"auto" }}>
        
        {screen === "home" && (
          <div>
            <div style={{ textAlign:"center", padding:"20px 0", borderBottom:`1px solid ${th.border}`, marginBottom:25 }}>
              <span style={{ fontSize:11, background:C.saffron+"20", color:C.saffron, padding:"4px 10px", borderRadius:20, fontWeight:"bold" }}>{LESSON.coverTag}</span>
              <p style={{ fontStyle:"italic", color:th.textSub, marginTop:15, fontSize:15 * fontSizeMultiplier, lineHeight:1.6 }}>{LESSON.intro}</p>
            </div>

            <div style={{ marginBottom:25 }}>
              <input type="text" placeholder="Mətndə açar söz ara..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{ width:"100%", padding:"12px 15px", borderRadius:10, border:`1px solid ${th.border}`, background:th.card, color:th.text, fontSize:14 }} />
            </div>

            {LESSON.sections.map(sec => {
              const filteredParagraphs = sec.paragraphs.filter(p => p.heading.toLowerCase().includes(searchQuery.toLowerCase()) || p.text.toLowerCase().includes(searchQuery.toLowerCase()) || sec.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase())));
              if (filteredParagraphs.length === 0) return null;

              return (
                <section key={sec.id} style={{ marginBottom:40 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:15, borderBottom:`2px solid ${sec.color}40`, paddingBottom:8 }}>
                    <span style={{ fontSize:22 }}>{sec.icon}</span>
                    <h2 style={{ fontSize:18, fontWeight:"bold", color:theme==="light"?sec.color:th.text, margin:0 }}>{sec.romanNum}. {sec.title}</h2>
                  </div>
                  
                  {filteredParagraphs.map(p => {
                    const isBookmarked = bookmarks.some((b: any) => b.id === p.id);
                    return (
                      <div key={p.id} id={`p-${p.id}`} style={{ background:th.card, padding:20, borderRadius:12, marginBottom:15, border:`1px solid ${selectedParagraphId === p.id ? C.saffron : th.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.02)", position:"relative" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <h3 style={{ margin:0, fontSize:16 * fontSizeMultiplier, fontWeight:"bold", color:C.saffron }}>{p.heading}</h3>
                          <button onClick={() => toggleBookmark(p.id, p.heading)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:isBookmarked?C.saffron:th.textSub }}>{isBookmarked?"🔖":"🔖"}</button>
                        </div>
                        <p style={{ margin:0, fontSize:14 * fontSizeMultiplier, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{p.text}</p>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        )}

        {screen === "qa" && (
          <div style={{ display:"flex", flexDirection:"column", height:"65vh" }}>
            <div style={{ flex:1, overflowY:"auto", paddingBottom:15, display:"flex", flexDirection:"column", gap:12 }}>
              {messages.length === 0 && (
                <div style={{ textAlign:"center", color:th.textSub, marginTop:40, padding:20 }}>
                  <h3>💬 Cahiliyyə Dövrü Süni İntellekt Köməkçisi</h3>
                  <p style={{ fontSize:14 }}>İslam öncəsi ərəb dünyası barədə sualınızı verin.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf:msg.role === "user"?"flex-end":"flex-start", maxWidth:"85%", background:msg.role === "user"?C.lapis:th.card, color:msg.role === "user"?"#FFF":th.text, padding:"12px 16px", borderRadius:14, border:msg.role==="user"?"none":`1px solid ${th.border}`, fontSize:14 * fontSizeMultiplier, lineHeight:1.5, whiteSpace:"pre-wrap" }}>
                  {msg.text}
                </div>
              ))}
              {chatLoading && <div style={{ alignSelf:"flex-start", background:th.card, padding:"12px 16px", borderRadius:14, fontSize:13, color:th.textSub }}>Düşünürəm... 🤔</div>}
            </div>
            
            <div style={{ display:"flex", gap:10, paddingTop:10, borderTop:`1px solid ${th.border}` }}>
              <input type="text" placeholder="Sualınızı yazın..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSendMessage()} style={{ flex:1, padding:"12px", borderRadius:8, border:`1px solid ${th.border}`, background:th.card, color:th.text }} />
              <button onClick={handleSendMessage} style={{ background:C.saffron, color:"#FFF", border:"none", padding:"0 20px", borderRadius:8, fontWeight:"bold", cursor:"pointer" }}>Göndər</button>
            </div>
          </div>
        )}

        {screen === "quiz" && <QuizComponent th={th} fs={fontSizeMultiplier} />}
        {screen === "daily" && <DailyCardsComponent th={th} fs={fontSizeMultiplier} />}

        {screen === "bookmarks" && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:"bold", marginBottom:20 }}>🔖 Saxlanılan Əlfəcinlər</h2>
            {bookmarks.length === 0 ? (
              <p style={{ color:th.textSub, textAlign:"center", marginTop:40 }}>Hələ heç bir əlfəcin əlavə edilməyib.</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {bookmarks.map((bm: any) => (
                  <div key={bm.id} onClick={() => goLesson(bm.id)} style={{ background:th.card, padding:"15px 20px", borderRadius:10, border:`1px solid ${th.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
                    <span style={{ fontWeight:"bold", color:C.saffron, fontSize:14 * fontSizeMultiplier }}>{bm.heading}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(bm.id); }} style={{ background:"none", border:"none", color:th.textSub, cursor:"pointer" }}>❌</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:680, background:th.navBg, backdropFilter:"blur(14px)", borderTop:`1px solid ${C.saffron}20`, display:"flex", zIndex:200, boxShadow:"0 -4px 12px rgba(0,0,0,0.05)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => navigate(t.id)} style={{ flex:1, border:"none", background:"none", cursor:"pointer", padding:"12px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:20, filter:activeTab===t.id?"none":"grayscale(1) opacity(0.5)" }}>{t.icon}</span>
            <span style={{ fontSize:10, color:activeTab===t.id?C.saffron:th.textSub, fontWeight:activeTab===t.id?"bold":"normal" }}>{t.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

function QuizComponent({ th, fs }: any) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleOptClick = (idx: number) => {
    if (show) return;
    setSel(idx);
    setShow(true);
    if (idx === QUIZ_QUESTIONS[cur].ans) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSel(null);
    setShow(false);
    if (cur < QUIZ_QUESTIONS.length - 1) {
      setCur(c => c + 1);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign:"center", padding:"40px 20px", background:th.card, borderRadius:12, border:`1px solid ${th.border}` }}>
        <h2>🎯 Test Bitdi!</h2>
        <p style={{ fontSize:18 * fs, margin:"20px 0" }}>Nəticəniz: <b>{QUIZ_QUESTIONS.length}</b> sualdan <b>{score}</b> düzgün cavab.</p>
        <button onClick={() => { setCur(0); setSel(null); setShow(false); setScore(0); setDone(false); }} style={{ background:C.saffron, color:"#FFF", border:"none", padding:"10px 20px", borderRadius:6, cursor:"pointer", fontWeight:"bold" }}>Yenidən Başla</button>
      </div>
    );
  }

  const qData = QUIZ_QUESTIONS[cur];
  return (
    <div style={{ background:th.card, padding:25, borderRadius:12, border:`1px solid ${th.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", color:th.textSub, fontSize:12, marginBottom:15 }}>
        <span>Sual {cur+1} / {QUIZ_QUESTIONS.length}</span>
        <span>Düzgün: {score}</span>
      </div>
      <h3 style={{ margin:"0 0 20px 0", fontSize:16 * fs, lineHeight:1.5 }}>{qData.q}</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {qData.opts.map((o, idx) => {
          let bg = th.bg;
          let border = th.border;
          if (show) {
            if (idx === qData.ans) { bg = C.sage+"30"; border = C.sage; }
            else if (idx === sel) { bg = "#FF000015"; border = "#FF000040"; }
          }
          return (
            <button key={idx} onClick={() => handleOptClick(idx)} style={{ width:"100%", textAlign:"left", padding:"14px", borderRadius:8, background:bg, border:`1px solid ${border}`, color:th.text, fontSize:14 * fs, cursor:show?"default":"pointer" }}>
              {o}
            </button>
          );
        })}
      </div>
      {show && (
        <div style={{ marginTop:20, padding:15, background:C.saffron+"10", borderRadius:8, borderLeft:`4px solid ${C.saffron}`, fontSize:13 * fs, lineHeight:1.5 }}>
          💡 <b>İzah:</b> {qData.exp}
          <div style={{ textAlign:"right", marginTop:15 }}><button onClick={handleNext} style={{ background:C.saffron, color:"#FFF", border:"none", padding:"8px 16px", borderRadius:6, fontWeight:"bold", cursor:"pointer" }}>Növbəti ➡️</button></div>
        </div>
      )}
    </div>
  );
}

function DailyCardsComponent({ th, fs }: any) {
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ background:th.card, padding:30, borderRadius:16, border:`1px solid ${th.border}`, textAlign:"center", position:"relative" }}>
      <span style={{ fontSize:11, fontWeight:"bold", background:C.saffron+"25", color:C.saffron, padding:"4px 12px", borderRadius:20 }}>{DAILY_CARDS[idx].type === "ayah" ? "📖 Quran Ayəsi" : "✨ Şərif Hədis"}</span>
      <h2 style={{ fontSize:24 * fs, color:C.lapisLight, margin:"25px 0 15px 0", fontFamily:"'Times New Roman', serif", direction:"rtl" }}>{DAILY_CARDS[idx].arabic}</h2>
      <p style={{ fontSize:15 * fs, fontWeight:"bold", lineHeight:1.6, margin:"0 0 10px 0" }}>"{DAILY_CARDS[idx].text}"</p>
      <span style={{ fontSize:12, color:th.textSub, display:"block", marginBottom:20 }}>— {DAILY_CARDS[idx].ref}</span>
      <div style={{ background:th.bg, padding:15, borderRadius:10, fontSize:13 * fs, color:th.text, fontStyle:"italic", lineHeight:1.5 }}>💡 {DAILY_CARDS[idx].note}</div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:25 }}>
        <button onClick={() => setIdx(i => i > 0 ? i - 1 : DAILY_CARDS.length - 1)} style={{ background:"none", border:"none", cursor:"pointer", color:C.saffron, fontWeight:"bold" }}>⬅️ Əvvəlki</button>
        <button onClick={() => setIdx(i => i < DAILY_CARDS.length - 1 ? i + 1 : 0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.saffron, fontWeight:"bold" }}>Növbəti ➡️</button>
      </div>
    </div>
  );
}