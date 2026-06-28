"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// --- THEMES & STYLES FROM ORIGINAL CODE ---
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

// --- DATA STRUCTURES FROM ORIGINAL CODE ---
const DAILY_CARDS = [
  { type:"ayah",  arabic:"وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا", text:"Allah Adəmə bütün şeylərin adlarını öyrətdi.", ref:"əl-Bəqərə, 2:31", note:"Bilik ilahi bir əmanətdir — insan ona görə xəlifə seçildi." },
  { type:"hadith",arabic:"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", text:"Elm öyrənmək hər bir müsəlmana fərzdir.", ref:"İbn Macə, Müqəddimə: 17", note:"Bu hədis yalnız dini elmi deyil, insanın həyatına faydalı hər elmi əhatə edir." },
  { type:"ayah",  arabic:"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ", text:"Məgər onlar Quranı düşünüb anlamırlarmı?", ref:"Məhəmməd, 47:24", note:"Quranın məqsədi oxumaq deyil — düşünmək, anlamaq, tətbiq etməkdir." },
  { type:"hadith",arabic:"إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكَارِمَ الْأَخْلَاقِ", text:"Mən yalnız əxlaqı tamamlamaq üçün göndərildim.", ref:"Muvatta, İmam Malik: Həsnul-Xülq 8", note:"İslam mövcud insani dəyərləri ilahi əsasa oturtdu." },
  { type:"ayah",  arabic:"وَقُل رَّبِّ زِدْنِي عِلْمًا", text:"De: Ey Rəbbim, elmimi artır!", ref:"Taha, 20:114", note:"Quran boyu peyğəmbərə verilən nadir şəxsi dua — bütün insanlığa örnəkdir." },
  { type:"hadith",arabic:"الْمُسْلِمُ أَخُو الْمُسْلِمِ", text:"Müsəlman müsəlmanın qardaşıdır.", ref:"Buxari, Məzalim: 3", note:"Bu qardaşlıq qan bağı deyil — inanc, məsuliyyət, qarşılıqlı hüquq bağıdır." },
  { type:"ayah",  arabic:"إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", text:"Şübhəsiz ki, Allah səbr edənlərlə birlikdədir.", ref:"əl-Bəqərə, 2:153", note:"İlahi yardım şərtsiz gəlmir — Quran onu səbrin ardınca yerləşdirir." },
];

const QUIZ_QUESTIONS = [
  { q:"Cahiliyyə dövründə Kəbəyə asılan böyük şeirlər necə adlanırdı?", opts:["Müəllaqat","Mütənəbbi","Müsnəd","Müqəddimə"], ans:0, exp:"Müəllaqat — 'asılmışlar' deməkdir. Ən gözəl şeirlər qızıl hərflərlə yazılıb Kəbənin divarına asılırdı." },
  { q:"'Əsəbiyyə' konsepsiyasını Müqəddimə əsərində nəzəri sistemə gətirən alim kimdir?", opts:["İmam Ğəzzali","İbn Xəldun","İbn Sina","İbn Rüşd"], ans:1, exp:"İbn Xəldun (XIV əsr) əsəbiyyəni — tayba birliyi hissini — sivilizasiyaların yaranmasının əsas mexanizmi kimi izah etdi." },
  { q:"Qüreyşin yay və qış ticarət səfərlərinə verilən ad nədir?", opts:["Əsvaq","Civar","İlaf","Müruvvə"], ans:2, exp:"İlaf — 'öyrəşkənlik, ittifaq' mənasında. Quranın əl-Qüreyş surəsi bu sistemi birbaşa xatırladır." },
  { q:"Vədul-bənat Quranın hansı surəsində birbaşa qınanır?", opts:["əl-Bəqərə","ət-Təkvir","Ali-İmran","əl-Fatiha"], ans:1, exp:"ət-Təkvir, 81:8-9 — 'Diri-diri basdırılmış qız uşağına soruşulduqda — o hansı günaha görə öldürüldü?'" },
  { q:"Basus müharibəsi hansı iki tayfa arasında baş verdi?", opts:["Qüreyş və Xəzrəc","Tağlib və Bəkr","Əvs və Nəccar","Ləhmi və Qəssani"], ans:1, exp:"Tağlib və Bəkr tayfaları arasında — bir dəvənin öldürülməsindən başlayan bu qan davası 40 ilə yaxın sürdu." },
  { q:"Peyğəmbərlik öncəsi Məhəmməd (s.ə.s) iştirak etdiyi ədalət ittifaqının adı nədir?", opts:["Hilful-Fudul","Darun-Nədvə","Ukaz bazarı","Əyyamul-Ərəb"], ans:0, exp:"Hilful-Fudul — 'Fəzilətlilər İttifaqı'. Peyğəmbər (s.ə.s) bu andı İslamdan sonra da dəyərləndirib." },
  { q:"'Arabia Felix' adlandırılan, bəndin dağılmasıyla süquta uğrayan bölgə hansıdır?", opts:["Hicaz","Nəcd","Yəmən","Şam"], ans:2, exp:"Mərib bəndi Yəməndə idi. Onun dağılması böyük miqrasiya dalğasına səbəb oldu." },
  { q:"Həniflər kimdir?", opts:["Cahiliyyənin kahinləri","İbrahimin tövhid dinini arayan insanlar","Yəhudi alimləri","Bizans xristianları"], ans:1, exp:"Həniflər nə yəhudi, nə xristian, nə müşrik idi — bütpərəstliyi rədd edib İbrahimin xalis dinini axtaran insanlar idi." },
];

