import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AiResponse {
  summary: string[];
  keywords: string[];
  flashcards: { question: string; answer: string }[];
}

export type SummaryLength = 'short' | 'medium' | 'long';

export function useAi() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (text: string, apiKey: string, numFlashcards: number, summaryLength: SummaryLength): Promise<AiResponse> => {
    setIsGenerating(true);
    setError(null);

    if (!apiKey) {
      setError('API key is required.');
      setIsGenerating(false);
      throw new Error('API key is required.');
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
        You are an AI assistant designed to help students prepare for exams. Based on the provided text, generate a concise and structured study guide in JSON format.

        The JSON object must contain the following three properties:
        1.  "summary": An array of strings, where each string is a key learning objective. The summary should be ${summaryLength} in length. Focus on actionable advice, such as "Understand...", "Be able to...", etc.
        2.  "keywords": An array of the most critical keywords, concepts, and terminology from the text.
        3.  "flashcards": An array of exactly ${numFlashcards} objects, each with a "question" and "answer" property. The questions should test understanding of the key concepts.

        Analyze the following text and generate the study guide:

        ---
        ${text}
        ---
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = await response.text();
      
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '');
      const parsed = JSON.parse(cleanedJson);

      return parsed;
    } catch (e) {
      const error = e as Error;
      console.error('AI generation failed:', error);
      setError(`Failed to generate AI content. Please check your API key and try again. Details: ${error.message}`);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generate };
}
