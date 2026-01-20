// lib/scoring.ts
import { distance } from 'fastest-levenshtein';

export function calculateSimilarity(answer1: string, answer2: string): number {
  const a = answer1.toLowerCase().trim();
  const b = answer2.toLowerCase().trim();
  
  if (a === '' && b === '') return 1.0;
  if (a === '' || b === '') return 0.0;
  
  const editDistance = distance(a, b);
  const maxLength = Math.max(a.length, b.length);
  
  return 1 - (editDistance / maxLength);
}

export function getPointsFromSimilarity(similarity: number): number {
  if (similarity === 1.0) return 1.0;
  if (similarity >= 0.8) return 0.75;
  if (similarity >= 0.6) return 0.5;
  return 0;
}
