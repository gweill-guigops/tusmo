<script lang="ts" setup>
import { HomeIcon } from '@heroicons/vue/24/outline';

type Player = [string, string[][], number, boolean];
type Players = Player[];

const emits = defineEmits(['quit-room']);

const props = defineProps<{
  players: Players;
  startedAt: number;
}>();

const orderedPlayer = computed(() => {
  return props.players.toSorted((p1, p2) => {
    const [_1, turn1, endedAt1, isWon1] = p1;
    const [_2, turn2, endedAt2, isWon2] = p2;

    if (turn1.length !== turn2.length) {
      return turn2.length - turn1.length;
    }

    // Done
    if (isWon1 === isWon2 && endedAt1 !== 0) {
      return endedAt1 - endedAt2;
    }

    // En jeu
    if (isWon1 === isWon2) {
      return 0;
    }

    if (isWon1) {
      return -1;
    }
    if (isWon2) {
      return 1;
    }

    return endedAt1 ? -1 : 1;
  });
});

function getInitial(pseudo: string) {
  return pseudo.charAt(0) ?? '';
}

function getTimer(endedAt: number) {
  if (endedAt === 0) {
    const minutes = Math.floor((endedAt - props.startedAt) / 60 / 1000);
    const mins = minutes.toFixed(0).padStart(2, '0');

    const seconds = (endedAt - props.startedAt) / 1000;
    const secs = (seconds % 60).toFixed(0).padStart(2, '0');
    return `En jeu - ${mins}:${secs}`;
  }

  const minutes = Math.floor((endedAt - props.startedAt) / 60 / 1000);
  const mins = minutes.toFixed(0).padStart(2, '0');

  const seconds = (endedAt - props.startedAt) / 1000;
  const secs = (seconds % 60).toFixed(0).padStart(2, '0');

  if (seconds < 0 || minutes < 0) {
    return '';
  }
  return `${mins}:${secs}`;
}
function quitRoom() {
  emits('quit-room');
}
</script>

<template>
  <main>
    <section class="h-screen bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 shadow-xl">
      <header class="w-full flex flex-row items-center justify-between mb-4 gap-2">
        <h1 class="text-center items-center justify-center text-slate-400">Classement</h1>
      </header>
      <div class="h-4/6 overflow-y-auto scroller p-2">
        <table class="w-full table-fixed border-separate border-spacing-y-2">
          <tbody>
            <tr v-for="([pseudo, turns, endedAt, isWon], index) in orderedPlayer" :key="index">
              <td class="size-12 rounded-l-lg bg-blue-500 text-center bold">
                {{ index + 1 }}
              </td>
              <td class="bg-blue-600 text-left pl-3">
                {{ pseudo }}
              </td>
              <td
                class="rounded-r-lg text-left pl-3"
                :class="
                  endedAt === 0 ? 'bg-gray-600' : isWon === true ? 'bg-blue-600' : 'bg-red-600'
                "
              >
                {{ getTimer(endedAt) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="h-1/6 w-full flex flex-col items-center justify-between mb-4 gap-2">
        <button
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white focus:ring-2 focus:ring-violet-500"
          @click.prevent="quitRoom()"
        >
          <HomeIcon class="w-5 h-5 text-white-500" />
        </button>
      </div>
    </section>
  </main>
</template>