const LESSON = {
  id:"cahiliyye", arabicTitle:"الجاهلية", title:"Cahiliyyə",
  subtitle:"İslam öncəsi ərəb dünyasının hərtərəfli elmi-tarixi təhlili",
  coverTag:"Tarix · Sosiologiya · Mədəniyyət · Teologiya",
  intro:`Allah Quranda buyurur: "Onlar cahiliyyə hökmünü mü istəyirlər?" (əl-Maidə, 5:50). Bu ayə yalnız bir dövrü deyil, bir düşüncə sistemini xarakterizə edir. Bu material Cahiliyyə dövrünü öz daxili qanunauyğunluqları, estetik zirvələri, sosioloji böhranları və İslam inqilabının üzərində yüksəldiyi tarixi-mədəni zəmin kimi araşdırır.`,
  sections:[
    { id:1,romanNum:"I",icon:"🗺️",color:C.lapis,
      title:"Coğrafiya, Demoqrafiya və Geopolitik Müstəvi",
      keywords:["coğrafiya","bədəvi","hadar","bizans","sasani","mərib","yarımada"],
      paragraphs:[
        { id:"1.1", heading:"Ərəbistan yarımadasının fiziki coğrafiyası",
          text:`Allah Quranda and içir: "Tinin və zeytunun haqqı üçün, Sinay dağının haqqı üçün, bu əmin-amanlıq şəhərinin haqqı üçün!" (ət-Tin, 95:1–3). Bu ilahi andın coğrafi koordinatları tesadüfi deyil — yarımadasının fiziki mənzərəsi onun sakinlərinin psixologiyasını, dinini və tarixini birbaşa şərtləndirmişdir.\n\n"Əl-Cazirə" — hərfən "ada" deməkdir — üç tərəfdən su ilə əhatə olunmuş bu nəhəng torpaq kütləsi dünya tarixinin ən mühüm geopolitik məkanlarından birinə çevrilmişdir. Həcaz dağ silsiləsi qərb sahilini boyunca uzanır; Nəcd platosu mərkəzdə küləklər altında əzəmətlə dayanır; cənubda Rub əl-Xali — dünyanın ən böyük qum dənizi — hər cür sistematik insan məskunlaşmasının hüdudunu çəkir.\n\nVahələr bu kəskin mənzərədə həyatın ocaqları idi. Robert Hoyland (Arabia and the Arabs, 2001) qeyd edir ki, vahənin nəzarəti yalnız iqtisadi deyil, siyasi üstünlük demək idi. Quraqlıq miqrasiyaya, miqrasiya müharibəyə, müharibə isə şeirə çevrilirdi.` },
        { id:"1.2", heading:"Oturaq və bədəvi ayrımı: iki dünya, bir mədəniyyət",
          text:`Quran bədəvi ərəblərə xüsusi olaraq müraciət edir: "Bədəvilər iman gətirib dedilər... De ki: Siz iman gətirmədiniz, ancaq 'müsəlman olduq' deyin" (əl-Hücurat, 49:14). Bu fərqli xitab oturaq-köçəri ayrımının nə qədər dərin sosioloji gerçəklik olduğunu göstərir.\n\nBədəvilər dəvə sürüləri arxasınca mövsümlük köç edirdilər — bu həyat azadlıq, güc, könüllülük simvolu idi. Hadarilər isə — Məkkə, Yəsrib, Taif sakinləri — ticarət yollarının kəsişmə nöqtələrini tutmuş, şəhər həyatının mürəkkəbliyini mənimsəmişdilər.\n\nİbn Xəldun Müqəddimədə bu ikiliyin tarixi qanunauyğunluğunu formalaşdırır: köçəri həyat əsəbiyyənin — tayfa birliyi hissinin — ən güclü formada yarandığı zəmindir; lakin sivilizasiya ancaq oturaq həyatla mümkündür.` },
        { id:"1.3", heading:"İki imperiyanın kölgəsində",
          text:`Quran nazil olduğu ilk illərdə Bizans-Sasani müharibəsi davam edirdi: "Rum məğlub edildi — ən yaxın bir yerdə. Lakin onlar bu məğlubiyyətin ardından qalib gələcəklər" (ər-Rum, 30:2–3). Bu peyğəmbərlik müsəlmanların geopolitik şüurunun nə qədər yüksək olduğunu göstərir.\n\nVI əsrin sonlarında Ərəbistan iki super güc arasında sıxışmışdı. Bizans qərb cəbhəsini tutmuş, Sasani isə şərqdən təsirini göstərirdi. Hər iki güc ərəb vassal dövlətlərindən istifadə edirdi: Ləhmilər Sasanilərin, Qəssanilər isə Bizansın tampon dövlətləri idi.\n\nBu geopolitik çərçivə ərəb tayfalarını böldü, lakin eyni zamanda diplomatik manevr sahəsi açdı. Qüreyşin ticarəti hər iki imperiya ərazisinden keçən yollardan asılı idi — bu asılılıq isə siyasi neytralitetin iqtisadi vacibliyi mənasına gəlirdi.` },
        { id:"1.4", heading:"Mərib bəndinin süqutu",
          text:`Quran Səba əhlinə dair bir əlamətdar hadisəni xatırladır: "Onların yurdunda sağda da, solda da iki bağ var idi... Lakin onlar üz döndərdilər; biz də üstlərinə Ərim selini göndərdik" (Səba, 34:15–16). Məhz bu "Ərim seli" — Mərib bəndinin dağılması — tarixi həqiqətin Qurani əksidir.\n\nMiladi 570-575-ci illərdə Mərib bəndinin son dəfə çöküşü yalnız bir hidravlik fəlakət deyildi — bu, bütöv bir sivilizasiyanın iflası idi. Yəmənin məhsuldar torpaqları çölə döndü; əhali kütlə halında şimala axışdı.\n\nBu miqrasiya dalğası Cahiliyyə dövründə tayfa rəqabətini kəskinləşdirdi, yeni ərazi mübahisələri yaratdı, lakin eyni zamanda cənub Ərəbistanının mədəni ənənələrini şimala daşıdı. İslamın doğulacağı Hicaz bu miqrasiya dalğalarının üst-üstə yığıldığı tarixi-demoqrafik bir qovşaq idi.` },
      ]},
    { id:2,romanNum:"II",icon:"⚖️",color:C.sage,
      title:"Sosial Struktur, Tayfa Sistemi və Hüquq",
      keywords:["əsəbiyyə","tayfa","şeyx","mələ","darun-nədvə","qul","hilful-fudul"],
      paragraphs:[
        { id:"2.1", heading:"Əsəbiyyə: İbn Xəldunun böyük kəşfi",
          text:`"Ey insanlar! Biz sizi bir kişi və bir qadından yaratdıq; bir-birinizi tanıyasınız deyə sizi xalqlara və qəbilələrə böldük. Allah yanında ən hörmətliniz ən təqvalınızdır" (əl-Hücurat, 49:13). Bu ayə Cahiliyyənin ən dərin dəyər sistemini — soy-kök üstünlüyünü — kökündən rədd edir.\n\nİbn Xəldun Müqəddimədə qeyd edir ki, əsəbiyyə — tayba mütəşərriqliyi, kollektiv birlik hissi — insan cəmiyyətlərinin yaranmasının əsas mexanizmidir. Fərd tayfasız heç nə deyildi: nə hüququ, nə müdafiəsi, nə şərəfi var idi.\n\nKollektiv məsuliyyət prinsipi — bir üzvün işləddiyi hərəkətə görə bütün tayfanın cavab verməsi — bu sistemi həm möhkəm, həm amansız edirdi. Ədalət fərdi deyil, kollektiv idi.` },
        { id:"2.2", heading:"Tayfa idarəçiliyi: şeyx, mələ, Darun-Nədvə",
          text:`Quran Məkkə oligarxiyasına — Mələyə — birbaşa müraciət edir: "Onların Mələsi dedi: 'Bu, sizi torpağınızdan çıxarmaq istəyən bir sehrbazdan başqa bir şey deyil!'" (əl-Əraf, 7:109). Bu ifadə bir sosial institutun adı idi: ağsaqqallar şurası.\n\nTayfa şeyxi irsi bir mövqe deyildi — sübut olunmuş cəsarət, əliaçıqlıq, məsləhət verə bilmə qabiliyyəti şeyxə gətirib çıxarırdı.\n\nMəkkədə bu qurum "Darun-Nədvə" — hərfən Məşvərət Evi — şəklini almışdı. Yalnız 40 yaşını keçmiş kişilər söz sahibi ola bilirdi. Peyğəmbərliyin ilk illərindəki ən mütəşəkkil müqavimət də bu eyvan altından yüksəldi.` },
        { id:"2.3", heading:"Sosial sinif və qulluq",
          text:`Peyğəmbər (s.ə.s) buyurmuşdur: "İnsanlar Adəmin övladlarıdfır. Ərəbin Əcəm üzərində heç bir üstünlüyü yoxdur — ancaq təqva ilə" (Müsnəd əl-İmam Əhməd, 23489). Bu hədis Cahiliyyənin sinif quruluşuna açıq-aşkar bir etiraz idi.\n\nCahiliyyə cəmiyyəti üçqatlı piramidd üzərindəydi. Ən yüksəkdə əhrar — azad, soy-kök sahibi insanlar. Ortada mavali — müttəfiqlər, himayə alınanlar. Ən aşağıda əbid — qullar.\n\nCahiliyyənin ən paradoksal siması Əntərə ibn Şəddaddır: anası həbəşli qul olan bu insan Müəllaqat şairlərindən biri idi. Sənəti onu azad etdi; lakin sistem heç vaxt onu tam qəbul etmədi.` },
        { id:"2.4", heading:"Hilful-Fudul: Cahiliyyənin vicdanı",
          text:`Peyğəmbər (s.ə.s) buyurmuşdur: "Cahiliyyə dövründə Hilful-Fudul ittifaqında iştirak etdim; o ittifaqı qırmızı dəvələrlə dəyişməzdim" (Beyhəqi, Sünnənul-Kübra). Bu hədis bir şey deməkdir: haqq Cahiliyyədə də var idi.\n\nMiladi 590-cı ildə Məkkədə bir Yəmənlinin mallarını soyub haqqını verməkdən imtina edən tacirin əhvalatından başlayan bu hadisə şərəfli insanları bir araya gətirdi. And içildi: "Biz Məkkədə zülmə məruz qalan hər kəsin — istər yerli, istər yad — yanında olacağıq."\n\nGənc Məhəmməd (s.ə.s) bu müqaviləyə şahid idi. Bu epizod Cahiliyyənin sadəcə zülmət deyil, vicdan axtarışı içindəki bir dövrün məhsulu olduğunu göstərir.` },
      ]},
    { id:3,romanNum:"III",icon:"🐪",color:C.saffron,
      title:"İqtisadi Həyat, Ticarət və Maliyyə",
      keywords:["dəvə","ticarət","qüreyş","ilaf","ukaz","riba","sələm","bazar"],
      paragraphs:[
        { id:"3.1", heading:"Dəvə: Cahiliyyə iqtisadiyyatının neft ekvivalenti",
          text:`Quran dəvəni bir möcüzə nümunəsi kimi göstərir: "Məgər dəvəyə baxmırlarmı — o necə yaradılıb?" (əl-Ğaşiyə, 88:17). Dəvə ərəb həyatının dayağı idi — iqtisadi, hərbi, sosial.\n\nƏrəbistan yarımadasının iqtisadiyyatı üç sütuna söykənirdi: heyvandarlıq (ilk növbədə dəvə), məhdud kənd təsərrüfatı (vahələrdə xurma, arpa, üzüm) və transit ticarət.\n\nPhilip Hitti (History of the Arabs, 1937) qeyd edir ki, dəvənin Ərəbistanda oynadığı rol Mesopotamiyada suyun roluna bənzəyir: o olmadan bütün iqtisadi sistem çökür. Yoxsulluq qorxusu — öz övladlarını öldürməyə qədər gedən dəhşətli psixoloji vəziyyət — birbaşa bu kövrək iqtisadi strukturla bağlıdır.` },
        { id:"3.2", heading:"Qüreyş və ticarət diplomatiyası: İlaf sistemi",
          text:`Allah Quranda bu sistemi təsdiqləyir: "Qüreyşin ilfı — yay və qış səfərləri üçün olan ilfı — üçün" (əl-Qüreyş, 106:1–2). Bu surə Cahiliyyə iqtisadiyyatının ən mühüm mexanizminə — Qüreyşin ticarət diplomatiyasına — işarə edir.\n\nQüreyş müxtəlif tayfalarla ikitərəfli müqavilələr bağlayırdı: "Biz karvanlarımızı sizin ərazinizdən keçiririk; müqabilində sizə qoruma, ticarət imtiyazı veririk." Bu sistem sayəsində Məkkə karvanları Yəmənə (qış) və Şama (yay) etibarlı şəkildə gedib gəlirdi.\n\nBu mexanizm yalnız iqtisadi deyil, dərin siyasi bir qurğu idi. Din, ticarət və siyasət Cahiliyyədə ayrılmaz üçlük idi.` },
        { id:"3.3", heading:"Əsvaq: bazardan sivilizasiyaya",
          text:`Həcc mövsümündəki üç böyük bazar — Ukaz, Məcənnə və Zil-Məcaz — Ərəbistanın hər guşəsindən insan axışı görürdü. Lakin bu bazarlar əmtəə mübadiləsindən çox daha artığı idi.\n\nUkaz bazarı ərəb dünyasının yeganə açıq tribunası idi: şairlər burada öz şeirlərini oxuyur, natiqlar xitabət yarışına girirdi; tayfalar arasındakı hüquqi mübahisələr həll olunurdu.\n\nƏn mühüm mədəni fenomen isə budur: ən gözəl şeirlər ipək üzərinə qızıl hərflərlə yazılaraq Kəbənin divarına asılırdı — buna görə onlara "Müəllaqat" — asılmışlar — deyilirdi. Bu adət Cahiliyyənin sözə verdiyi ehtiramın ən yüksək simvolu idi.` },
        { id:"3.4", heading:"Riba: sələmin sosioloji anatomiyası",
          text:`Quranın ən güclü iqtisadi bəyannamələrindən biri: "Allah alış-verişi halal, ribası isə haram etmişdir" (əl-Bəqərə, 2:275). Bu qadağanın arxasında Cahiliyyənin maliyyə sisteminin dəhşətli tarixi dayanır.\n\n"Nəsiə" — vaxtında ödənilməmiş borcun müddəti uzadılarkən üzərinə faiz əlavə edilməsi — Cahiliyyə maliyyəsinin əsas mexanizmi idi. Borclu ödəyə bilmərsə borc iki dəfəsinə çıxır; nəhayət insan öz uşaqlarını, öz azadlığını itirirdi.\n\nPeyğəmbər (s.ə.s) vida xütbəsindəki tarixi elanı: "Cahiliyyənin bütün riba borclara qoyulur. İlk olaraq əmim Abbas ibn Abdülmüttəlibin ribasını ayaqlarımın altına alıram" (Müslim, Həcc kitabı, 147).` },
      ]},
    { id:4,romanNum:"IV",icon:"🕌",color:"#7B4A8A",
      title:"İnanc Sferası, Politeizm və Monoteist Axınlar",
      keywords:["hubəl","lat","uzza","mənat","büt","kəbə","kahin","həniflər","zeyd","varaka"],
      paragraphs:[
        { id:"4.1", heading:"Ərəb panteonunun anatomiyası",
          text:`Quran ərəb bütpərəstliyinin özəyini bir sualda ortaya qoyur: "Bunlar Allahın qızları Lat, Uzza və üçüncüsü Mənat deyilmi?" (ən-Nəcm, 53:19–20) — ardından bu iddiaya kəskin rədd gəlir.\n\nCahiliyyə panteonunun başında Hubəl dururdu — Kəbənin içindəki qırmızı əqiq daşdan yonulmuş əsas büt. Lat Taif şəhərinin, Uzza Nəxlə vadisinin, Mənat isə Müşəlləl yaxınlığının tanrıçaları idi — hər biri müəyyən tayfaların ilahi kimliyinin daşıyıcısı.\n\nBütün siyasi önəmi müstəsnadır: büt yalnız dini simvol deyil, tayfa identifikasiya markeri idi. Bütü sındırmaq yalnız dini deyil — bir tayfanın kimliyinə, şərəfinə hücum demək idi.` },
        { id:"4.2", heading:"Kəbə: müqəddəs məkan, siyasi mərkəz, ticarət qovşağı",
          text:`Quran Kəbənin quruluşunu İbrahimə (ə.s) nisbət edir: "Xatırla ki, İbrahim ile İsmail Evin — Kəbənin — təməllərini qaldırırdılar" (əl-Bəqərə, 2:127). Bu tarixi yaddaş Cahiliyyə dövründə hər zaman aktual idi.\n\nHaram aylar — Zülqadə, Zülhiccə, Məhərrəm, Rəcəb — müharibəyə qadağa qoyulduğu dövr idi. Bu müqəddəs sülh müddətinin nüfuzu o qədər güclü idi ki, qan düşmənləri belə bu aylarda silah buraxırdı.\n\nQüreyş bu müqəddəsliyi ustalıqla ticarətin xidmətinə vermişdi. Kəbənin ətrafında 360 büt var idi — hər tayfanın öz büdünü burada saxlaması mümkün idi.` },
        { id:"4.3", heading:"Kahinlər, fal oxları və cinlər",
          text:`Quran kahinlərə münasibətini açıq bildirir: "sən kahin deyilsən" (ət-Tur, 52:29). Bu müqayisə o dövrün mənəvi mühitini anlamaq üçün vacibdir.\n\nKahinlər (kühhan) Cahiliyyənin saxta "peyğəmbərləri" idilər. Söylədikləri qəliz, qafiyəli nəsr — "səc" — mənası dumanlı, çox mənalı bir janr idi. Fal oxları (əzlam) qərar vermənin mexaniki forması idi.\n\nQuran bu adəti kəskin şəkildə rədd edir: "Fal oxları ilə pay bölmək... şeytanın əməlidir" (əl-Maidə, 5:90). Bu qadağanın nə qədər dərin sosial dəyişiklik demək olduğunu Cahiliyyənin metafizik dünyagörüşünü dərk etmədən anlamaq mümkün deyil.` },
        { id:"4.4", heading:"Həniflər: tövhidin intuitiv axtarışçıları",
          text:`Quran tövhidin fitrətə köklənmiş bir həqiqət olduğunu bildirir: "Allahın insanları üzərində yaratdığı fitrəti — dini" (ər-Rum, 30:30). Həniflər bu fitrətin Cahiliyyə içindəki canlı şahidləriydi.\n\nZeyd ibn Əmr ibn Nüfeyl nə yəhudi, nə xristian, nə müşrik olan bir insandı. Buxari rəvayət edir ki, o "Allahım, sənə layiqincə ibadət etməyi istərdim, amma yolunu bilmirəm" — deyərdi (Buxari, Müsənd).\n\nVaraka ibn Nöfəl — Xədicənin əmisi oğlu — xristianlığı qəbul etmiş, İncili Ərəbcəyə çevirmişdi. İlk vəhyin dəhşəti içindəki Peyğəmbərə (s.ə.s) "Bu gələn Musaya enən böyük namusdu" deyən məhz o idi (Buxari, Vəhy kitabı, 3).` },
      ]},
    { id:5,romanNum:"V",icon:"👁️",color:"#8B3A3A",
      title:"Ailə, Qadın və Cahiliyyə Sosiologiyası",
      keywords:["qadın","miras","nikah","vədul-bənat","müruvvə","kərəm","xədicə","əxlaq"],
      paragraphs:[
        { id:"5.1", heading:"Cahiliyyədə qadın: ziddiyyətin portretləri",
          text:`Quranın gətirdiyi ən inqilabi dəyişikliklərdən biri miras hüququnda idi: "Kişilərə valideynin və yaxınların buraxdığından pay var; qadınlara da valideynin və yaxınların buraxdığından pay var" (ən-Nisa, 4:7). Bu ayə sadə bir hüquqi norma deyil — bütöv bir sosial nizamın dönüş nöqtəsidir.\n\nBir tərəfdən Xədicə bint Xüveylid kimi güclü, müstəqil qadınlar var idi. Öbür tərəfdən qadın ərin ölümündən sonra keçmiş ailənin "mülkü" kimi miras biçilirdi.\n\nİslam bu mənzərəni kökündən dəyişdi; lakin bu dəyişikliyin nə qədər böyük olduğunu anlamaq üçün əvvəlcə onun əvəzini bilmək lazımdır.` },
        { id:"5.2", heading:"Vədul-bənat: tarixi, Qurani mövqe, sosiologiyası",
          text:`Quran qiyamət günü bu suala cavab axtarır: "Diri-diri basdırılmış qız uşağına soruşulduqda — o hansı günaha görə öldürüldü?" (ət-Təkvir, 81:8–9). Bu ayələr tarixi ağrını ölümsüzləşdirir.\n\nVədul-bənat Quranın iki ayrı ayədə birbaşa qınadığı bir gerçəklikdir (əl-Nəhl, 16:58–59; ət-Təkvir, 81:8–9). Nabia Abbott bu adətin müəyyən iqtisadi çöküş dövrlərında daha çox baş verdiyini qeyd edir.\n\nƏsas motivlər üç qütbdə toplanır: iqtisadi, siyasi-hərbi, namus-şərəf. Quranın bu zülmə müdaxiləsi — "hansı günaha görə öldürüldü?" sualı — bəşər tarixinin ən güclü hüquq müdafiəsi bəyannamələrindən biridir.` },
        { id:"5.3", heading:"Müruvvə: Cahiliyyənin əxlaq kodeksi",
          text:`Peyğəmbər (s.ə.s) buyurmuşdur: "Mən yalnız əxlaqı tamamlamaq üçün göndərildim" (Muvatta, İmam Malik, Həsnul-Xülq 8). Bu hədis çox vacib bir həqiqəti ehtiva edir: İslam mövcud insani dəyərləri ilahi əsasa oturtdu.\n\nMüruvvə — "insanlıq" kökündən — Cahiliyyə cəmiyyətinin əxlaq kodeksinin çəkirdəyi idi: kərəm (əliaçıqlıq), şücaət (cəsarət), vəfa (sözə sadiqlik), diyafə (qonaqpərvərlik).\n\nLakin eyni cəmiyyətdə qumar (maysir), şərab (xəmr), intiqam odu, vədul-bənat var idi. Quranın bəyanı: "Şərab və qumar haqqında — ikisinde də böyük günah var; insanlara bəzi faydaları da var. Lakin günahları faydasından böyükdür" (əl-Bəqərə, 2:219).` },
      ]},
    { id:6,romanNum:"VI",icon:"📜",color:C.lapisLight,
      title:"Dil, Şeir və Cahiliyyə Ədəbiyyatı",
      keywords:["şeir","müəllaqat","imruul-qeys","əntərə","zuhayr","xitabət","quss","dil"],
      paragraphs:[
        { id:"6.1", heading:"Sözün gücü: şair — diplomat, strateq, media",
          text:`Quranın ərəb şairlərinə münasibəti mürəkkəbdir: "Şairlərə isə azğınlar uyar" (əş-Şüəra, 26:224) — lakin dərhal sonra iman gətirib saleh əməl işləyən şairləri istisna tutur. Bu ayrım Cahiliyyə şeirinin nə qədər böyük ictimai güc olduğunu etiraf edir.\n\nCahiliyyə cəmiyyətində şair yalnız sənətkar deyildi — həm jurnalist, həm diplomat, həm psixoloji hərb ustası, həm tarixi yaddaşın keşikçisi idi.\n\nPeyğəmbər (s.ə.s) buyurmuşdur: "Şeirin bir hissəsi hikmətdir" (Buxari, Ədəb kitabı, 90). Yeni şair yetişəndə qonşu tayfalar təbrik üçün gəlirdi — bu, tayfanın söz silahının gücləndiyi demək idi.` },
        { id:"6.2", heading:"Müəllaqat: yeddi asılmış qəsidənin dünyası",
          text:`Müəllaqat — qızıl hərflərlə yazılıb Kəbənin divarına asılan yeddi böyük qəsidə — Cahiliyyənin estetik zirvəsidir. Reynold Nicholson (A Literary History of the Arabs, 1907) bu qəsidələri "ilk əsrdə yazılmış ən mükəmməl lirik şeir" kimi xarakterizə edir.\n\nİmruul-Qeys sevginin melanxoliyasını; Zuhayr ibn Əbi Süllma həyatın hikmətini; Əntərə ibn Şəddad — anası həbəşli qul olan bu döyüşçü şair — sevgi ilə müharibəni bir arada tərənnüm edir.\n\nBu şeirlər mədəniyyətin ən dərin nəbzini tutur. Cahiliyyə şairi yalnız yaratmırdı — o, toplumun vicdanı, yaddaşı, siyasəti idi.` },
        { id:"6.3", heading:"Nəsr, xitabət və Quss ibn Saidənin mirası",
          text:`Peyğəmbər (s.ə.s) Ukaz bazarındakı bir xitabı xatırlayaraq demişdir: "Qussun sözlərinin bir hissəsini oxuya bilmirəm, amma onlar hüzurumda olanda sevinirəm" (Bəyhəqi, Dəlailun-Nübuvvə).\n\nQuss ibn Saidə əl-İyadi Peyğəmbərin gənclik illərindəki ən məşhur ərəb natiqi idi. Onun xütbəsindən qalan parçalar ərəb nəsrinin ilk kamil nümunələridir: "Ey insanlar, gəlin, dinləyin; dinlədiyinizdə anlayın; anladıqda isə iş görün. Hər yaşayan ölür, hər yeni köhnəlir..."\n\nNəsrin yanı sıra atalar sözləri (əmsəl) şifahi ənənənin ən geniş yayılmış janrı idi: yığcam, kəskin, zəngin metaforalarla dolu.` },
        { id:"6.4", heading:"Dilin unifikasiyası: Quranın dil möcüzəsinin tarixi zəmini",
          text:`Quran özünü açıq bir dildə nazil olmuş kimi təqdim edir: "Biz onu ərəbcə bir Quran olaraq endirdik ki, anlayasınız" (Yusuf, 12:2). Bu "ərəbcə" ifadəsi Cahiliyyənin dil tarixi baxımından müstəsna əhəmiyyət daşıyır.\n\nVI əsrin sonlarında Ərəbistan yarımadasında bir neçə onlarla ərəb dialekti mövcud idi. Lakin ticarət yolları, bazarlar — xüsusən Ukaz — və şeir müsabiqələri zamanla ortaq bir ədəbi dil yaradırdı.\n\nToshihiko Izutsu (God and Man in the Koran) qeyd edir ki, Quranın nazil olduğu vaxt artıq Ərəbistanda ortaq bir ədəbi ərəbcə mövcud idi. Cahiliyyə şairləri bu dili qurdu; Quran onu əbədiləşdirdi.` },
      ]},
  ]
};

