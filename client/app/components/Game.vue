<script lang="ts" setup>
import type { Configuration, Guess, WordInfo } from '~/types/Game';

const props = defineProps<{
  config: Configuration;
  wordInfo: WordInfo;
  disabled: boolean;
  isEnded: boolean;
  guesses: Guess[];
  shaking: boolean;
}>();

const emit = defineEmits(['submit']);

const guess = ref('');

const TILE_PRESENCE = {
  C: 'correct',
  P: 'present',
  A: 'absent',
  '': '',
};

const known = computed(() => {
  return Array.from({ length: props.wordInfo.size })
    .map((_, index) =>
      index === 0
        ? props.wordInfo.initial
        : (props.guesses.find((g) => g.validation.charAt(index) === 'C')?.word.charAt(index) ??
          ' '),
    )
    .join('');
});

const lastLine = computed(() => {
  return (guess.value + known.value.substring(guess.value.length)).split('');
});

const rows = computed(() => {
  const results = Array.from({ length: props.config.attempts }).map((_) =>
    Array.from({ length: props.wordInfo.size }).map((_) => ' '),
  );
  props.guesses.forEach((guess, i) => {
    results[i] = guess.word.split('');
  });
  const nbG = props.guesses.length;
  if (nbG < props.config.attempts && !props.isEnded) {
    results[nbG] = lastLine.value;
  }
  return results;
});

const rowStates = computed((): string[][] => {
  const results = Array.from({ length: props.config.attempts }).map((_) =>
    Array.from({ length: props.wordInfo.size }).map((_) => ''),
  );
  props.guesses.forEach((guess, i) => {
    results[i] = guess.validation.split('').map((v) => TILE_PRESENCE[v]);
  });
  const nbG = props.guesses.length;
  if (nbG < props.config.attempts && !props.isEnded) {
    results[nbG] = lastLine.value.map((c, index) => {
      return index === 0 ? TILE_PRESENCE['C'] : '';
    });
    const lGuess = guess.value.length;
    if (lGuess < props.wordInfo.size) {
      results[nbG][lGuess] = 'surbrillance';
    }
  }

  return results;
});

function input(letter) {
  if (guess.value.length === props.wordInfo.size) {
    return;
  }
  guess.value += letter;
}
function canDel() {
  return !props.disabled && guess.value.length > 1;
}
function del() {
  if (!canDel()) {
    return;
  }
  guess.value = guess.value.substring(0, guess.value.length - 1);
}
function canSubmit() {
  return !props.disabled && !props.isEnded && guess.value.length === props.wordInfo.size;
}
async function submit() {
  if (!canSubmit()) {
    return;
  }
  emit('submit', guess.value);
}

watch(
  () => props.guesses.length,
  (count, prevCount) => {
    if (!props.isEnded && props.guesses.length < props.config.attempts) {
      guess.value = props.wordInfo.initial;
    }
  },
  {
    immediate: true,
  },
);

const alphabet = computed(() => {
  return props.guesses.toReversed().reduce(
    (memo, guess) => {
      guess.word.split('').forEach((letter, index) => {
        const state = guess.validation[index];
        if (memo[letter] === undefined) {
          memo[letter] = state;
        } else if (state === 'C') {
          memo[letter] = 'C';
        } else if (state === 'P' && memo[letter] !== 'C') {
          memo[letter] = 'P';
        } else if (state === 'A' && memo[letter] !== 'C' && memo[letter] !== 'P') {
          memo[letter] = 'A';
        }
      });
      return memo;
    },
    { [props.wordInfo.initial]: 'C' },
  );
});

function isCorrect(letter: string) {
  return alphabet.value[letter] === 'C';
}
function isPresent(letter) {
  return alphabet.value[letter] === 'P';
}
function isAbsent(letter) {
  return alphabet.value[letter] === 'A';
}

function getKeyColor(letter) {
  return isCorrect(letter)
    ? 'bg-green-400 border-green-700'
    : isPresent(letter)
      ? 'bg-yellow-500 border-yellow-700'
      : isAbsent(letter)
        ? 'bg-white/5'
        : 'bg-slate-600 border-slate-700';
}
function getTileColor(r: number, c: number) {
  const state = rowStates.value.at(r)?.at(c);
  return state === undefined || state === ''
    ? 'bg-transparent border-white/10'
    : state === 'correct'
      ? 'bg-green-600 border-green-800'
      : state === 'present'
        ? 'bg-yellow-500 border-yellow-700'
        : state === 'surbrillance'
          ? 'bg-white border-white/10 bg-opacity-10 '
          : 'bg-slate-600 border-slate-700';
}
</script>

<template>
  <div>
    <!-- BOARD -->
    <div class="flex justify-center py-2 sm:py-4 bg-opacity-50">
      <div
        class="grid gap-2 sm:gap-2 w-full max-w-[360px] sm:max-w-none"
        :style="`grid-template-rows: repeat(${config.attempts}, 1fr)`"
      >
        <div
          v-for="(row, r) in rows"
          :key="r"
          class="grid gap-0"
          :class="[shaking && r === props.guesses.length ? 'animate-sway' : '']"
          :style="`grid-template-columns: repeat(${wordInfo.size}, 1fr)`"
        >
          <div
            v-for="(letter, c) in row"
            :key="c"
            class="flex items-center justify-center uppercase font-bold text-sm sm:text-2xl border-2 text-white select-none [transform-style:preserve-3d] [backface-visibility:hidden] origin-center duration-300"
            :class="getTileColor(r, c)"
          >
            {{ letter }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col">
      <!-- CONTROLS -->
      <p class="flex-initial text-center text-xs sm:text-sm text-slate-400 mt-2">
        Vert : bien placé — Jaune : présent — Gris : absent
      </p>

      <!-- KEYBOARD -->
      <div class="flex flex-col align-middle items-center mt-2 sm:mt-6 gap-2 select-none">
        <div class="flex w-full gap-1 sm:gap-2">
          <div
            v-for="k in 'azertyuiop'.split('')"
            class="kbd"
            :class="getKeyColor(k)"
            @click="input(k)"
          >
            {{ k }}
          </div>
        </div>
        <div class="flex w-full gap-1 sm:gap-2">
          <div
            v-for="k in 'qsdfghjklm'.split('')"
            class="kbd"
            :class="getKeyColor(k)"
            @click="input(k)"
          >
            {{ k }}
          </div>
        </div>
        <div class="flex w-full gap-1 sm:gap-2">
          <div class="kbd" @click="del">Del</div>
          <div
            v-for="k in 'wxcvbn'.split('')"
            class="kbd"
            :class="getKeyColor(k)"
            @click="input(k)"
          >
            {{ k }}
          </div>
          <div class="kbd" @click="submit">Enter</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@keyframes flip {
  0% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}

.kbd {
  @apply grow
    px-2 sm:px-3 py-2 sm:py-3
    text-center
    rounded-md md:rounded-lg
    text-white font-bold uppercase
     cursor-pointer touch-none;
}

@keyframes sway {
  0% {
    transform: translateX(0);
  }
  15% {
    transform: translateX(-6px);
  }
  30% {
    transform: translateX(6px);
  }
  45% {
    transform: translateX(-4px);
  }
  60% {
    transform: translateX(4px);
  }
  75% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-sway {
  animation: sway 1s ease-in-out;
}
</style>
