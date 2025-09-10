import { useState, useCallback } from 'react';
import { pipeline, Pipeline } from '@xenova/transformers';

// Define the structure of the AI's response, same as the old hook
export interface AiResponse {
  summary: string[];
  keywords: string[];
  flashcards: { question: string; answer: string }[];
}

// Cache for the pipeline instances
let summarizerCache: Pipeline | null = null;
let keywordCache: Pipeline | null = null;

// A simple list of common English stop words
const STOP_WORDS = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
    'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with',
    'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
    'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 'couldn', 'didn', 'doesn', 'hadn', 'hasn',
    'haven', 'isn', 'ma', 'mightn', 'mustn', 'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn', 'etc', 'eg'
]);

export function useLocalAi() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generateSummary = useCallback(async (text: string): Promise<string[]> => {
    try {
      if (!summarizerCache) {
        summarizerCache = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
      }
      const summarizer = summarizerCache;
      const output = await summarizer(text, { max_length: 150 });
      // @ts-ignore
      const summaryText = output[0].summary_text;
      // Split summary into bullet points by sentence
      return summaryText.split('. ').filter((s: string) => s.length > 0).map((s: string) => `Be able to ${s.trim()}`);
    } catch (e) {
      console.error('Summarization failed:', e);
      throw new Error('Failed to generate summary.');
    }
  }, []);

  const generateKeywords = useCallback((text: string): string[] => {
    const wordCounts: { [key: string]: number } = {};
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];

    words.forEach(word => {
      if (!STOP_WORDS.has(word) && word.length > 3) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });

    const sortedKeywords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    return sortedKeywords.slice(0, 15); // Return top 15 keywords
  }, []);

  const generateFlashcards = useCallback(async (text: string, keywords: string[]): Promise<{ question: string; answer: string }[]> => {
    try {
        if (!keywordCache) {
            keywordCache = await pipeline('question-answering', 'Xenova/distilbert-base-cased-distilled-squad');
        }
        const qaPipeline = keywordCache;
        const flashcards: { question: string; answer: string }[] = [];
        const sentences = text.split('.');

        for (const keyword of keywords) {
            if (flashcards.length >= 10) break; // Limit to 10 flashcards

            const contextSentence = sentences.find(s => s.toLowerCase().includes(keyword));
            if (contextSentence) {
                const question = `What is ${keyword}?`;
                // @ts-ignore
                const result = await qaPipeline(question, contextSentence);
                if (result && result.score > 0.3) { // Confidence threshold
                    flashcards.push({ question, answer: result.answer });
                }
            }
        }
        return flashcards;
    } catch (e) {
        console.error('Flashcard generation failed:', e);
        throw new Error('Failed to generate flashcards.');
    }
  }, []);

  const generate = async (text: string): Promise<AiResponse> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(10);
      const summary = await generateSummary(text);
      setProgress(40);
      const keywords = generateKeywords(text);
      setProgress(70);
      const flashcards = await generateFlashcards(text, keywords);
      setProgress(100);

      return { summary, keywords, flashcards };
    } catch (e) {
      const error = e as Error;
      console.error('Local AI generation failed:', error);
      setError(`Failed to generate content locally. ${error.message}`);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generate, progress };
}
