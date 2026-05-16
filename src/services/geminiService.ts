import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenerativeAI(apiKey);

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 2000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      const status = (error as { status?: number })?.status;
      if (status && status !== 503 && status !== 429) throw error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export interface NutritionAnalysis {
  food_analysis: string[];
  estimated_sugar: number;
  estimated_calories: number;
  risk_status: 'Safe' | 'Warning' | 'High';
  recommendation: string[];
}

export async function analyzeIntake(
  input: string,
  dailyTotalSugar: number,
  imageBase64?: string
): Promise<NutritionAnalysis> {
  if (!apiKey) {
    throw new Error(
      'Gemini API Key tidak ditemukan'
    );
  }

  const prompt = `
Kamu adalah asisten nutrisi AI khusus pemantauan gula harian.

Tugas kamu:
- Analisis makanan/minuman yang diinput user via teks DAN/ATAU gambar.
- Jika ada gambar komposisi/label nutrisi, prioritaskan data dari gambar tersebut.
- Jika ada gambar makanan, estimasi porsinya.
- Estimasi kandungan gula (gram) dan kalori.
- Berikan rekomendasi singkat & praktis dalam Bahasa Indonesia.
- Gunakan referensi WHO (maks 25-50g gula/hari).
- User saat ini telah mengonsumsi ${dailyTotalSugar.toFixed(1)}g gula hari ini.

Status Risiko:
- 'Safe'   : Total harian (termasuk input baru) < 25g.
- 'Warning': Total harian 25g hingga 50g.
- 'High'   : Total harian > 50g.

Jika data hanya estimasi, beri catatan di food_analysis.
JANGAN memberikan diagnosa medis.

Input dari user: "${input || 'Analisis apa yang ada di gambar ini.'}"

Jawab HANYA dalam format JSON berikut, tanpa penjelasan tambahan:
{
  "food_analysis": ["analisis item 1", "analisis item 2"],
  "estimated_sugar": 12.5,
  "estimated_calories": 150,
  "risk_status": "Safe",
  "recommendation": ["rekomendasi 1", "rekomendasi 2"]
}
`;

  const contentParts: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [{ text: prompt }];

  if (imageBase64) {
    const [mimeInfo, data] = imageBase64.split(';base64,');
    const mimeType = mimeInfo.split(':')[1];
    contentParts.push({ inlineData: { mimeType, data } });
  }

  try {
    const response = await retryWithBackoff(async () => {
      const model = ai.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: contentParts }],
      });

      return result.response;
    });

    const text = response.text();
    if (!text) throw new Error('Tidak ada respons dari AI.');

    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean) as NutritionAnalysis;
  } catch (error: unknown) {
    console.error('Error analyzing intake:', error);
    const status = (error as { status?: number })?.status;
    if (status === 429) {
      throw new Error('Quota API habis. Silakan coba lagi nanti.');
    }
    throw error;
  }
}