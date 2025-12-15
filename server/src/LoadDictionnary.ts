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

const distributionDictionary = {};
type Distribution = {
  distribution: number[];
  size: number;
};

function getDistribution(dictionary: Dictionnary): Distribution {
  const distribution: number[] = [];
  let sum = 0;
  for (const letter of dictionary.values()) {
    sum += letter.size;
    distribution.push(sum);
  }
  return { distribution, size: sum };
}

async function loadDictionary() {
  const dict6 = await loadBrotliDictionary('assets/valides_6.br');
  const dict7 = await loadBrotliDictionary('assets/valides_7.br');
  const dict8 = await loadBrotliDictionary('assets/valides_8.br');
  const dict9 = await loadBrotliDictionary('assets/valides_9.br');

  distributionDictionary[6] = getDistribution(dict6);
  distributionDictionary[7] = getDistribution(dict7);
  distributionDictionary[8] = getDistribution(dict8);
  distributionDictionary[9] = getDistribution(dict9);

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

export async function isInDictionary(attempt: string): Promise<boolean> {
  const dictionary = await getDictionary();
  const length = attempt.length;
  const initial = attempt.charAt(0);

  return dictionary.get(length)?.get(initial)?.has(attempt) ?? false;
}

export async function pickSolution(length: number): Promise<string> {
  const solutions = await getSolutions();
  const alpha = solutions.get(length);
  if (alpha === undefined) {
    throw new Error(`No dictionnary for words with length ${length}`);
  }
  const distribution = distributionDictionary[length];

  const alphabetSize = alpha.size;

  const random = Math.random() * distribution.size;

  const index = distribution.distribution.findIndex((d) => d >= random);

  const dict = Array.from(alpha.values())[index];

  const dictSize = dict.size;
  const solution = Array.from(dict.values())[Math.floor(Math.random() * dictSize)];
  console.log(`pick ${solution} : word with ${length} letters`);
  return solution;
}

export function loadAll() {
  getDictionary();
  getSolutions();
}
