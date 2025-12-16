<script lang="ts" setup>
import { HomeIcon } from '@heroicons/vue/24/outline';
import type { Guesses, Guess, Configuration } from '~/types/Game';

const { socket } = useWebSocket();

const props = defineProps<{
  roomID: string;
}>();

const emits = defineEmits(['quit-room']);

const config: Ref<Configuration | undefined> = ref();
socket.on('start', (configuration) => {
  config.value = configuration;
});

const guesses: Ref<Guesses> = ref([]);
const isEnded = ref(false);
const isWaiting = ref(false);

const wordInfo = ref();
socket.on('word-info', (info) => {
  wordInfo.value = info;
  guesses.value = [];
  isEnded.value = false;
  isWaiting.value = false;
});

const players = ref([
  { id: 1, initials: 'JS', name: 'Jean', info: 'Hôte', color: 'from-violet-500 to-indigo-500' },
  { id: 2, initials: 'AL', name: 'Alice', info: 'En attente', color: 'from-cyan-400 to-cyan-400' },
  {
    id: 3,
    initials: 'DM',
    name: 'Dimitri',
    info: 'Joué : 3 essais',
    color: 'from-orange-500 to-rose-400',
  },
]);

socket.on('players', (pl) => {
  players.value = pl;
});

socket.on('deny-attempt', () => {
  isWaiting.value = false;
});

socket.on('valid-attempt', (guess: Guess) => {
  guesses.value.push(guess);
  isWaiting.value = false;
  isEnded.value = guesses.value.length === config.value?.attempts || guess.found;
});

async function submit(guess: string) {
  isWaiting.value = true;
  socket.emit('submit', guess);
}

function quitRoom() {
  socket.off('start');
  socket.off('word-info');
  socket.off('players');
  socket.off('deny-attempt');
  socket.off('valid-attempt');

  emits('quit-room');
}
</script>

<template>
  <main class="h-full max-w-[1100px] mx-auto p-4 sm:p-6 flex gap-6">
    <section
      class="h-full grid grid-rows-[10px_3fr_2fr] bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 shadow-xl flex-1"
    >
      <!-- HEADER -->
      <header class="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div class="text-sm text-slate-400">
          Room <span class="text-white font-semibold">{{ props.roomID }}</span>
        </div>

        <button
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white focus:ring-2 focus:ring-violet-500"
          @click.prevent="quitRoom()"
        >
          <HomeIcon class="w-5 h-5 text-white-500" />
        </button>
      </header>
      <!-- ========== MAIN PANEL ========== -->
      <Game
        v-if="config && wordInfo"
        :config="config"
        :wordInfo="wordInfo"
        :disabled="isWaiting"
        :isEnded="isEnded"
        :guesses="guesses"
        @submit="submit"
      ></Game>
    </section>
    <!-- ========== SIDEBAR ========== -->
    <aside
      class="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 shadow-xl hidden md:block flex-2"
    >
      <h2 class="text-sm text-slate-400 mb-3">Joueurs</h2>

      <div class="flex flex-col gap-3">
        <div
          v-for="p in players"
          :key="p.id"
          class="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-lg"
        >
          <div
            class="w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white bg-gradient-to-r"
            :class="p.color"
          >
            {{ p.initials }}
          </div>
          <div>
            <div class="font-semibold text-white">{{ p.name }}</div>
            <div class="text-sm text-slate-400">{{ p.info }}</div>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<style lang="postcss" scoped></style>
