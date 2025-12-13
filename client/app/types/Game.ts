export interface Configuration {
  attempts: number;
  words: number;
}

export interface WordInfo {
  initial: string;
  size: number;
}

export type WordInfos = WordInfo[];

export interface Guess {
  found: boolean;
  word: string;
  validation: string;
}

export type Guesses = Guess[];

export type LetterState = 'C' | 'P' | 'A';

export interface Config {}
