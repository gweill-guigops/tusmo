<script lang="ts" setup>
interface Props {
  validations: string[][];
}
const props = defineProps<Props>();

const lastValidation = computed(() => {
  return props.validations.toReversed().filter((v) => v.length > 0)[0];
});

function isCorrect(letter: string) {
  return letter === 'C';
}
function isPresent(letter) {
  return letter === 'P';
}
function isAbsent(letter) {
  return letter === 'A';
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
  <div class="flex justify-center">
    <div class="grid w-full" :style="`grid-template-rows: repeat(${lastValidation.length}, 1fr)`">
      <div
        v-for="(row, r) in lastValidation"
        :key="r"
        class="grid h-3"
        :style="`grid-template-columns: repeat(9, 1fr)`"
      >
        <div
          v-for="(letter, c) in row"
          :key="c"
          class="flex items-center justify-center select-none [transform-style:preserve-3d] [backface-visibility:hidden] origin-center duration-300"
          :class="getKeyColor(letter)"
        >
          {{}}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
