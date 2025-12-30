import fs from 'fs';
import readline from 'readline';
import zlib from 'zlib';
import { Readable } from 'stream';

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function scoreScrabble(mot: string) {
  const points = {
    A: 1,
    E: 1,
    I: 1,
    L: 1,
    N: 1,
    O: 1,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    D: 2,
    G: 2,
    M: 2,
    B: 3,
    C: 3,
    P: 3,
    F: 4,
    H: 4,
    V: 4,
    J: 8,
    Q: 8,
    K: 10,
    W: 10,
    X: 10,
    Y: 10,
    Z: 10,
  };

  return mot
    .toUpperCase()
    .split('')
    .reduce((total, lettre) => total + (points[lettre] || 0), 0);
}

async function filterCsv() {
  // --- Config ---
  const regex1 = /^(?<word>[A-zÀ-ú]{6,10})(,(?<lemme>.*))?\.(?<feat>.*)$/im;
  const regex2 = /NPropre|Conc/;
  const regex3 = /^(PFX|XI|X)/;
  const regex4 = /V.*(Kms|Kmp|Kfs|Kfp|G|W).*/;

  const input = 'dela-fr-public.dic';

  const lemmesRs = fs.createReadStream('lemme.csv');
  const r2 = readline.createInterface({
    input: lemmesRs,
  });

  const lemmes = new Set();

  for await (const line of r2) {
    lemmes.add(removeAccents(line).toLowerCase());
  }
  const outReject1 = fs.createWriteStream('reject1.csv');
  const outReject2 = fs.createWriteStream('reject2.csv');
  const outReject3 = fs.createWriteStream('reject3.csv');
  const outAccepted = fs.createWriteStream('accepted.csv');

  const s6 = new Set();
  const s6_ = new Set();
  const v6 = new Set();
  const s7 = new Set();
  const s7_ = new Set();
  const v7 = new Set();
  const s8 = new Set();
  const s8_ = new Set();
  const v8 = new Set();
  const s9 = new Set();
  const s9_ = new Set();
  const v9 = new Set();
  const s10 = new Set();
  const s10_ = new Set();
  const v10 = new Set();

  // Lecture ligne par ligne (streaming)
  const rl = readline.createInterface({
    input: fs.createReadStream(input, {
      encoding: 'utf16le',
    }),
  });

  console.log('Traitement en cours...');
  let count = 0;

  const features = new Map();
  const featuresRejected = new Map();
  const featuresRejectedForSolutions = new Map();

  for await (const line of rl) {
    count++;

    const r1 = regex1.exec(line);

    if (r1 === null || r1.groups === undefined) {
      outReject1.write(line + '\n');
      continue;
    }

    let { word, lemme, feat } = r1.groups;

    word = removeAccents(word).toLowerCase();
    // // Regexp 2
    if (regex2.test(feat)) {
      featuresRejected.set(feat, word);
      outReject2.write(line + '\n');
      continue;
    }

    if (regex3.test(feat)) {
      featuresRejected.set(feat, word);
      outReject3.write(line + '\n');
      continue;
    }
    outAccepted.write(line + '\n');

    features.set(feat, word);

    function dispatch(
      word: string,
      feat: string,
      sol: Set<string>,
      sol_: Set<string>,
      valid: Set<string>,
    ) {
      if (feat.startsWith('V') && !regex4.test(feat)) {
        featuresRejectedForSolutions.set(feat, word);
      } else {
        if (lemmes.has(lemme) || lemmes.has(word)) {
          sol.add(word);
        } else {
          sol_.add(word);
        }
      }
      valid.add(word);
    }

    if (word.length === 6) {
      dispatch(word, feat, s6, s6_, v6);
    } else if (word.length === 7) {
      dispatch(word, feat, s7, s7_, v7);
    } else if (word.length === 8) {
      dispatch(word, feat, s8, s8_, v8);
    } else if (word.length === 9) {
      dispatch(word, feat, s9, s9_, v9);
    } else if (word.length === 10) {
      dispatch(word, feat, s10, s10_, v10);
    } else {
      console.info(`Unexpected word ${word}`);
    }
  }

  const transforms = new Map([
    [s6, 'solutions_6.br'],
    [s6_, 'solutions_6_.br'],
    [v6, 'valides_6.br'],
    [s7, 'solutions_7.br'],
    [s7_, 'solutions_7_.br'],
    [v7, 'valides_7.br'],
    [s8, 'solutions_8.br'],
    [s8_, 'solutions_8_.br'],
    [v8, 'valides_8.br'],
    [s9, 'solutions_9.br'],
    [s9_, 'solutions_9_.br'],
    [v9, 'valides_9.br'],
    [s10, 'solutions_10.br'],
    [s10_, 'solutions_10_.br'],
    [v10, 'valides_10.br'],
  ]);

  transforms.entries().forEach(([words, streamPath]) => {
    const streamOutput = fs.createWriteStream(streamPath);

    const brotli = zlib.createBrotliCompress({
      //   params: {
      //     [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // compression maximale
      //     [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
      //   },
    });

    streamOutput.on('finish', () => {
      console.log(`Fichier ${streamPath} compressé créé`);
    });

    Readable.from(
      Array.from(words).map((word) => word + '\n'),
      // .map((word) => [word, scoreScrabble(word.substring(1))])
      // .toSorted(([w1, s1], [w2, s2]) => {
      //   if (s1 != s2) {
      //     return s1 - s2;
      //   }
      //   return w1.localeCompare(w2);
      // })
      // .map(([word, score]) => word + ';' + score + '\n')
      // ,
    )
      .pipe(brotli)
      .pipe(streamOutput);
  });

  console.log('***************************');
  console.log('******* Rejets total ******');
  console.log('***************************');

  featuresRejected
    .entries()
    .toArray()
    .toSorted()
    .reverse()
    .forEach((l) => console.log(l));

  console.log('***************************');
  console.log('******* Rejets solutions **');
  console.log('***************************');

  featuresRejectedForSolutions
    .entries()
    .toArray()
    .toSorted()
    .reverse()
    .forEach((l) => console.log(l));

  console.log('Terminé !');

  outReject1.end();
  outReject2.end();
  outReject3.end();
  outAccepted.end();
}

filterCsv().catch(console.error);
