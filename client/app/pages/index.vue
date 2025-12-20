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
  <div class="relative min-h-screen bg-slate-950 overflow-hidden">
    <div class="snow">
      <ClientOnly>
        <Room v-if="inGame" :roomID="roomID" @quit-room="joinLobby" />
        <Lobby v-else @setRoom="joinRoom" />
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.snow {
  position: relative;
  min-height: 100vh;
  background: radial-gradient(circle at top, #0b1020, #020617);
  overflow: hidden;
}

/* couche neige lente */
.snow::before,
.snow::after {
  content: '';
  position: absolute;
  inset: 0;
  background-repeat: repeat;
  pointer-events: none;
}

.snow::before {
  background-image:
    radial-gradient(2px 2px at 20% 10%, white 50%, transparent 60%),
    radial-gradient(1px 1px at 40% 30%, white 50%, transparent 60%),
    radial-gradient(2px 2px at 60% 20%, white 50%, transparent 60%),
    radial-gradient(1px 1px at 80% 40%, white 50%, transparent 60%);
  background-size: 200px 200px;
  animation: snow-fall 20s linear infinite;
  opacity: 0.6;
}

/* couche neige rapide */
.snow::after {
  background-image:
    radial-gradient(1px 1px at 10% 20%, white 50%, transparent 60%),
    radial-gradient(2px 2px at 50% 60%, white 50%, transparent 60%),
    radial-gradient(1px 1px at 70% 80%, white 50%, transparent 60%);
  background-size: 150px 150px;
  animation: snow-fall 10s linear infinite;
  opacity: 0.4;
}

@keyframes snow-fall {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}
</style>
