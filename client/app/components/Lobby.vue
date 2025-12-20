<script lang="ts" setup>
interface Player {
  id: string;
}

import { PencilIcon } from '@heroicons/vue/24/outline';
const emit = defineEmits(['setRoom']);
const { socket } = useWebSocket();
const { clientID, username } = useProfile();

const lobby = ref();
const hasJoin = ref(false);

socket.on('error', (error) => {
  console.error(error);
});

socket.on('prestart', (gameID) => {
  emit('setRoom', gameID);
});

socket.on('lobby', (game) => {
  lobby.value = game;
});

function join() {
  socket.emit('join-lobby-game', { clientID: clientID.value, username: username.value });
  hasJoin.value = true;
}
function quit() {
  socket.emit('quit-lobby-game');
  hasJoin.value = false;
}

const timer = computed(() => {
  const seconds = Math.max((lobby.value?.startAt - Date.now()) / 1000, 0);
  const secs = (seconds % 60).toFixed(0).padStart(2, '0');
  return `${secs}`;
});

const playersTable = computed(() => {
  return (lobby.value?.clients ?? []).concat(
    Array.from({ length: Math.max(0, 6 - (lobby.value?.clients ?? []).length) }),
  );
});

function getInitial(player) {
  return player?.username.charAt(0) ?? '';
}
function getUsername(player) {
  return player?.username ?? '';
}
onMounted(() => {
  console.log('onMounted', socket);
  socket.emit('join-lobby');
});
</script>

<template>
  <main class="h-full mx-auto p-4 sm:p-6 flex gap-6">
    <section
      class="h-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 shadow-xl flex-1"
    >
      <div v-if="lobby" class="h-1/6 flex items-center justify-center">
        <div class="max-w-20 bg-gray-200 rounded-full mt-2 md:mt-4 mb-2 md:mb-4 p-4">
          <span id="timer" class="text-4xl font-bold inline-block text-gray-500">
            {{ timer }}
          </span>
        </div>
      </div>

      <div class="h-4/6 py-5">
        <div class="h-full overflow-y-auto scroller">
          <table class="w-full table-fixed border-separate border-spacing-y-2">
            <tbody>
              <tr v-for="(player, index) in playersTable" :key="index">
                <td class="size-12 rounded-l-lg bg-blue-500 text-center bold">
                  {{ getInitial(player) }}
                </td>
                <td class="bg-blue-600 rounded-r-lg text-left pl-3">
                  {{ getUsername(player) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="w-full h-1/6">
        <div class="h-1/2">
          <button
            v-if="!hasJoin"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            @click.stop.prevent="join"
          >
            Rejoindre
          </button>

          <button
            v-else
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            @click.stop.prevent="quit"
          >
            Quitter
          </button>
        </div>

        <div class="h-1/2">
          <div class="h-full max-h-10 flex align-top">
            <PencilIcon class="flex-none max-w-12 p-1 bg-slate-100 rounded-l text-gray-500" />
            <input
              class="flex-auto rounded-r pl-3 text-gray-500"
              type="text"
              v-model="username"
              placeholder="Pseudo"
              :disabled="hasJoin"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="postcss" scoped>
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-thumb {
  /* Foreground */
  background: var(--scrollbar-foreground);
  background: rgb(59, 130, 246);
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-track {
  background: var(--scrollbar-background);
  background: transparent;
}
</style>
