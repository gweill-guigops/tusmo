export interface Guess {
  validation: string;
  word: string;
  found: boolean;
}
export type LetterState = 'C' | 'P' | 'A';
