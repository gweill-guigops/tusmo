<script lang="ts" setup>
import type { Configuration, Guess, WordInfo } from '~/types/Game';

const props = defineProps<{
  config: Configuration;
  wordInfo: WordInfo;
  disabled: boolean;
  isEnded: boolean;
  guesses: Guess[];
  guess: string;
}>();

const emit = defineEmits(['submit', 'input', 'del']);

function input(letter) {
  if (props.guess.length === props.wordInfo.size) {
    return;
  }
  emit('input', letter);
}
function canDel() {
  return !props.disabled && props.guess.length > 1;
}
function del() {
  if (!canDel()) {
    return;
  }
  emit('del');
}
function canSubmit() {
  return !props.disabled && !props.isEnded && props.guess.length === props.wordInfo.size;
}
async function submit() {
  if (!canSubmit()) {
    return;
  }
  emit('submit');
}

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
</script>

<template>
  <div class="flex flex-col">
    <!-- CONTROLS -->
    <p class="flex-initial text-center text-xs sm:text-sm text-slate-400 mt-2 md:mt-4">
      Vert : bien placé — Jaune : présent — Gris : absent
    </p>

    <!-- KEYBOARD -->
    <div class="flex-auto flex flex-col align-middle items-center mt-2 md:mt-4 gap-2 select-none">
      <div class="flex-auto flex w-full gap-1 sm:gap-2">
        <div
          v-for="k in 'azertyuiop'.split('')"
          class="kbd"
          :class="getKeyColor(k)"
          @click="input(k)"
        >
          {{ k }}
        </div>
      </div>
      <div class="flex-auto flex w-full gap-1 sm:gap-2">
        <div
          v-for="k in 'qsdfghjklm'.split('')"
          class="kbd"
          :class="getKeyColor(k)"
          @click="input(k)"
        >
          {{ k }}
        </div>
      </div>
      <div class="flex-auto flex w-full gap-1 sm:gap-2">
        <div class="kbd" @click="del">Del</div>
        <div v-for="k in 'wxcvbn'.split('')" class="kbd" :class="getKeyColor(k)" @click="input(k)">
          {{ k }}
        </div>
        <div class="kbd" @click="submit">Enter</div>
      </div>
    </div>
  </div>
</template>

<!-- p-2 sm:p-3 md:p-5 -->
<style lang="postcss" scoped>
.kbd {
  @apply flex-1 text-center
    text-sm sm:text-base
    content-center
    rounded-md md:rounded-lg
    text-white font-bold uppercase
     cursor-pointer touch-none;
}
</style>
