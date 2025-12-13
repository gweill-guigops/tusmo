import { Client, ClientPlay } from './Client';
import { GameConfiguration } from './GameConfiguration';
import { Guess, LetterState } from './Guess';
import { pickSolution } from './LoadDictionnary';

const MIN_LENGTH_WORD = 6;

function compareWords(target: string, attempt: string): Guess {
  console.info({ target, attempt });
  const length = target.length;
  const validation: LetterState[] = Array(length).fill('A');

  const targetArr = target.split('');
  const attemptArr = attempt.split('');

  const letterCount: Record<string, number> = {};

  for (const char of targetArr) {
    letterCount[char] = (letterCount[char] || 0) + 1;
  }

  for (let i = 0; i < length; i++) {
    if (attemptArr[i] === targetArr[i]) {
      validation[i] = 'C';
      letterCount[attemptArr[i]]! -= 1;
    }
  }

  for (let i = 0; i < length; i++) {
    if (validation[i] === 'C') continue;

    const char = attemptArr[i];
    if (letterCount[char] > 0) {
      validation[i] = 'P';
      letterCount[char]!--;
    }
  }

  return {
    found: target === attempt,
    word: attempt,
    validation: validation.join(''),
  };
}
export interface Game {
  words: string[];
  submit(clientState: ClientPlay, client: Client, attempt: string): void;
  hasNext(number): boolean;
  lost(number): boolean;
  init(): void;
}

export class GameImpl implements Game {
  words: string[];
  configuration: GameConfiguration;

  constructor(configuration: GameConfiguration) {
    this.configuration = configuration;
  }

  async init() {
    this.words = await Promise.all(
      Array.from({ length: this.configuration.words }).map((_, index) =>
        pickSolution(MIN_LENGTH_WORD + index),
      ),
    );
  }

  submit(clientState: ClientPlay, client: Client, attempt: string): void {
    const turn = clientState.getCurrentTurn();
    const word = this.words[clientState.getTurnsSize() - 1];
    const guess = compareWords(word, attempt);

    turn.addGuess(guess);

    client.getWs().emit('guesses', turn.guesses);

    console.log('guess', guess);
    console.log('turn', turn);
    console.log('hasNext', this.hasNext(clientState.getTurnsSize()));
    console.log('getTurnsSize', clientState.getTurnsSize());
    console.log('lost', this.lost(turn.getGuessesSize()));

    if (guess.found) {
      if (this.hasNext(clientState.getTurnsSize())) {
        clientState.addTurn();
        const word = this.words[clientState.getTurnsSize() - 1];

        setTimeout(() => {
          client.getWs().emit('word-info', {
            initial: word.charAt(0),
            size: word.length,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          client.getWs().emit('end');
        }, 1000);
      }
    } else if (this.lost(turn.getGuessesSize())) {
      setTimeout(() => {
        client.getWs().emit('end');
      }, 1000);
    }

    client.getWs().emit('guess', guess);
  }

  hasNext(found: number): boolean {
    return found < this.words.length;
  }

  lost(attempts: number): boolean {
    return this.configuration.attempts <= attempts;
  }
}
