<script lang="ts" setup>
import type { Configuration, Guess, WordInfo } from '~/types/Game';

const props = defineProps<{
  config: Configuration;
  wordInfo: WordInfo;
  isEnded: boolean;
  guesses: Guess[];
  shaking: boolean;
  guess: string;
}>();

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
  return (props.guess + known.value.substring(props.guess.length)).split('');
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
    const lGuess = props.guess.length;
    if (lGuess < props.wordInfo.size) {
      results[nbG][lGuess] = 'surbrillance';
    }
  }

  return results;
});

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
          class="flex items-center justify-center uppercase font-bold text-sm sm:text-xl md:text-2xl border-2 text-white select-none [transform-style:preserve-3d] [backface-visibility:hidden] origin-center duration-300"
          :class="getTileColor(r, c)"
        >
          {{ letter }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
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
