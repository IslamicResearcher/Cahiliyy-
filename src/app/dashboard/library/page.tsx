"use client";
import { useState } from "react";
import Link from "next/link";

const TOPICS = [
  {
    id: 1, title: "Cahiliyyə Dövrü Nədir?", category: "Ümumi baxış",
    summary: "İslamdan əvvəlki Ərəbistanın sosial, mədəni və dini vəziyyətinə genel baxış.",
    content: `Cahiliyyə (ərəbcə: جاهلية) sözü lüğətdə "cəhalət" mənasını verir. İslam tarixşünaslığında isə bu termin İslamın zühuruna qədər — xüsusilə 5-7-ci əsrlər arasında — Ərəbistan yarımadasında hökm sürən dövrü ifadə edir.

Bu termin yalnız "elm bilməmək" deyil; daha dərindən əxlaqi korluq, ilahi rəhbərlikdən uzaqlıq, qəbilə qanununun ilahi qanunun yerinə keçməsi kimi anlayışları əhatə edir.

**Coğrafi Kontekst**
Ərəbistan yarımadası Cahiliyyə dövründə iki böyük imperiya arasında — Sasani İranı (şərqdə) və Bizans (şimalda) — yerləşirdi. Yarımadanın coğrafi şəraiti — səhralar, az yağış — köçəri həyat tərzini zəruri edirdi.

**Sosial Quruluş**
Cahiliyyə cəmiyyətinin əsasını qəbilə (qabila) təşkil edirdi. Fərdin kimliyi, hüquqları, hətta həyatı — hamısı qəbiləyə bağlı idi. İbn Xəldunun "asabiyyə" konsepsiyası bu dövrü izah etmək üçün ən güclü nəzəri çərçivəni verir.

**Dini Vəziyyət**
Kəbə, əsasən tövhid inancı üçün tikilmiş olsa da, Cahiliyyə dövründə 360 büt evi halına gəlmişdi. Bununla yanaşı, Yəhudi və Xristian cəmiyyətləri, habelə Hənif ənənəsi də mövcud idi.`
  },
  {
    id: 2, title: "Muallaqat: Cahiliyyənin Ölməz Şeirləri", category: "Mədəniyyət",
    summary: "Kəbənin divarına asıldığı söylənən yeddi böyük Cahiliyyə şeiri.",
    content: `Muallaqat (المعلقات — "asılmış olanlar") Cahiliyyə dövrünün ən məşhur yeddi şeirini birləşdirən antologiyadır. Rəvayətə görə bu şeirlər qızıl mürəkkəblə yazılıb Kəbənin divarlarına asılmışdı.

**Şairlər**
1. İmru al-Qays — "Şairlərin şahı". Ən məşhur qəsidəni yazan.
2. Tarafa ibn al-Abd — Gənc yaşında öldürülmüş dahi şair.
3. Zuhayr ibn Abi Sulma — Həkimlik şeirlər yazan müdrik şair.
4. Labid ibn Rabia — Sonradan İslamı qəbul etmiş şair.
5. Antara ibn Shaddad — Qəhrəman döyüşçü-şair.
6. Amr ibn Kulthum — Qəbilə qürurunu tərənnüm edən şair.
7. Al-Harith ibn Hillizah — Müdafiə xarakteri güclü şeirlər.

**Qəsidə Strukturu**
Klassik qəsidə üç hissədən ibarət idi:
- Nasib: Sevgilinin tərk etdiyi yerə gəlib ağlamaq
- Rahil: Səfər və çətinliklərin təsviri
- Maqsad: Əsas mövzu — mədh, öyünmə, müharibə`
  },
  {
    id: 3, title: "Hilf al-Fudul: Ədalət Paktı", category: "Siyasət",
    summary: "İslamdan əvvəl Məkkədə bağlanmış ədaləti müdafiə edən nadir ittifaq.",
    content: `Hilf al-Fudul (حلف الفضول — Fəzilətlilər İttifaqı) miladi 595-ci ilə yaxın Məkkədə bağlanmış bir müqavilədir.

**Tarixi Arxa Plan**
Yəmənli bir tacir Məkkəyə gəlmiş, lakin Qüreyşin nüfuzlu şəxsi Əs ibn Vail ona olan borcunu ödəməyi rədd etmişdi. Tacir Kəbənin yanında ucadan şikayətini elan etdi.

Bu hadisə bir neçə qəbilənin liderlərini hərəkətə keçirdi. Abdullah ibn Cudan'ın evində toplanaraq ant içdilər: "Biz Allah adına and içirik ki, Məkkədə olan hər bir məzluma birgə kömək edəcəyik."

**Hz. Peyğəmbərin Sözü**
Hz. Məhəmməd peyğəmbərlik dövründə belə demişdi: "Əgər İslamda bu cür bir ittifaqa dəvət edilsəydim, yenə iştirak edərdim."

**Dərsi**
Bu hədis çox önəmlidir: Hz. Peyğəmbər cahiliyyə dövründə də ədalətin mümkün olduğunu, fitri xeyrin var olduğunu təsdiq etdi.`
  },
  {
    id: 4, title: "Dar al-Arqam: İlk İslam Mərkəzi", category: "Tarix",
    summary: "Hz. Peyğəmbərin Məkkə dövründə ilk müsəlmanları topladığı gizli yer.",
    content: `Dar al-Arqam (Arqamın Evi) Məkkədə Səfa dağının ətəyində yerləşən bir ev idi. Sahibi Arqam ibn Abi al-Arqam al-Makhzumi, İslamı qəbul etmiş gənc bir səhabə idi.

**Tarixi Əhəmiyyəti**
Nübüvvətin 6-cı ilindən etibarən Hz. Peyğəmbər bu evdə ilk müsəlmanları gizlicə topladı. O dövrdə Məkkənin açıq yerləri müsəlmanlar üçün təhlükəli idi.

**Kimler Burda Toplandı?**
İlk müsəlmanların bir çoxu — o cümlədən Hz. Əli, Hz. Xədicə, Hz. Əbu Bəkr, Bilal ibn Rabah — bu evlə tanışdılar. Hz. Ömər (r.a.) İslamı da məhz bu evdə qəbul etdi.

**Pedaqoji Funksiyası**
Bu ev yalnız gizlənmə yeri deyildi — o, ilk İslam məktəbi idi. Quranın ilk surələri burada öyrənildi, namaz öyrədildi, müsəlman kimliyi formalaşdı.`
  },
  {
    id: 5, title: "Cahiliyyədə Qadın", category: "Cəmiyyət",
    summary: "Cahiliyyə dövründə qadınların sosial vəziyyəti və İslamın gətirdiyi dəyişikliklər.",
    content: `Cahiliyyə dövründə Ərəb qadınının vəziyyəti mürəkkəb idi — nə tam köləlik, nə də tam azadlıq.

**Qız Uşaqlarının Diri Basdırılması (Vəd)**
Ən dəhşətli adət "vəd" idi — qız uşaqlarını diri-diri basdırmaq. Quran (16:58-59, 81:8-9) onu açıqca qınadı.

Əsas səbəblər: qızların iqtisadi yük sayılması, döyüşdə iştirak edə bilməməsi, əsir alınma qorxusu.

**Miras Hüququ**
Əksər hallarda qadınlar miras almırdı — əksinə, özləri miras olaraq keçirilirdi.

**Müstəsna Qadınlar**
Hz. Xədicə — uğurlu iş qadını, öz seçdiyi kişiylə evlənən. Bu qadınlar istisna idi, qayda deyil.

**İslamın Dəyişikliyi**
İslam miras (4:11-12), nikah razılığı, talaq hüququ sahəsində qadına hüquqi çərçivə verdi. Bu o dövrün kontekstində inqilabi idi.`
  },
];

