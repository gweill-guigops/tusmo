<script lang="ts" setup>
interface Player {
  id: string;
}

const emit = defineEmits(['setRoom']);
const { socket } = useWebSocket();
const { clientID, username } = useProfile();

const lobby = ref();
const hasJoin = ref(false);

socket.on('error', (error) => {
  console.error(error);
});

socket.on('prestart', (gameID) => {
  console.info('prestart', gameID);
  emit('setRoom', gameID);
});

socket.on('lobby', (game) => {
  lobby.value = game;
});

function join() {
  socket.emit('join-lobby', { clientID: clientID.value, username: username.value });
  hasJoin.value = true;
}
function quit() {
  socket.emit('quit-lobby');
  hasJoin.value = false;
}

const timer = computed(() => {
  const seconds = Math.max((lobby.value?.startAt - Date.now()) / 1000, 0);
  const secs = (seconds % 60).toFixed(0).padStart(2, '0');
  return `${secs}`;
});

const players = computed(() => {
  return lobby.value?.clients ?? [];
});
</script>

<template>
  <div className="bg-white p-6 rounded shadow-md w-screen m-6">
    <template v-if="lobby">
      <h3 className="text-xl font-bold mb-4">{{ players.length }} joueurs en attente</h3>
      <div class="flex items-center justify-center bg-gray-200 rounded-lg p-4 mt-8">
        <span id="timer" class="text-4xl font-bold"> {{ timer }} </span>
      </div>
      <div>Game : {{ lobby.id }}</div>
      <div>Socket : {{ socket.id }}</div>
    </template>

    <table>
      <thead>
        <tr>
          <th>username</th>
          <th>clientID</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.clientID">
          <td>
            {{ player.username }}
          </td>
          <td>
            {{ player.clientID }}
          </td>
        </tr>
      </tbody>
    </table>

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

    <input
      className="w-full border p-2 rounded mb-4"
      type="text"
      v-model="username"
      placeholder="Pseudo"
      :disabled="hasJoin"
    />

    <div className="w-full border p-2 rounded mb-4">clientID: {{ clientID }}</div>
  </div>
</template>

<style lang="postcss" scoped></style>
