import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { frontendCode } = req.body;

  if (!frontendCode) {
    return res.status(400).json({ error: 'Frontend code is required' });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Given the following React frontend code, generate a basic Express.js backend that would support this UI:

${frontendCode}

Please include necessary routes, controllers, and models. Assume we're using MongoDB as the database.`;

    const result = await model.generateContent(prompt);
    const backendCode = result.response.text();

    res.status(200).send(backendCode);
  } catch (error) {
    console.error('Error generating backend code:', error);
    res.status(500).json({ error: 'Failed to generate backend code' });
  }
}

