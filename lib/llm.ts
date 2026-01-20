import { GameWord } from '../types/game';
import {GoogleGenAI} from '@google/genai';
export async function generateFrenchWord(difficulty: string = 'medium'): Promise<GameWord> {
  const ai = new GoogleGenAI({});
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate one random French word with ${difficulty} difficulty. Return ONLY valid JSON with no markdown or code blocks: {"french": "word", "english": "translation"} , also try to generate variety of words each time different on each call`,
  });
  console.log(response.text);
 
  const data = await response;
  console.log(data);
  const text = data!.candidates![0].content?.parts![0].text;
  const word: GameWord = JSON.parse(text!);
  
  return word;
}