const TABS = [
  { id:"home",     label:"Ana Səhifə",  icon:"🏠" },
  { id:"lessons",  label:"Bölmələr",    icon:"📚" },
  { id:"search",   label:"Axtarış",     icon:"🔍" },
  { id:"bookmarks",label:"Əlfəcinlər",  icon:"🔖" },
  { id:"quiz",     label:"Quiz",        icon:"🎯" },
  { id:"daily",    label:"Günün Kartı", icon:"🎴" },
];

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("normal");
  const [screen, setScreen] = useState("hero"); // Default: Hero screen from your beautiful blue screenshot!
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);

  const th = THEMES[theme as keyof typeof THEMES] || THEMES.dark;
  const fs = FONT_SIZES[fontSize as keyof typeof FONT_SIZES] || FONT_SIZES.normal;

  const navigate = (scr: string) => {
    setScreen(scr);
    const matchedTab = TABS.find(t => t.id === scr);
    if (matchedTab) setActiveTab(matchedTab.id);
  };

  const goLesson = (lessonObj: any, pIdx=0) => {
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

  const hideTab = screen === "reading" || screen === "hero";

  return (
    <div style={{ minHeight:"100vh", backgroundColor:th.bg, color:th.text, fontSize:`${16 * fs}px`, fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column", position:"relative" }}>
      
      {/* HEADER BAR */}
      {screen !== "hero" && (
        <div style={{ position:"sticky", top:0, background:th.navBg, backdropFilter:"blur(12px)", borderBottom:`1px solid ${th.border}`, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", zIndex:100 }}>
          <span style={{ fontFamily:"Georgia, serif", fontWeight:"bold", color:C.saffron }}>{LESSON.title}</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => setTheme(t => t==="dark"?"light":t==="light"?"sepia":"dark")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18 }}>🎨</button>
            <button onClick={() => setFontSize(s => s==="normal"?"large":s==="large"?"small":"normal")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18 }}>📝</button>
          </div>
        </div>
      )}

      {/* RENDER SCREENS DYNAMICALLY */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", width:"100%", maxWidth:680, margin:"0 auto", paddingBottom: hideTab ? 30 : 90 }}>
        {screen === "hero"        && <HeroScreen onStart={() => navigate("home")} />}
        {screen === "home"        && <HomeScreen onGo={goLesson} onNav={navigate} th={th} />}
        {screen === "lessons"     && <LessonsScreen onGo={goLesson} th={th} />}
        {screen === "search"      && <SearchScreen onGo={goLesson} th={th} />}
        {screen === "bookmarks"   && <BookmarksScreen onBack={() => navigate("home")} bookmarks={bookmarks} onRemove={i => setBookmarks(b => b.filter((_,idx) => idx!==i))} onGoLesson={goLesson} th={th} />}
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
      {!hideTab && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:680, background:th.navBg, backdropFilter:"blur(14px)", borderTop:`1px solid ${C.saffron}20`, display:"flex", zIndex:200 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => navigate(t.id)} style={{ flex:1, border:"none", background:"none", cursor:"pointer", padding:"10px 0 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:20, filter:activeTab===t.id ? "none" : "grayscale(1) opacity(0.45)" }}>{t.icon}</span>
              <span style={{ fontSize:9, color:activeTab===t.id ? C.saffron : th.textSub, fontWeight:activeTab===t.id ? "bold":"normal" }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 1. ORIGINAL BLUE HERO SCREEN
// ==========================================
function HeroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", justifyContent:"center", padding:"40px 20px", backgroundColor:C.obsidian, minHeight:"100vh" }}>
      <span style={{ fontSize:11, color:C.ash, letterSpacing:2, textTransform:"uppercase", fontWeight:"600", marginBottom:12 }}>DƏRS MATERİALI</span>
      <h1 style={{ fontSize:56, color:C.saffron, fontFamily:"Georgia, serif", margin:"0 0 5px 0", fontWeight:"normal" }}>{LESSON.arabicTitle}</h1>
      <h2 style={{ fontSize:34, fontWeight:"bold", letterSpacing:0.5, margin:"0 0 15px 0", color:"#FFFFFF" }}>{LESSON.title}</h2>
      <p style={{ fontSize:14, color:C.ash, lineHeight:1.6, maxWidth:320, margin:"0 0 25px 0" }}>{LESSON.subtitle}</p>
      <div style={{ border:`1px solid rgba(201, 136, 42, 0.25)`, borderRadius:20, padding:"8px 22px", fontSize:12, color:C.saffron, backgroundColor:"rgba(201, 136, 42, 0.04)", marginBottom:40 }}>{LESSON.coverTag}</div>
      
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", width:"100%", maxWidth:340, gap:15, marginBottom:45 }}>
        <div><b style={{ fontSize:30, color:C.saffron, display:"block", fontFamily:"Georgia" }}>{LESSON.sections.length}</b><span style={{ fontSize:12, color:C.ash }}>Hissə</span></div>
        <div><b style={{ fontSize:30, color:C.saffron, display:"block", fontFamily:"Georgia" }}>24</b><span style={{ fontSize:12, color:C.ash }}>Paraqraf</span></div>
        <div><b style={{ fontSize:30, color:C.saffron, display:"block", fontFamily:"Georgia" }}>17</b><span style={{ fontSize:12, color:C.ash }}>Mənbə</span></div>
      </div>
      
      <button onClick={onStart} style={{ width:"100%", maxWidth:340, backgroundColor:C.saffron, color:C.obsidian, border:"none", padding:"16px", borderRadius:14, fontSize:15, fontWeight:"bold", cursor:"pointer", boxShadow:"0 6px 20px rgba(201, 136, 42, 0.25)" }}>Oxumağa Başla ➔</button>
    </div>
  );
}

// ==========================================
// 2. HOME SCREEN
// ==========================================
function HomeScreen({ onGo, onNav, th }: any) {
  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ padding:20, borderRadius:16, background:th.bgAlt, border:`1px solid ${th.border}` }}>
        <h3 style={{ margin:"0 0 10px 0", color:C.saffron }}>Xoş Gəlmisiniz!</h3>
        <p style={{ margin:0, fontSize:14, lineHeight:1.5, color:th.textSub }}>{LESSON.intro}</p>
      </div>

      <h4 style={{ margin:0, fontWeight:"bold" }}>Əsas Mövzular</h4>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {LESSON.sections.map(s => (
          <div key={s.id} onClick={() => onGo(s, 0)} style={{ padding:16, borderRadius:14, background:th.card, border:`1px solid ${th.border}`, cursor:"pointer", display:"flex", alignItems:"center", gap:15 }}>
            <span style={{ fontSize:24 }}>{s.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:C.saffron, fontWeight:"bold" }}>HİSSƏ {s.romanNum}</div>
              <div style={{ fontSize:14, fontWeight:"bold", marginTop:2 }}>{s.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. LESSONS CATALOG SCREEN
// ==========================================
function LessonsScreen({ onGo, th }: any) {
  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:15 }}>
      <h3 style={{ margin:0, fontWeight:"bold" }}>Mündəricat</h3>
      {LESSON.sections.map(s => (
        <div key={s.id} style={{ background:th.card, borderRadius:16, border:`1px solid ${th.border}`, padding:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, borderBottom:`1px solid ${th.border}`, paddingBottom:10 }}>
            <span style={{ fontSize:22 }}>{s.icon}</span>
            <h4 style={{ margin:0, fontSize:15, fontWeight:"bold" }}>{s.romanNum}. {s.title}</h4>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {s.paragraphs.map((p, idx) => (
              <div key={p.id} onClick={() => onGo(s, idx)} style={{ padding:10, borderRadius:8, background:th.bgAlt, cursor:"pointer", fontSize:13, display:"flex", justifyContent:"space-between" }}>
                <span>{p.heading}</span>
                <span style={{ color:C.saffron }}>➔</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 4. SEARCH SCREEN
// ==========================================
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
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:15 }}>
      <input 
        type="text" value={q} onChange={e => setQ(e.target.value)} 
        placeholder="Mətndə və ya başlıqlarda axtarın..." 
        style={{ width:"100%", padding:12, borderRadius:12, border:`1px solid ${th.border}`, background:th.card, color:th.text, outline:"none" }} 
      />
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {results.map((r, i) => (
          <div key={i} onClick={() => onGo(r.section, r.pIndex)} style={{ padding:12, borderRadius:10, background:th.card, border:`1px solid ${th.border}`, cursor:"pointer" }}>
            <div style={{ fontSize:11, color:C.saffron }}>{r.section.title}</div>
            <div style={{ fontSize:13, fontWeight:"bold", marginTop:2 }}>{r.heading}</div>
          </div>
        ))}
        {q.trim().length > 1 && results.length === 0 && <div style={{ textAlign:"center", color:th.textSub, fontSize:13 }}>Nəticə tapılmadı.</div>}
      </div>
    </div>
  );
}

// ==========================================
// 5. BOOKMARKS SCREEN
// ==========================================
function BookmarksScreen({ bookmarks, onRemove, onGoLesson, th }: any) {
  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:15 }}>
      <h3 style={{ margin:0, fontWeight:"bold" }}>Qeyd edilənlər</h3>
      {bookmarks.length === 0 ? (
        <div style={{ textAlign:"center", color:th.textSub, padding:40, fontSize:14 }}>Hələ heç bir əlfəcin əlavə edilməyib.</div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {bookmarks.map((b, i) => (
            <div key={i} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:12, padding:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div onClick={() => onGoLesson(b.section, b.pIndex)} style={{ cursor:"pointer", flex:1 }}>
                <span style={{ fontSize:11, color:C.saffron }}>{b.sectionTitle}</span>
                <div style={{ fontSize:13, fontWeight:"bold", marginTop:2 }}>{b.heading}</div>
              </div>
              <button onClick={() => onRemove(i)} style={{ background:"none", border:"none", color:"#EF4444", cursor:"pointer", fontSize:16 }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. QUIZ SCREEN
// ==========================================
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

  const next = () => {
    setSel(null);
    if (idx + 1 < QUIZ_QUESTIONS.length) setIdx(i => i + 1);
    else setDone(true);
  };

  const reset = () => { setIdx(0); setSel(null); setScore(0); setDone(false); };

  if (done) {
    return (
      <div style={{ padding:30, textAlign:"center", display:"flex", flexDirection:"column", gap:20 }}>
        <h2>Quiz Bitdi!</h2>
        <div style={{ fontSize:48 }}>🏆</div>
        <div>Nəticəniz: <b>{score}</b> / {QUIZ_QUESTIONS.length}</div>
        <button onClick={reset} style={{ padding:12, background:C.saffron, border:"none", borderRadius:10, color:"#FFF", fontWeight:"bold", cursor:"pointer" }}>Yenidən Başla</button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[idx];
  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:15 }}>
      <div style={{ fontSize:12, color:C.saffron }}>Sual {idx+1}/{QUIZ_QUESTIONS.length}</div>
      <div style={{ background:th.card, padding:18, borderRadius:14, border:`1px solid ${th.border}`, fontWeight:"bold", fontSize:15, lineHeight:1.5 }}>{q.q}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {q.opts.map((opt, oIdx) => {
          let bg = th.card;
          let border = th.border;
          if (sel !== null) {
            if (oIdx === q.ans) { bg = "rgba(34,197,94,0.15)"; border = "#22C55E"; }
            else if (sel === oIdx) { bg = "rgba(239,68,68,0.15)"; border = "#EF6868"; }
          }
          return (
            <button key={oIdx} onClick={() => handleOpt(oIdx)} style={{ width:"100%", padding:14, borderRadius:10, background:bg, border:`1px solid ${border}`, color:th.text, textAlign:"left", cursor:"pointer", transition:"all 0.2s" }}>{opt}</button>
          );
        })}
      </div>
      {sel !== null && (
        <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ padding:12, background:th.bgAlt, borderRadius:10, fontSize:13, color:th.textSub, lineHeight:1.4 }}>💡 {q.exp}</div>
          <button onClick={next} style={{ padding:12, background:C.saffron, border:"none", borderRadius:10, color:"#FFF", fontWeight:"bold", cursor:"pointer" }}>Növbəti Sual ➔</button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. DAILY CARDS SCREEN
// ==========================================
function DailyCardsScreen({ th }: any) {
  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:15 }}>
      <h3 style={{ margin:0, fontWeight:"bold" }}>Günün Kartları</h3>
      {DAILY_CARDS.map((c, i) => (
        <div key={i} style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:16, padding:18, display:"flex", flexDirection:"column", gap:10 }}>
          <span style={{ fontSize:10, padding:"3px 8px", background:c.type==="ayah"?"rgba(74,123,111,0.15)":"rgba(201,136,42,0.15)", color:c.type==="ayah"?C.sage:C.saffron, borderRadius:10, alignSelf:"flex-start", fontWeight:"bold", textTransform:"uppercase" }}>{c.type}</span>
          <div style={{ fontSize:20, direction:"rtl", textAlign:"right", fontFamily:"Georgia", color:th.text, margin:"5px 0" }}>{c.arabic}</div>
          <div style={{ fontSize:14, fontWeight:"500", lineHeight:1.4 }}>{c.text}</div>
          <div style={{ fontSize:11, color:th.textSub, textAlign:"right" }}>— {c.ref}</div>
          <div style={{ fontSize:12, background:th.bgAlt, padding:10, borderRadius:8, color:th.textSub, borderLeft:`3px solid ${C.saffron}` }}>{c.note}</div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 8. PARAGRAPH-BY-PARAGRAPH READING SCREEN
// ==========================================
function ReadingScreen({ section, pIndex, setOuterPIndex, onBack, bookmarks, onToggleBookmark, th }: any) {
  const p = section.paragraphs[pIndex];
  const isBookmarked = bookmarks.some((x: any) => x.pId === p.id);

  const prev = () => pIndex > 0 && setOuterPIndex(pIndex - 1);
  const next = () => pIndex + 1 < section.paragraphs.length && setOuterPIndex(pIndex + 1);

  return (
    <div style={{ padding:20, display:"flex", flexDirection:"column", gap:15, flex:1 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.saffron, cursor:"pointer", fontSize:14 }}>← Geri</button>
        <span style={{ fontSize:12, color:th.textSub }}>{section.romanNum} / Səhifə {pIndex + 1}</span>
        <button onClick={() => onToggleBookmark({ pId:p.id, section, pIndex, heading:p.heading, sectionTitle:section.title })} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18 }}>{isBookmarked ? "🔖" : "🕭"}</button>
      </div>

      <h3 style={{ margin:"10px 0 5px 0", fontSize:18, fontWeight:"bold", color:C.saffron }}>{p.heading}</h3>
      
      <div style={{ background:th.card, border:`1px solid ${th.border}`, borderRadius:18, padding:22, lineHeight:1.7, fontSize:15, textAlign:"justify", flex:1, whiteSpace:"pre-line" }}>
        {p.text}
      </div>

      {/* NAVIGATION BUTTONS */}
      <div style={{ display:"flex", gap:12, marginTop:10 }}>
        <button onClick={prev} disabled={pIndex === 0} style={{ flex:1, padding:14, borderRadius:12, border:`1px solid ${th.border}`, background: th.card, color: pIndex===0?th.textSub:th.text, opacity:pIndex===0?0.5:1, cursor:pIndex===0?"not-allowed":"pointer", fontWeight:"bold" }}>◀ Əvvəlki</button>
        <button onClick={next} disabled={pIndex + 1 === section.paragraphs.length} style={{ flex:1, padding:14, borderRadius:12, background: pIndex+1===section.paragraphs.length?th.card:C.saffron, border: pIndex+1===section.paragraphs.length?`1px solid ${th.border}`:"none", color: pIndex+1===section.paragraphs.length?th.textSub:C.obsidian, opacity:pIndex+1===section.paragraphs.length?0.5:1, cursor:pIndex+1===section.paragraphs.length?"not-allowed":"pointer", fontWeight:"bold" }}>Növbəti ▶</button>
      </div>
    </div>
  );
}