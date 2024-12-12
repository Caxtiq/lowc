import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { frontendCode } = req.body;

  if (!frontendCode) {
    return res.status(400).json({ error: 'Frontend code is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Given the following React frontend code, generate a basic Express.js backend that would support this UI:

${frontendCode}

Please include necessary routes, controllers, and models. Assume we're using MongoDB as the database.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const backendCode = response.text();

    if (!backendCode) {
      throw new Error('Generated backend code is empty');
    }

    res.status(200).json({ backendCode });
  } catch (error) {
    console.error('Error generating backend code:', error);
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: 'Failed to generate backend code', details: errorMessage });
  }
}

