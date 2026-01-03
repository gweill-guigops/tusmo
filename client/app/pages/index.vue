<script lang="ts" setup>
const inGame = ref(false);
const roomID = ref('');

function joinRoom(id: string) {
  inGame.value = true;
  roomID.value = id;
}

function joinLobby() {
  inGame.value = false;
  roomID.value = '';
}
</script>

<template>
  <div class="h-dvh flex flex-col overflow-hidden bg-slate-950">
    <ClientOnly>
      <Room v-if="inGame" :roomID="roomID" @quit-room="joinLobby" />
      <Lobby v-else @setRoom="joinRoom" />
    </ClientOnly>
  </div>
</template>

<style lang="postcss" scoped></style>
