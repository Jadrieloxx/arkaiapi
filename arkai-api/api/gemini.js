import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // --- INICIO DE LA SOLUCIÓN CORS ---
  // Permitir solicitudes desde cualquier origen
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Métodos HTTP permitidos
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  // Cabeceras permitidas en la solicitud
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar la solicitud pre-vuelo (preflight) de OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // --- FIN DE LA SOLUCIÓN CORS ---

  // El resto de tu lógica de la API
  if (req.method === 'POST') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const { prompt } = req.body;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      return res.status(200).json({ result: text });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al contactar la API de Gemini" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}