export default function LibraryPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = TOPICS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.summary.toLowerCase().includes(search.toLowerCase())
  );

  const topic = TOPICS.find(t => t.id === selected);

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      <Link href="/" className="text-[#C8A96E] text-sm mb-6 block">← Ana Səhifə</Link>
      <h1 className="text-3xl font-bold text-[#C8A96E] mb-6">Bilik Kitabxanası</h1>

      {topic ? (
        <div>
          <button onClick={() => setSelected(null)} className="text-[#C8A96E] text-sm mb-6">← Geri</button>
          <div className="card">
            <span className="text-xs bg-[#C8A96E]/20 text-[#C8A96E] px-2 py-1 rounded mb-4 inline-block">{topic.category}</span>
            <h2 className="text-2xl font-bold text-[#F5EDD8] mb-3">{topic.title}</h2>
            <p className="text-[#5C4A2A] italic mb-6 text-sm">{topic.summary}</p>
            <div className="text-[#F5EDD8]/90 text-sm leading-relaxed whitespace-pre-line border-t border-[#C8A96E]/10 pt-6"
              dangerouslySetInnerHTML={{__html: topic.content.replace(/\*\*(.*?)\*\*/g, "<strong class='text-[#C8A96E]'>$1</strong>")}} />
          </div>
        </div>
      ) : (
        <>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Axtar..." className="input-field mb-6" />
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(t => (
              <button key={t.id} onClick={() => setSelected(t.id)}
                className="card text-left hover:border-[#C8A96E]/50 transition-all group">
                <span className="text-xs bg-[#C8A96E]/20 text-[#C8A96E] px-2 py-1 rounded mb-3 inline-block">{t.category}</span>
                <h3 className="font-bold text-[#F5EDD8] mb-2 group-hover:text-[#C8A96E] transition-colors">{t.title}</h3>
                <p className="text-[#5C4A2A] text-sm">{t.summary}</p>
                <span className="text-[#C8A96E] text-sm mt-3 block">Oxu →</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
