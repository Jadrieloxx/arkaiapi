import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST permitido' });

  const { prompt, isJsonMode } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: 'Falta API Key' });

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: isJsonMode ? 'gemini-1.5-pro-latest' : 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    res.status(200).json({ result: text });
  } catch (err) {
    res.status(500).json({ error: 'Error al usar Gemini' });
  }
}