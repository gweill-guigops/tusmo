import fs from 'fs';
import zlib from 'zlib';
import readline from 'readline';

type Dictionnary = Map<string, Set<string>>;

async function loadBrotliDictionary(filePath: string) {
  const dictionary: Dictionnary = new Map<string, Set<string>>();
  const stream = fs.createReadStream(filePath).pipe(zlib.createBrotliDecompress());
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    const letter = line.charAt(0);
    if (dictionary.has(letter)) {
      dictionary.get(letter)?.add(line);
    } else {
      dictionary.set(letter, new Set([line]));
    }
  }

  console.log(
    `Mots chargés : ${Array.from(dictionary.values()).reduce((sum, set) => sum + set.size, 0)}`,
  );
  return dictionary;
}

let singletonPromiseDictionary: Promise<Map<number, Dictionnary>> | null = null;
let singletonPromiseSolutions: Promise<Map<number, Dictionnary>> | null = null;

async function loadDictionary() {
  const dict6 = await loadBrotliDictionary('assets/valides_6.br');
  const dict7 = await loadBrotliDictionary('assets/valides_7.br');
  const dict8 = await loadBrotliDictionary('assets/valides_8.br');
  const dict9 = await loadBrotliDictionary('assets/valides_9.br');
  return new Map([
    [6, dict6],
    [7, dict7],
    [8, dict8],
    [9, dict9],
  ]);
}

async function loadSolutions() {
  const dict6 = await loadBrotliDictionary('assets/solutions_6.br');
  const dict7 = await loadBrotliDictionary('assets/solutions_7.br');
  const dict8 = await loadBrotliDictionary('assets/solutions_8.br');
  const dict9 = await loadBrotliDictionary('assets/solutions_9.br');
  return new Map([
    [6, dict6],
    [7, dict7],
    [8, dict8],
    [9, dict9],
  ]);
}

export function getDictionary(): Promise<Map<number, Dictionnary>> {
  if (!singletonPromiseDictionary) {
    singletonPromiseDictionary = loadDictionary();
  }
  return singletonPromiseDictionary;
}

export function getSolutions(): Promise<Map<number, Dictionnary>> {
  if (!singletonPromiseSolutions) {
    singletonPromiseSolutions = loadSolutions();
  }
  return singletonPromiseSolutions;
}

export async function pickSolution(length: number): Promise<string> {
  const solutions = await getSolutions();
  const alpha = solutions.get(length);
  if (alpha === undefined) {
    throw new Error(`No dictionnary for words with length ${length}`);
  }
  const alphabetSize = alpha.size;
  const dict = Array.from(alpha.values())[Math.floor(Math.random() * alphabetSize)];
  const dictSize = dict.size;
  const solution = Array.from(dict.values())[Math.floor(Math.random() * dictSize)];
  console.log(`pick ${solution} : word with ${length} letters`);
  return solution;
}

export function loadAll() {
  getDictionary();
  getSolutions();
}
