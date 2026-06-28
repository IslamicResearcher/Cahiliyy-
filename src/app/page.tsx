import { useState, useRef, useEffect, useCallback } from "react";

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
  { type:"ayah",  arabic:"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ", text:"Məgər onlar Quranı düşünüb anlamırlarmı?", ref:"Məhəmməd, 47:24", note:"Quranın məqsədi oxumaq deyil — düşünmək, anlamaq, tətbiq etməkdir." },
  { type:"hadith",arabic:"إِنَّمَا بُعِثْتُ لِأُتَمِّمَ مَكارِمَ الْأَخْلَاقِ", text:"Mən yalnız əxlaqı tamamlamaq üçün göndərildim.", ref:"Muvatta, İmam Malik: Həsnul-Xülq 8", note:"İslam mövcud insani dəyərləri ilahi əsasa oturtdu." },
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
          text:`Quran nazil olduğu ilk illərdə Bizans-Sasani müharibəsi davam edirdi: "Rum məğlub edildi — ən yaxın bir yerdə. Lakin onlar bu məğlubiyyətin ardından qalib gələcəklər" (ər-Rum, 30:2–3). Bu peyğəmbərlik müsəlmanların geopolitik şüurunun nə qədər yüksək olduğunu göstərir.\n\nVI əsrin sonlarında Ərəbistan iki super güc arasında sıxışmışdı. Bizans qərb cəbhəsini tutmuş, Sasani ise şərqdən təsirini göstərirdi. Hər iki güc ərəb vassal dövlətlərindən istifadə edirdi: Ləhmilər Sasanilərin, Qəssanilər isə Bizansın tampon dövlətləri idi.\n\nBu geopolitik çərçivə ərəb tayfalarını böldü, lakin eyni zamanda diplomatik manevr sahəsi açdı. Qüreyşin ticarəti hər iki imperiya ərazisindən keçən yollardan asılı idi — bu asılılıq isə siyasi neytralitetin iqtisadi vacibliyi mənasına gəlirdi.` },
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
          text:`Peyğəmbər (s.ə.s) buyurmuşdur: "İnsanlar Adəmin övladlarıdır. Ərəbin Əcəm üzərində heç bir üstünlüyü yoxdur — ancaq təqva ilə" (Müsnəd əl-İmam Əhməd, 23489). Bu hədis Cahiliyyənin sinif quruluşuna açıq-aşkar bir etiraz idi.\n\nCahiliyyə cəmiyyəti üçqatlı piramidd üzərindəydi. Ən yüksəkdə əhrar — azad, soy-kök sahibi insanlar. Ortada mavali — müttəfiqlər, himayə alınanlar. Ən aşağıda əbid — qullar.\n\nCahiliyyənin ən paradoksal siması Əntərə ibn Şəddaddır: anası həbəşli qul olan bu insan Müəllaqat şairlərindən biri idi. Sənəti onu azad etdi; lakin sistem heç vaxt onu tam qəbul etmədi.` },
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
          text:`Allah Quranda bu sistemi təsdiqləyir: "Qüreyşin ilfı — yay və qış səfərləri üçün olan ilfı — üçün" (əl-Qüreyş, 106:1–2). Bu surə Cahiliyyə iqtisadiyyatının ən mühüm mexanizminə — Qüreyşin ticarət diplomatiyasına — işarə edir.\n\nQüreyş müxtəlif tayfalarla ikitərəfli müqavilələr bağlayırdı: "Biz karvanlarımızı sizin ərazinizdən keçiririk; müqabilində sizə qoruma, ticarət imtiyazı veririk." East sistemi sayəsində Məkkə karvanları Yəmənə (qış) və Şama (yay) etibarlı şəkildə gedib gəlirdi.\n\nBu mexanizm yalnız iqtisadi deyil, dərin siyasi bir qurğu idi. Din, ticarət və siyasət Cahiliyyədə ayrılmaz üçlük idi.` },
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
          text:`Quran Kəbənin quruluşunu İbrahimə (ə.s) nisbət edir: "Xatırla ki, İbrahim ilə İsmail Evin — Kəbənin — təməllərini qaldırırdılar" (əl-Bəqərə, 2:127). Bu tarixi yaddaş Cahiliyyə dövründə hər zaman aktual idi.\n\nHaram aylar — Zülqadə, Zülhiccə, Məhərrəm, Rəcəb — müharibəyə qadağa qoyulduğu dövr idi. Bu müqəddəs sülh müddətinin nüfuzu o qədər güclü idi ki, qan düşmənləri belə bu aylarda silah buraxırdı.\n\nQüreyş bu müqəddəsliyi ustalıqla ticarətin xidmətinə vermişdi. Kəbənin ətrafında 360 büt var idi — hər tayfanın öz büdünü burada saxlaması mümkün idi.` },
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
          text:`Peyğəmbər (s.ə.s) Ukaz bazarındakı bir xitabı xatırlayaraq demişdir: "Qussun sözlərinin bir hissəsini oxuya bilmirəm, amma oni hüzurumda olanda sevinirəm" (Bəyhəqi, Dəlailun-Nübuvvə).\n\nQuss ibn Saidə əl-İyadi Peyğəmbərin gənclik illərindəki ən məşhur ərəb natiqi idi. Onun xütbəsindən qalan parçalar ərəb nəsrinin ilk kamil nümunələdir: "Ey insanlar, gəlin, dinləyin; dinlədiyinizdə anlayın; anladıqda isə iş görün. Hər yaşayan ölür, hər yeni köhnəlir..."\n\nNəsrin yanı sıra atalar sözləri (əmsəl) şifahi ənənənin ən geniş yayılmış janrı idi: yığcam, kəskin, zəngin metaforalarla dolu.` },
        { id:"6.4", heading:"Dilin unifikasiyası: Quranın dil möcüzəsinin tarixi zəmini",
          text:`Quran özünü açıq bir dildə nazil olmuş kimi təqdim edir: "Biz onu ərəbcə bir Quran olaraq endirdik ki, anlayasınız" (Yusuf, 12:2). Bu "ərəbcə" ifadəsi Cahiliyyənin dil tarixi baxımından müstəsna əhəmiyyət daşıyır.\n\nVI əsrin sonlarında Ərəbistan yarımadasında bir neçə onlarla ərəb dialekti mövcud idi. Lakin ticarət yolları, bazarlar — xüsusən Ukaz — və şeir müsabiqələri zamanla ortaq bir ədəbi dil yaradırdı.\n\nToshihiko Izutsu (God and Man in the Koran) qeyd edir ki, Quranın nazil olduğu vaxt artıq Ərəbistanda ortaq bir ədəbi ərəbcə mövcud idi. Cahiliyyə şairləri bu dili qurdu; Quran onu əbədiləşdirdi.` },
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

