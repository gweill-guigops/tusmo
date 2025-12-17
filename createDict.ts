import fs from 'fs';
import readline from 'readline';
import zlib from 'zlib';
import { Readable } from 'stream';

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function filterCsv() {
  // --- Config ---
  const regex1 = /^(?<word>[A-zÀ-ú]{6,9})(,(?<lemme>.*))?\.(?<feat>.*)$/im;
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
  const v6 = new Set();
  const s7 = new Set();
  const v7 = new Set();
  const s8 = new Set();
  const v8 = new Set();
  const s9 = new Set();
  const v9 = new Set();

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
  const featuresRejectedForSolution = new Map();

  for await (const line of rl) {
    count++;

    const r1 = regex1.exec(line);

    if (r1 === null) {
      outReject1.write(line + '\n');
      continue;
    }

    let { word, lemme, feat } = r1.groups;

    word = removeAccents(word).toLowerCase();
    // // Regexp 2
    if (regex2.test(feat)) {
      outReject2.write(line + '\n');
      continue;
    }

    if (regex3.test(feat)) {
      outReject3.write(line + '\n');
      continue;
    }
    outAccepted.write(line + '\n');

    features.set(feat, word);

    if (word.length === 6) {
      if (feat.startsWith('V') && !regex4.test(feat)) {
        featuresRejectedForSolution.set(feat, word);
      } else {
        if (lemmes.has(lemme) || lemmes.has(word)) {
          s6.add(word);
        }
      }
      v6.add(word);
    } else if (word.length === 7) {
      if (feat.startsWith('V') && !regex4.test(feat)) {
        featuresRejectedForSolution.set(feat, word);
      } else {
        if (lemmes.has(lemme) || lemmes.has(word)) {
          s7.add(word);
        }
      }
      v7.add(word);
    } else if (word.length === 8) {
      if (feat.startsWith('V') && !regex4.test(feat)) {
        featuresRejectedForSolution.set(feat, word);
      } else {
        if (lemmes.has(lemme) || lemmes.has(word)) {
          s8.add(word);
        }
      }
      v8.add(word);
    } else {
      if (feat.startsWith('V') && !regex4.test(feat)) {
        featuresRejectedForSolution.set(feat, word);
      } else {
        if (lemmes.has(lemme) || lemmes.has(word)) {
          s9.add(word);
        }
      }
      v9.add(word);
    }
  }

  const transforms = new Map([
    [s6, 'solutions_6.br'],
    [v6, 'valides_6.br'],
    [s7, 'solutions_7.br'],
    [v7, 'valides_7.br'],
    [s8, 'solutions_8.br'],
    [v8, 'valides_8.br'],
    [s9, 'solutions_9.br'],
    [v9, 'valides_9.br'],
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
      Array.from(words)
        .map((word) => word + '\n')
        .toSorted(),
    )
      .pipe(brotli)
      .pipe(streamOutput);
  });

  console.log('***************************');
  console.log('********* Conservés *******');
  console.log('***************************');

  features
    .entries()
    .toArray()
    .toSorted()
    .reverse()
    .forEach((l) => console.log(l));

  console.log('***************************');
  console.log('********* Rejets **********');
  console.log('***************************');

  featuresRejected
    .entries()
    .toArray()
    .toSorted()
    .reverse()
    .forEach((l) => console.log(l));

  console.log('Terminé !');
  // Important : fermer les flux
  outReject1.end();
  outReject2.end();
  outReject3.end();
  //   outAccepted.end();
  //   solutions_6.end();
  //   valides_6.end();
  //   solutions_7.end();
  //   valides_7.end();
  //   solutions_8.end();
  //   valides_8.end();
  //   solutions_9.end();
  //   valides_9.end();
}

filterCsv().catch(console.error);
