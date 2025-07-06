import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Añadir cabeceras CORS SIEMPRE PRIMERO.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2. Manejar la petición OPTIONS INMEDIATAMENTE DESPUÉS.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Ahora sí, manejar la lógica del método POST.
  if (req.method === 'POST') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "El 'prompt' es requerido." });
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      return res.status(200).json({ result: text });

    } catch (error) {
      console.error("Error en la API de Vercel:", error);
      return res.status(500).json({ error: "Error al contactar la API de Gemini" });
    }
  } 
  
  // Si no es ni OPTIONS ni POST, devuelve un error.
  else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}