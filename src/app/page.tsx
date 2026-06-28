"use client";

import { useState } from "react";

// --- ORIJINAL RƏNGLƏR VƏ KONTRASTLAR ---
const THEMES = {
  light: { 
    bg: "#F5F0E8", 
    bgAlt: "#E8E0D0", 
    card: "#FFFFFF", 
    text: "#1A1A1A", 
    textSub: "#6A6F7A", 
    border: "#E8E0D0", 
    navBg: "rgba(15,30,46,0.96)" 
  },
  dark: { 
    bg: "#0F1E2E", 
    bgAlt: "#0A1420", // Arxa fon daha tünd
    card: "#162840",  // Kartlar fərqli rəngdə (fərqlənsin deyə)
    text: "#F0EBE0", 
    textSub: "#8A9DB5", 
    border: "#2A4A6A", 
    navBg: "rgba(8,15,24,0.97)" 
  },
  sepia: { 
    bg: "#F2E8D5", 
    bgAlt: "#E8D9BC", 
    card: "#FBF4E6", 
    text: "#3B2A1A", 
    textSub: "#8A7260", 
    border: "#D9C8A8", 
    navBg: "rgba(40,25,10,0.96)" 
  },
};

const FONT_SIZES = { small: 0.88, normal: 1, large: 1.15 };
const C = {
  lapis: "#1B3A5C", lapisLight: "#2A5480", saffron: "#C9882A", saffronLight: "#E8A84A",
  ivory: "#F5F0E8", obsidian: "#0F1E2E", sage: "#4A7B6F", sageMuted: "#D4E8E3",
  ash: "#8A8F9A", ashLight: "#C8CDD6",
};

