<script lang="ts" setup>
import { HomeIcon } from '@heroicons/vue/24/outline';
import type { Guesses, Guess, Configuration } from '~/types/Game';

const { socket } = useWebSocket();

const props = defineProps<{
  roomID: string;
}>();

const emits = defineEmits(['quit-room']);

const configuration: Ref<Configuration | undefined> = ref();
const startedAt: Ref<number> = ref(0);
socket.on('start', (gameConfiguration, gameStartedAt) => {
  configuration.value = gameConfiguration;
  startedAt.value = gameStartedAt;
  timer.value = getTimer();
});

const guesses: Ref<Guesses> = ref([]);
const isEnded = ref(false);
const isGameEnded = ref(false);
const isWaiting = ref(false);

const wordInfo = ref();
socket.on('word-info', (info) => {
  wordInfo.value = info;
  guesses.value = [];
  isGameEnded.value = false;
  isWaiting.value = false;
});

const players = ref([]);

socket.on('players', (pl) => {
  players.value = pl;
});

socket.on('deny-attempt', () => {
  isWaiting.value = false;
});

socket.on('valid-attempt', (guess: Guess) => {
  guesses.value.push(guess);
  isWaiting.value = false;
  isGameEnded.value = guesses.value.length === configuration.value?.attempts || guess.found;
  isEnded.value =
    (guesses.value.length === configuration.value?.attempts && !guess.found) ||
    (guess.found && wordInfo.value.isLast === true);
});

async function submit(guess: string) {
  isWaiting.value = true;
  socket.emit('submit', guess);
}

function getTimer() {
  if (startedAt.value === 0) {
    return '';
  }

  const minutes = Math.floor((Date.now() - startedAt.value) / 60 / 1000);
  const mins = minutes.toFixed(0).padStart(2, '0');

  const seconds = (Date.now() - startedAt.value) / 1000;
  const secs = (seconds % 60).toFixed(0).padStart(2, '0');

  if (seconds < 0 || minutes < 0) {
    return '';
  }
  return `${mins}:${secs}`;
}

const timer = ref('');

setInterval(() => {
  timer.value = getTimer();
}, 1000);

function quitRoom() {
  socket.off('start');
  socket.off('word-info');
  socket.off('players');
  socket.off('deny-attempt');
  socket.off('valid-attempt');

  socket.emit('quit-game');

  emits('quit-room');
}
</script>

<template>
  <main v-if="!isEnded" class="h-full max-w-[1100px] mx-auto p-4 sm:p-6 flex gap-6">
    <section
      class="h-full grid grid-rows-[0.1fr_3fr_2fr] bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 shadow-xl flex-1"
    >
      <!-- HEADER -->
      <header class="flex flex-row items-center justify-between mb-4 gap-2">
        <div class="text-sm text-slate-400">
          Room <span class="text-white font-semibold">{{ props.roomID }}</span>
        </div>
        <div v-if="timer" class="flex bg-gray-200 rounded-full items-center justify-center size-14">
          <span id="timer" class="font-bold text-gray-500">
            {{ timer }}
          </span>
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
        v-if="configuration && wordInfo"
        :config="configuration"
        :wordInfo="wordInfo"
        :disabled="isWaiting"
        :isEnded="isGameEnded"
        :guesses="guesses"
        @submit="submit"
      ></Game>
    </section>
    <!-- ========== SIDEBAR ========== -->
    <aside
      class="bg-white/5 border border-white/10 rounded-xl py-2 md:p-2 shadow-xl hidden md:block flex-2"
    >
      <h2 class="text-sm text-slate-400 mb-3">Joueurs</h2>

      <div class="flex flex-col gap-3 h-full overflow-x-hidden overflow-y-scroll">
        <div class="grid" v-for="([username, validations], index) in players" :key="index">
          <div class="flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <div class="font-semibold text-white">{{ username }}</div>

              <div v-if="validations.toReversed().filter((v) => v.length > 0).length > 0">
                <SummaryTable :validations="validations" class=""> </SummaryTable>
              </div>
              <div v-else>En jeu</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </main>
  <Leaderboard :players="players" :startedAt="startedAt" @quit-room="quitRoom" v-else />
</template>

<style lang="postcss" scoped>
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