export default function App() {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("normal");
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [bookmarks, setBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParagraphId, setSelectedParagraphId] = useState(null);
  const [geminiKey, setGeminiKey] = useState("");

  // Chat States
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const mainRef = useRef(null);

  const th = THEMES[theme];
  const fontSizeMultiplier = FONT_SIZES[fontSize];

  // Load Settings from LocalStorage
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

  const saveToLocal = (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
  };

  const toggleBookmark = (id, heading) => {
    let updated;
    const exists = bookmarks.find(b => b.id === id);
    if (exists) {
      updated = bookmarks.filter(b => b.id !== id);
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

  const navigate = (tabId) => {
    setActiveTab(tabId);
    setScreen(tabId);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const goLesson = (pId) => {
    setSelectedParagraphId(pId);
    navigate("home");
    setTimeout(() => {
      const el = document.getElementById(`p-${pId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  return (
    <div style={{ minHeight:"100vh", backgroundColor:th.bg, color:th.text, fontFamily:"'Georgia', serif", transition:"background 0.3s, color 0.3s", display:"flex", flexDirection:"column", alignItems:"center" }}>
      
      {/* HEADER */}
      <header style={{ width:"100%", maxWidth:680, padding:"20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${th.border}`, position:"sticky", top:0, background:th.bg, zIndex:100 }}>
        <div>
          <span style={{ fontSize:12, color:C.saffron, fontWeight:"bold", letterSpacing:1.5 }}>{LESSON.arabicTitle}</span>
          <h1 style={{ margin:0, fontSize:22, fontWeight:"bold" }}>{LESSON.title}</h1>
        </div>
        
        {/* SETTINGS CONTROL */}
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

      {/* MAIN LAYOUT */}
      <main ref={mainRef} style={{ width:"100%", maxWidth:680, padding:"20px 20px 100px 20px", flex:1, overflowY:"auto" }}>
        
        {/* SCREEN: HOME (LESSON CONTENT) */}
        {screen === "home" && (
          <div>
            <div style={{ textAlign:"center", padding:"20px 0", borderBottom:`1px solid ${th.border}`, marginBottom:25 }}>
              <span style={{ fontSize:11, background:C.saffron+"20", color:C.saffron, padding:"4px 10px", borderRadius:20, fontWeight:"bold" }}>{LESSON.coverTag}</span>
              <p style={{ fontStyle:"italic", color:th.textSub, marginTop:15, fontSize:15 * fontSizeMultiplier, lineHeight:1.6 }}>{LESSON.intro}</p>
            </div>

            {/* SEARCH */}
            <div style={{ marginBottom:25 }}>
              <input type="text" placeholder="Mətndə açar söz ara..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{ width:"100%", padding:"12px 15px", borderRadius:10, border:`1px solid ${th.border}`, background:th.card, color:th.text, fontSize:14 }} />
            </div>

            {/* SECTIONS */}
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
                    const isBookmarked = bookmarks.some(b => b.id === p.id);
                    return (
                      <div key={p.id} id={`p-${p.id}`} style={{ background:th.card, padding:20, borderRadius:12, marginBottom:15, border:`1px solid ${selectedParagraphId === p.id ? C.saffron : th.border}`, boxShadow:"0 2px 8px rgba(0,0,0,0.02)", position:"relative" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <h3 style={{ margin:0, fontSize:16 * fontSizeMultiplier, fontWeight:"bold", color:C.saffron }}>{p.heading}</h3>
                          <button onClick={() => toggleBookmark(p.id, p.heading)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:isBookmarked?C.saffron:th.textSub }}>{isBookmarked?"🔖":"Outline🔖"}</button>
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

        {/* SCREEN: Q&A CHAT */}
        {screen === "qa" && (
          <div style={{ display:"flex", flexDirection:"column", height:"65vh" }}>
            <div style={{ flex:1, overflowY:"auto", paddingBottom:15, display:"flex", flexDirection:"column", gap:12 }}>
              {messages.length === 0 && (
                <div style={{ textAlign:"center", color:th.textSub, marginTop:40, padding:20 }}>
                  <h3>💬 Cahiliyyə Dövrü Süni İntellekt Köməkçisi</h3>
                  <p style={{ fontSize:14 }}>İslam öncəsi ərəb dünyası, sosiologiyası, cohabiyası və ya ədəbiyyatı barədə istədiyiniz sualı verin.</p>
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

        {/* SCREEN: QUIZ */}
        {screen === "quiz" && <QuizComponent th={th} fs={fontSizeMultiplier} />}

        {/* SCREEN: DAILY CARDS */}
        {screen === "daily" && <DailyCardsComponent th={th} fs={fontSizeMultiplier} />}

        {/* SCREEN: BOOKMARKS */}
        {screen === "bookmarks" && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:"bold", marginBottom:20 }}>🔖 Saxlanılan Əlfəcinlər</h2>
            {bookmarks.length === 0 ? (
              <p style={{ color:th.textSub, textAlign:"center", marginTop:40 }}>Hələ heç bir əlfəcin əlavə edilməyib.</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {bookmarks.map(bm => (
                  <div key={bm.id} onClick={() => goLesson(bm.id)} style={{ background:th.card, padding:"15px 20px", borderRadius:10, border:`1px solid ${th.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", transition:"transform 0.2s" }}>
                    <span style={{ fontWeight:"bold", color:C.saffron, fontSize:14 * fontSizeMultiplier }}>{bm.heading}</span>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(bm.id); }} style={{ background:"none", border:"none", color:th.textSub, cursor:"pointer" }}>❌</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER NAVIGATION TABS */}
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

// SUB-COMPONENTS
function QuizComponent({ th, fs }) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const handleOptClick = (idx) => {
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
            <button key={idx} onClick={() => handleOptClick(idx)} style={{ width:"100%", textSide:"left", textAlign:"left", padding:"14px", borderRadius:8, background:bg, border:`1px solid ${border}`, color:th.text, fontSize:14 * fs, cursor:show?"default":"pointer", transition:"all 0.2s" }}>
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

function DailyCardsComponent({ th, fs }) {
  const [idx, setIdx] = useState(0);
  return (
    <div style={{ background:th.card, padding:30, borderRadius:16, border:`1px solid ${th.border}`, textAlign:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.02)", position:"relative" }}>
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