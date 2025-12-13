<script lang="ts" setup>
const inGame = ref(false);
const roomID = ref('');

function joinRoom(id: string) {
  inGame.value = true;
  roomID.value = id;
}
</script>

<template>
  <ClientOnly>
    <Room v-if="inGame" :roomID="roomID" />
    <Lobby v-else @setRoom="joinRoom" />
  </ClientOnly>
</template>
