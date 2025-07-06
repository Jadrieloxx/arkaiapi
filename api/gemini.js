import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      return res.status(200).json({ result: text });

    } catch (error) {
      console.error("Vercel API Error:", error);
      return res.status(500).json({ error: "Error contacting Gemini API" });
    }
  } 

  // Handle other methods
  else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
