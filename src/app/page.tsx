import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1A1208] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <p className="text-[#C8A96E]/60 text-2xl mb-4" style={{fontFamily:"serif"}}>الجاهلية</p>
        <h1 className="text-5xl font-bold text-[#C8A96E] mb-4">Cahiliyyə</h1>
        <p className="text-[#5C4A2A] text-lg mb-12">
          İslamdan əvvəlki Ərəbistanın tarixini, cəmiyyətini və mədəniyyətini öyrənin
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Link href="/dashboard/quiz" className="card hover:border-[#C8A96E]/50 transition-all text-center block">
            <div className="text-3xl mb-2">🧠</div>
            <h3 className="font-bold text-[#F5EDD8]">Bilik Testi</h3>
            <p className="text-[#5C4A2A] text-sm mt-1">6 kateqoriya, 3 səviyyə</p>
          </Link>
          <Link href="/dashboard/chat" className="card hover:border-[#C8A96E]/50 transition-all text-center block">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-[#F5EDD8]">AI Müəllim</h3>
            <p className="text-[#5C4A2A] text-sm mt-1">Gemini ilə söhbət</p>
          </Link>
          <Link href="/dashboard/library" className="card hover:border-[#C8A96E]/50 transition-all text-center block">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold text-[#F5EDD8]">Kitabxana</h3>
            <p className="text-[#5C4A2A] text-sm mt-1">Dərin məqalələr</p>
          </Link>
        </div>

        <p className="text-[#C8A96E]/40 text-xl" style={{fontFamily:"serif"}}>
          بسم الله الرحمن الرحيم
        </p>
      </div>
    </div>
  );
}