// --- ORIJINAL GÜNÜN KARTLARI DATA ---
const DAILY_CARDS = [
  { type: "ayah", arabic: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا", text: "Allah Adəmə bütün şeylərin adlarını öyrətdi.", ref: "əl-Bəqərə, 2:31", note: "Bilik ilahi bir əmanətdir — insan ona görə xəlifə seçildi." },
  { type: "hadith", arabic: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", text: "Elm öyrənmək hər bir müsəlmana fərzdir.", ref: "İbn Macə, Müqəddimə: 17", note: "Bu hədis yalnız dini elmi deyil, insanın həyatına faydalı hər elmi əhatə edir." },
  { type: "ayah", arabic: "أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ", text: "Məgər onlar Quranı düşünüb anlamırlarmı?", ref: "Məhəmməd, 47:24", note: "Quranın məqsədi oxumaq deyil — düşünmək, anlamaq, tətbiq etməkdir." },
  { type: "hadith", arabic: "إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ", text: "Mən yalnız əxlaqı tamamlamaq üçün göndərildim.", ref: "Muvatta, İmam Malik: Həsnul-Xülq 8", note: "İslam mövcud insani dəyərləri ilahi əsasa oturtdu." },
  { type: "ayah", arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", text: "De: Ey Rəbbim, elmimi artır!", ref: "Taha, 20:114", note: "Quran boyu peyğəmbərə verilən nadir şəxsi dua — bütün insanlığa örnəkdir." }
];

// --- ORIJINAL QUIZ DATA ---
const QUIZ_QUESTIONS = [
  { q: "Cahiliyyə dövründə Kəbəyə asılan böyük şeirlər necə adlanırdı?", opts: ["Müəllaqat", "Mütənəbbi", "Müsnəd", "Müqəddimə"], ans: 0, exp: "Müəllaqat — 'asılmışlar' deməkdir. Ən gözəl şeirlər qızıl hərflərlə yazılıb Kəbənin divarına asılırdı." },
  { q: "'Əsəbiyyə' konsepsiyasını Müqəddimə əsərində nəzəri sistemə gətirən alim kimdir?", opts: ["İmam Ğəzzali", "İbn Xəldun", "İbn Sina", "İbn Rüşd"], ans: 1, exp: "İbn Xəldun (XIV əsr) əsəbiyyəni — tayba birliyi hissini — sivilizasiyaların yaranmasının əsas mexanizmi kimi izah etdi." },
  { q: "Qüreyşin yay və qış ticarət səfərlərinə verilən ad nədir?", opts: ["Əsvaq", "Civar", "İlaf", "Müruvvə"], ans: 2, exp: "İlaf — 'öyrəşkənlik, ittifaq' mənasında. Quranın əl-Qüreyş surəsi bu sistemi birbaşa xatırladır." },
  { q: "Vədul-bənat Quranın hansı surəsində birbaşa qınanır?", opts: ["əl-Bəqərə", "ət-Təkvir", "Ali-İmran", "əl-Fatiha"], ans: 1, exp: "ət-Təkvir, 81:8-9 — 'Diri-diri basdırılmış qız uşağına soruşulduqda — o hansı günaha görə öldürüldü?'" }
];

// --- BÜTÜN 7 ORİJİNAL BÖLMƏ VƏ GENİŞ MƏTNLƏR ---
const LESSON = {
  id: "cahiliyye", arabicTitle: "الجاهلية", title: "Cahiliyyə",
  subtitle: "İslam öncəsi ərəb dünyasının hərtərəfli elmi-tarixi təhlili",
  coverTag: "Tarix · Sosiologiya · Mədəniyyət · Teologiya",
  intro: `Allah Quranda buyurur: "Onlar cahiliyyə hökmünü mü istəyirlər?" (əl-Maidə, 5:50). Bu material Cahiliyyə dövrünü öz daxili qanunauyğunluqları, sosioloji böhranları və İslam inqilabının üzərində yüksəldiyi tarixi-mədəni zəmin kimi araşdırır.`,
  sections: [
    {
      id: 1, romanNum: "I", icon: "📖", title: "Önsöz və Metodoloji Çərçivə",
      paragraphs: [
        { id: "1.1", heading: "Cahiliyyə Məfhumunun Sosioloji və Teoloji Mahiyyəti", text: `Cahiliyyə sadəcə xronoloji bir zaman kəsiyi deyil, həm də spesifik bir zehniyyət, idarəetmə və dəyərlər sistemidir. İslam sivilizasiyasının gətirdiyi universal prinsipləri dərk etmək üçün, ilk növbədə onun yerinə gəldiyi bu strukturun hüquqi, əxlaqi və iqtisadi anatomiyası dərindən təhlil edilməlidir. Cahiliyyə elmsizlikdən ziyadə, haqqa qarşı dirənmə və təkəbbür sosiologiyasıdır.` }
      ]
    },
    {
      id: 2, romanNum: "II", icon: "🗺️", title: "Coğrafiya, Demoqrafiya və Geopolitik Müstəvi",
      paragraphs: [
        { id: "2.1", heading: "Ərəbistan Yarımadasının Fiziki Coğrafiyası", text: `Ərəbistan yarımadasının fiziki mənzərəsi onun sakinlərinin psixologiyasını, dinini və tarixini birbaşa şərtləndirmişdir. Üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahili boyunca uzanır, Nəcd platosu mərkəzdə dayanır, cənubda Rub əl-Xali qum dənizi insan məskunlaşmasının sərhədlərini müəyyən edir.` },
        { id: "2.2", heading: "Oturaq və Bədəvi Ayrımı", text: `Bədəvilər dəvə sürüləri arxasınca mövsümlük köç edirdilər — bu həyat azadlıq, güc və könüllülük simvolu idi. Hadarilər isə — Məkkə, Yəsrib, Taif sakinləri — ticarət yollarının kəsişmə nöqtələrini tutmuş, şəhər həyatının mürəkkəbliyini mənimsəmişdilər. İbn Xəldun Müqəddimədə qeyd edir ki, köçəri həyat əsəbiyyənin (tayfa birliyi hissinin) ən güclü yarandığı zəmindir.` }
      ]
    },
    {
      id: 3, romanNum: "III", icon: "⚖️", title: "Sosial Struktur, Tayfa Sistemi və Hüquq",
      paragraphs: [
        { id: "3.1", heading: "Əsəbiyyə: Tayfa Mütəşəkkilliyi", text: `Fərd tayfasız heç nə deyildi: nə hüququ, nə müdafiəsi, nə şərəfi var idi. Kollektiv məsuliyyət prinsipi — bir üzvün işləddiyi hərəkətə görə bütün tayfanın cavab verməsi — bu sistemi həm möhkəm, həm də amansız edirdi. Ədalət fərdi deyil, kollektiv idi. Soy-kök üstünlüyü cəmiyyətin ən əsas sütunu sayılırdı.` },
        { id: "3.2", heading: "Məkkə Oliqarxiyası və Darun-Nədvə", text: `Məkkədə idarəçilik ağsaqqallar şurası olan "Mələ" tərəfindən həyata keçirilirdi. Qərarlar Darun-Nədvə adlanan məşvərət evində verilirdi. Yalnız müəyyən yaş və nüfuz həddini keçmiş şəxslər burada söz sahibi ola bilərdi. Peyğəmbərliyin ilk illərindəki mütəşəkkil müqavimət də bu institut tərəfindən idarə olunurdu.` }
      ]
    },
    {
      id: 4, romanNum: "IV", icon: "🐪", title: "İqtisadi Həyat, Ticarət və Maliyyə",
      paragraphs: [
        { id: "4.1", heading: "Karvan Ticarəti və İlaf Sistemi", text: `Qüreyş müxtəlif tayfalarla ikitərəfli müqavilələr (ilaf) bağlayırdı. Bu sistem sayəsində Məkkə karvanları Yəmənə (qış) və Şama (yay) etibarlı şəkildə gedib gəlirdi. Məkkə sadəcə dini mərkəz deyil, həm də böyük trans-regional ticarət qovşağı idi.` },
        { id: "4.2", heading: "Riba (Sələmçilik) və Sosial Sömürü", text: `Nəsiə — vaxtında ödənilməmiş borcun müddəti uzadılarkən üzərinə ağır faizlərin əlavə edilməsi Cahiliyyə maliyyəsinin əsas mexanizmi idi. Borclu ödəyə bilməyəndə öz azadlığını və övladlarını itirərək kölə halına düşürdü. Bu sistem cəmiyyətdə kəskin sinfi uçurumlar yaradırdı.` }
      ]
    },
    {
      id: 5, romanNum: "V", icon: "🕌", title: "İnanc Sferası və Politeist Axınlar",
      paragraphs: [
        { id: "5.1", heading: "Bütpərəstlik və Kəbənin Rolu", text: `Cahiliyyə panteonunun başında Hubəl dururdu. Lat, Uzza və Mənat isə digər əsas bütlər idi. Bütlər yalnız dini simvollar deyil, həm də tayfaların siyasi identifikasiya markeri idi. Kəbə ətrafında 360 büt yerləşdirilmişdi və hər tayfa həcc mövsümündə öz bütünü ziyarət etməyə gəlirdi.` },
        { id: "5.2", heading: "Həniflər: Tövhid Axtarışçıları", text: `Cahiliyyə zülmətinin içində bütpərəstliyi rədd edib Həzrəti İbrahimin xalis dini olan tövhidə inanan insanlar da var idi ki, onlara Həniflər deyilirdi. Zeyd ibn Əmr və Varaka ibn Nöfəl kimi şəxslər bu fitrətin canlı şahidləri və ərəb cəmiyyətinin mənəvi vicdanı idilər.` }
      ]
    },
    {
      id: 6, romanNum: "VI", icon: "👁️", title: "Ailə, Qadın və Cahiliyyə Sosiologiyası",
      paragraphs: [
        { id: "6.1", heading: "Qadının Statusu və Miras Hüququ", text: `Cahiliyyə cəmiyyətində qadının müstəqil hüquqi statusu yox idi. O, miras ala bilməzdi, əksinə, əri öldükdə özü bir miras obyekti kimi digər ailə üzvlərinə keçə bilərdi. Bununla belə, Xədicə bint Xüveylid kimi ticarətlə məşğul olan güclü və müstəqil qadın istisnaları da mövcud idi.` },
        { id: "6.2", heading: "Vədul-Bənat (Qız Uşaqlarının Diri Basdırılması)", text: `Bu dəhşətli adət əsasən iqtisadi yoxsulluq, tayfa müharibələrində əsir düşmə qorxusu və saxta namus anlayışından qaynaqlanırdı. Quran bu sosioloji zülmü kəskin şəkildə qınamış və qiyamət günü hesabı sorulacaq ən böyük günahlardan biri kimi elan etmişdir.` }
      ]
    },
    {
      id: 7, romanNum: "VII", icon: "📜", title: "Dil, Şeir və Cahiliyyə Ədəbiyyatı",
      paragraphs: [
        { id: "7.1", heading: "Müəllaqat: Yeddi Asılmış Qəsidə", text: `Ukaz bazarında keçirilən müsabiqələrdə qalib gələn ən mükəmməl şeirlər qızıl hərflərlə kətana yazılıb Kəbənin divarından asılardı. İmruul-Qeys, Əntərə və Zuhayr kimi şairlər dilin və estetikanın zirvəsini fəth etmişdilər. Şeir o dövrün yeganə media və diplomatiya silahı idi.` }
      ]
    }
  ]
};

const TABS = [
  { id: "home", label: "Ana Səhifə", icon: "🏠" },
  { id: "lessons", label: "Bölmələr", icon: "📚" },
  { id: "search", label: "Axtarış", icon: "🔍" },
  { id: "bookmarks", label: "Əlfəcinlər", icon: "🔖" },
  { id: "quiz", label: "Quiz", icon: "🎯" },
  { id: "daily", label: "Günün Kartı", icon: "🎴" },
];

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("normal");
  const [screen, setScreen] = useState("hero"); 
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  const th = THEMES[theme as keyof typeof THEMES] || THEMES.dark;
  const fs = FONT_SIZES[fontSize as keyof typeof FONT_SIZES] || FONT_SIZES.normal;

  // Düzgün keçid funksiyası (Ekran dəyişəndə naviqasiya nişanı da aktivləşir)
  const navigate = (scr: string) => {
    setScreen(scr);
    setActiveTab(scr);
  };

  const goLesson = (lessonObj: any, pIdx = 0) => {
    setCurrentLesson(lessonObj);
    setCurrentParagraphIndex(pIdx);
    setScreen("reading");
  };

  const toggleBookmark = (b: any) => {
    setBookmarks(prev => {
      const exists = prev.some(x => x.pId === b.pId);
      if (exists) return prev.filter(x => x.pId !== b.pId);
      return [...prev, b];
    });
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: th.bgAlt, // Əsas fon tünd
      color: th.text, 
      fontSize: `${16 * fs}px`, 
      fontFamily: "'Segoe UI',system-ui,sans-serif", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      
      {/* HEADER BAR */}
      {screen !== "hero" && (
        <div style={{ 
          position: "sticky", top: 0, 
          background: th.navBg, 
          backdropFilter: "blur(12px)", 
          borderBottom: `1px solid ${th.border}`, 
          padding: "12px 16px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          zIndex: 100 
        }}>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: "bold", color: C.saffron, cursor: "pointer" }} onClick={() => navigate("home")}>
            {LESSON.title} İnteqrasiyası
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setTheme(t => t === "dark" ? "light" : t === "light" ? "sepia" : "dark")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>🎨</button>
            <button onClick={() => setFontSize(s => s === "normal" ? "large" : s === "large" ? "small" : "normal")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>📝</button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: 680, margin: "0 auto", paddingBottom: screen === "hero" ? 0 : 90 }}>
        {screen === "hero"        && <HeroScreen onStart={() => navigate("home")} />}
        {screen === "home"        && <HomeScreen onGo={goLesson} th={th} />}
        {screen === "lessons"     && <LessonsScreen onGo={goLesson} th={th} />}
        {screen === "search"      && <SearchScreen onGo={goLesson} th={th} />}
        {screen === "bookmarks"   && <BookmarksScreen bookmarks={bookmarks} onRemove={i => setBookmarks(b => b.filter((_,idx) => idx!==i))} onGoLesson={goLesson} th={th} />}
        {screen === "quiz"        && <QuizScreen th={th} />}
        {screen === "daily"       && <DailyCardsScreen th={th} />}
        
        {screen === "reading" && currentLesson && (
          <ReadingScreen 
            section={currentLesson} 
            pIndex={currentParagraphIndex} 
            setOuterPIndex={setCurrentParagraphIndex}
            onBack={() => navigate("lessons")} 
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            th={th} 
          />
        )}
      </div>

      {/* FIXED FOOTER NAVIGATION TAB */}
      {screen !== "hero" && (
        <div style={{ 
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", 
          width: "100%", maxWidth: 680, 
          background: th.navBg, 
          backdropFilter: "blur(14px)", 
          borderTop: `1px solid ${th.border}`, 
          display: "flex", zIndex: 200 
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => navigate(t.id)} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", padding: "12px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 20, filter: activeTab === t.id ? "none" : "grayscale(1) opacity(0.4)" }}>{t.icon}</span>
              <span style={{ fontSize: 10, color: activeTab === t.id ? C.saffron : th.textSub, fontWeight: activeTab === t.id ? "bold" : "normal" }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 1. HERO SCREEN
function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", justifyContent: "center", padding: "40px 20px", backgroundColor: C.obsidian, minHeight: "100vh" }}>
      <span style={{ fontSize: 11, color: C.ash, letterSpacing: 2, textTransform: "uppercase", fontWeight: "600", marginBottom: 12 }}>DƏRS MATERİALI</span>
      <h1 style={{ fontSize: 56, color: C.saffron, fontFamily: "Georgia, serif", margin: "0 0 5px 0" }}>{LESSON.arabicTitle}</h1>
      <h2 style={{ fontSize: 34, fontWeight: "bold", color: "#FFFFFF", margin: "0 0 15px 0" }}>{LESSON.title}</h2>
      <p style={{ fontSize: 14, color: C.ash, lineHeight: 1.6, maxWidth: 320, margin: "0 0 25px 0" }}>{LESSON.subtitle}</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", width: "100%", maxWidth: 340, gap: 15, marginBottom: 45 }}>
        <div><b style={{ fontSize: 30, color: C.saffron, display: "block" }}>7</b><span style={{ fontSize: 12, color: C.ash }}>Hissə</span></div>
        <div><b style={{ fontSize: 30, color: C.saffron, display: "block" }}>12</b><span style={{ fontSize: 12, color: C.ash }}>Paraqraf</span></div>
        <div><b style={{ fontSize: 30, color: C.saffron, display: "block" }}>20+</b><span style={{ fontSize: 12, color: C.ash }}>Mənbə</span></div>
      </div>
      
      <button onClick={onStart} style={{ width: "100%", maxWidth: 340, backgroundColor: C.saffron, color: C.obsidian, border: "none", padding: "16px", borderRadius: 14, fontSize: 15, fontWeight: "bold", cursor: "pointer" }}>Giriş Edin ➔</button>
    </div>
  );
}

// 2. HOME SCREEN
function HomeScreen({ onGo, th }: any) {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Kart fərqli rəngdədir və fondan ayrılır */}
      <div style={{ padding: 20, borderRadius: 16, background: th.card, border: `1px solid ${th.border}` }}>
        <h3 style={{ margin: "0 0 10px 0", color: C.saffron }}>Tədqiqat Rəhbəri</h3>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: th.text }}>{LESSON.intro}</p>
      </div>

      <h4 style={{ margin: 0, fontWeight: "bold" }}>Sürətli Keçid Bölmələri</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LESSON.sections.map(s => (
          <div key={s.id} onClick={() => onGo(s, 0)} style={{ padding: 16, borderRadius: 14, background: th.card, border: `1px solid ${th.border}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 15 }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.saffron, fontWeight: "bold" }}>BÖLMƏ {s.romanNum}</div>
              <div style={{ fontSize: 14, fontWeight: "bold", marginTop: 2 }}>{s.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. LESSONS CATALOG (MÜNDƏRİCAT)
function LessonsScreen({ onGo, th }: any) {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15 }}>
      <h3 style={{ margin: 0, fontWeight: "bold" }}>Mündəricat (Bütün Hissələr)</h3>
      {LESSON.sections.map(s => (
        <div key={s.id} style={{ background: th.card, borderRadius: 16, border: `1px solid ${th.border}`, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, borderBottom: `1px solid ${th.border}`, paddingBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: "bold" }}>{s.romanNum}. {s.title}</h4>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {s.paragraphs.map((p, idx) => (
              <div key={p.id} onClick={() => onGo(s, idx)} style={{ padding: 12, borderRadius: 8, background: th.bgAlt, cursor: "pointer", fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                <span>{p.heading}</span>
                <span style={{ color: C.saffron }}>➔</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. SEARCH SCREEN
function SearchScreen({ onGo, th }: any) {
  const [q, setQ] = useState("");
  const results: any[] = [];

  if (q.trim().length > 1) {
    const query = q.toLowerCase();
    LESSON.sections.forEach(s => {
      s.paragraphs.forEach((p, idx) => {
        if (p.heading.toLowerCase().includes(query) || p.text.toLowerCase().includes(query)) {
          results.push({ section: s, pIndex: idx, heading: p.heading });
        }
      });
    });
  }

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15 }}>
      <input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Mətndə axtarın..." style={{ width: "100%", padding: 12, borderRadius: 12, border: `1px solid ${th.border}`, background: th.card, color: th.text, outline: "none" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {results.map((r, i) => (
          <div key={i} onClick={() => onGo(r.section, r.pIndex)} style={{ padding: 12, borderRadius: 10, background: th.card, border: `1px solid ${th.border}`, cursor: "pointer" }}>
            <div style={{ fontSize: 11, color: C.saffron }}>{r.section.title}</div>
            <div style={{ fontSize: 13, fontWeight: "bold", marginTop: 2 }}>{r.heading}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. BOOKMARKS SCREEN
function BookmarksScreen({ bookmarks, onRemove, onGoLesson, th }: any) {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15 }}>
      <h3 style={{ margin: 0, fontWeight: "bold" }}>Əlfəcinlər</h3>
      {bookmarks.length === 0 ? (
        <div style={{ textAlign: "center", color: th.textSub, padding: 40 }}>Əlfəcin əlavə edilməyib.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bookmarks.map((b, i) => (
            <div key={i} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div onClick={() => onGoLesson(b.section, b.pIndex)} style={{ cursor: "pointer", flex: 1 }}>
                <span style={{ fontSize: 11, color: C.saffron }}>{b.sectionTitle}</span>
                <div style={{ fontSize: 13, fontWeight: "bold" }}>{b.heading}</div>
              </div>
              <button onClick={() => onRemove(i)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 6. QUIZ SCREEN
function QuizScreen({ th }: any) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleOpt = (oIdx: number) => {
    if (sel !== null) return;
    setSel(oIdx);
    if (oIdx === QUIZ_QUESTIONS[idx].ans) setScore(s => s + 1);
  };

  if (done) {
    return (
      <div style={{ padding: 30, textAlign: "center" }}>
        <h2>Quiz Bitdi! Nəticə: {score}/{QUIZ_QUESTIONS.length}</h2>
        <button onClick={() => { setIdx(0); setSel(null); setScore(0); setDone(false); }} style={{ padding: 12, background: C.saffron, border: "none", borderRadius: 10, color: "#FFF", marginTop: 15, cursor: "pointer" }}>Yenidən Başla</button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[idx];
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15 }}>
      <div style={{ background: th.card, padding: 18, borderRadius: 14, border: `1px solid ${th.border}` }}>{q.q}</div>
      {q.opts.map((opt, oIdx) => (
        <button key={oIdx} onClick={() => handleOpt(oIdx)} style={{ width: "100%", padding: 14, borderRadius: 10, background: sel === oIdx ? C.saffron : th.card, color: th.text, border: `1px solid ${th.border}`, textAlign: "left", cursor: "pointer" }}>{opt}</button>
      ))}
      {sel !== null && (
        <button onClick={() => idx + 1 < QUIZ_QUESTIONS.length ? setIdx(idx+1) : setDone(true)} style={{ padding: 12, background: C.saffron, border: "none", borderRadius: 10, color: "#FFF", cursor: "pointer" }}>Növbəti ➔</button>
      )}
    </div>
  );
}

// 7. DAILY CARDS SCREEN
function DailyCardsScreen({ th }: any) {
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15 }}>
      {DAILY_CARDS.map((c, i) => (
        <div key={i} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, padding: 18 }}>
          <div style={{ fontSize: 20, direction: "rtl", textAlign: "right", color: C.saffron }}>{c.arabic}</div>
          <div style={{ fontSize: 14, marginTop: 10 }}>{c.text}</div>
          <div style={{ fontSize: 11, color: th.textSub, textAlign: "right" }}>— {c.ref}</div>
        </div>
      ))}
    </div>
  );
}

// 8. READING SCREEN
function ReadingScreen({ section, pIndex, setOuterPIndex, onBack, bookmarks, onToggleBookmark, th }: any) {
  const p = section.paragraphs[pIndex];
  const isBookmarked = bookmarks.some((x: any) => x.pId === p.id);

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 15, flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.saffron, cursor: "pointer" }}>← Mündəricat</button>
        <button onClick={() => onToggleBookmark({ pId: p.id, section, pIndex, heading: p.heading, sectionTitle: section.title })} style={{ background: "none", border: "none", cursor: "pointer" }}>{isBookmarked ? "🔖" : "🕭"}</button>
      </div>
      <h3 style={{ color: C.saffron }}>{p.heading}</h3>
      <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 18, padding: 22, lineHeight: 1.7, textAlign: "justify" }}>{p.text}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => pIndex > 0 && setOuterPIndex(pIndex - 1)} disabled={pIndex === 0} style={{ flex: 1, padding: 12, background: th.card, border: `1px solid ${th.border}`, color: th.text, cursor: "pointer" }}>◀ Əvvəlki</button>
        <button onClick={() => pIndex + 1 < section.paragraphs.length && setOuterPIndex(pIndex + 1)} disabled={pIndex + 1 === section.paragraphs.length} style={{ flex: 1, padding: 12, background: C.saffron, border: "none", color: C.obsidian, cursor: "pointer" }}>Növbəti ▶</button>
      </div>
    </div>
  );
}