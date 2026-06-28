export const QUESTIONS = [
  {
    id: 1, category: "society", difficulty: "easy",
    q: "Cahiliyyə dövründə qadınların ən ağır hüquq pozuntusu hansı idi?",
    options: ["Miras hüququnun olmaması", "Qız uşaqlarının diri basdırılması", "Evlənmə hüququnun olmaması", "Təhsil hüququnun olmaması"],
    correct: 1,
    explanation: "Cahiliyyə dövründə bəzi Ərəb qəbilələri qız uşaqlarını (vəd) diri-diri basdırırdı. Quran (16:58-59) bunu kəskin qınadı."
  },
  {
    id: 2, category: "religion", difficulty: "easy",
    q: "Cahiliyyə dövründə Kəbənin ətrafında neçə büt var idi?",
    options: ["100", "200", "360", "500"],
    correct: 2,
    explanation: "Məkkənin fəthindən əvvəl Kəbənin ətrafında 360 büt var idi. Hz. Peyğəmbər Məkkənin fəthindən sonra onların hamısını dağıtdı."
  },
  {
    id: 3, category: "culture", difficulty: "easy",
    q: "Cahiliyyə dövründə ən məşhur ədəbi janr hansı idi?",
    options: ["Hekayə (nəsr)", "Qəsidə (şeir)", "Tarix", "Xütbə"],
    correct: 1,
    explanation: "Qəsidə — uzun mədh şeiri — cahiliyyə ədəbiyyatının tacı idi. Muallaqat (yeddi asılmış şeir) bu dövrün zirvəsini təmsil edir."
  },
  {
    id: 4, category: "politics", difficulty: "easy",
    q: "Dar al-Nadwa nə idi?",
    options: ["Məkkə bazarı", "Qüreyşin parlament evi", "Hz. Peyğəmbərin evi", "Kəbənin daxili otağı"],
    correct: 1,
    explanation: "Dar al-Nadwa Qüseyy ibn Kilab tərəfindən qurulan Qüreyşin məşvərət məclisi idi."
  },
  {
    id: 5, category: "trade", difficulty: "easy",
    q: "Qüreyşin iki böyük ticarət yolculuğu haraya gedirdi?",
    options: ["Misir və İraq", "Şam (yay) və Yəmən (qış)", "Həbəşistan və Fars", "Roma və Hindistan"],
    correct: 1,
    explanation: "Quran (106:1-2) Qüreyşin bu iki yolculuğunu açıqca xatırladır: yay Şama, qış Yəmənə."
  },
  {
    id: 6, category: "tribes", difficulty: "easy",
    q: "Hz. Peyğəmbər hansı qəbilədən idi?",
    options: ["Bəni Ümmuyyə", "Bəni Haşim (Qüreyş)", "Bəni Xazrac", "Bəni Tamim"],
    correct: 1,
    explanation: "Hz. Məhəmməd (s.ə.s.) Qüreyş qəbiləsinin Bəni Haşim kolundan idi."
  },
  {
    id: 7, category: "religion", difficulty: "medium",
    q: "Cahiliyyə dövründə ən məşhur üç ilahə hansılardı?",
    options: ["Lat, Uzza, Manat", "Hubal, Uzza, Lat", "Wadd, Suwa, Yaghuth", "Nasr, Lat, Hubal"],
    correct: 0,
    explanation: "Lat (Taif), Uzza (Məkkə yaxınlığında) və Manat (Mədinə yaxınlığında) — bu üç ilahə Quranın 53:19-20 ayələrində adıyla xatırlanır."
  },
  {
    id: 8, category: "culture", difficulty: "medium",
    q: "'Muallaqat' nədir?",
    options: ["Məkkə bazarlarında satılan paltarlar", "Kəbənin divarına asılan məşhur şeirlər", "Qəbilə müqavilələri", "İslam əvvəli hüquq məcəlləsi"],
    correct: 1,
    explanation: "Muallaqat ('asılmış olanlar') — qızıl hərflərlə yazılıb Kəbənin divarına asıldığı söylənən yeddi şeir toplusudur."
  },
  {
    id: 9, category: "politics", difficulty: "medium",
    q: "Hilf al-Fudul nəyi təmsil edirdi?",
    options: ["Ticarət müqaviləsi", "Zülmə qarşı ədaləti müdafiə edən ittifaq", "Müharibə paktı", "Qüreyşin iqtisadi hegemoniyası"],
    correct: 1,
    explanation: "Hilf al-Fudul cahiliyyə dövründə qurulmuş nadir ədalət paktlarından biri idi. Hz. Peyğəmbər onu yüksək qiymətləndirdi."
  },
  {
    id: 10, category: "society", difficulty: "hard",
    q: "Sayyid Qütb 'Milestones' əsərində müasir cahiliyyəni necə xarakterizə edir?",
    options: ["Yalnız texnoloji gerilik", "Allah yerinə insanın insana hakimiyyəti", "Demokratiyanın olmaması", "Milli dövlətlərin mövcudluğu"],
    correct: 1,
    explanation: "Qütb üçün cahiliyyə: Allah yerinə insanın insana hökmranlıq etdiyi hər cəmiyyət cahiliyyədədir."
  },
];

export const CATEGORIES = [
  { id: "all", label: "Hamısı" },
  { id: "society", label: "🏛️ Cəmiyyət" },
  { id: "religion", label: "☪️ Din" },
  { id: "politics", label: "⚔️ Siyasət" },
  { id: "culture", label: "📜 Mədəniyyət" },
  { id: "trade", label: "🐪 Ticarət" },
  { id: "tribes", label: "🏕️ Qəbilələr" },
];
