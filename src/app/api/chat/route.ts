import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM = `Sən Cahiliyyə dövrü (İslamdan əvvəlki Ərəbistan, 500-622 m.) üzrə mütəxəssis alimisən. Sualları Azərbaycan dilində cavabla. Qısa, aydın və dəqiq cavablar ver. Mövzu Cahiliyyə tarixi ilə bağlı deyilsə, müvafiq şəkildə yönləndir.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: SYSTEM });
    const chat = model.startChat({
      history: (history || []).map((m: {role: string; content: string}) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });
    const result = await chat.sendMessage(message);
    return NextResponse.json({ reply: result.response.text() });
  } catch (e) {
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}
