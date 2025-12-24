<script lang="ts" setup>
import { LockClosedIcon, LockOpenIcon } from '@heroicons/vue/24/outline';

const intro = ref(true);
function skipIntro() {
  intro.value = false;
}

const s0 = ref('');
const s1 = ref('');
const s2 = ref('');
const s3 = ref('');
const s4 = ref('');
const s5 = ref('');
const s6 = ref('');
const s7 = ref('');

const solutions = ['7YLK', 'PM2T', 'QG6O', '3SLJ', '8!BA', 'G5BX', 'UX4A', 'A1IR'];

function isOk(input: string, number: number) {
  return input?.toUpperCase() === solutions[number];
}

const isValid = computed(() => {
  return (
    s0.value?.toUpperCase() === solutions[0] &&
    s1.value?.toUpperCase() === solutions[1] &&
    s2.value?.toUpperCase() === solutions[2] &&
    s3.value?.toUpperCase() === solutions[3] &&
    s4.value?.toUpperCase() === solutions[4] &&
    s5.value?.toUpperCase() === solutions[5] &&
    s6.value?.toUpperCase() === solutions[6] &&
    s7.value?.toUpperCase() === solutions[7]
  );
});

const waited = ref(false);

function wait() {
  setTimeout(() => {
    waited.value = true;
  }, 5000);
}
</script>

<template>
  <div class="w-full h-full bg-orange-800">
    <div v-if="intro" class="min-h-screen flex flex-col items-center justify-center">
      <p>Chère famille, l'heure de découvrir notre futur nouveau membre a sonné.</p>
      <p>
        Il ou elle se sait déjà très aimé, et il aura une chance inouïe de découvrir vos
        singularités, les mêmes qui font de chacun d'entres vous, des êters humains exceptionnels.
      </p>
      <p>
        Je compte sur vous pour déchiffrer cette énigme en retrouvant les différentes clés
        éparpillées dans le salon et le bureau.
      </p>
      <p>Je vous aime &hearts;</p>

      <div class="w-full flex justify-center">
        <button class="border mt-5 p-5" @click.prevent="skipIntro">C'est parti !</button>
      </div>
    </div>
    <div v-else>
      <div v-if="!waited">
        <div v-if="!isValid">
          <p>Maman, ton rendez-vous avec Victor Newman y est incontournable !</p>
          <p>Papa, il n'y a qu'ici que le yen vaut plus que l'euro !</p>
          <p>Inès, tu trouveras le tien entre Hyrule et Poudlard !</p>
          <p>Médina, petite mais costaude, 5, 10 ou 15, tu les portes maintenant sans effort !</p>
          <p>
            Sofia, tu trouveras ton sceau où repose l'ingrédient secret pas si secret de ta purée !
          </p>
          <p>
            Amina, après avoir cotoyé une fameuse Gisèle, tu pourrais te piquer aux épines d'un
            certain Robert
          </p>
          <p>
            Liess, spécialiste incontesté de cette concoction, sans elle, ta préparation serait
            incomplète
          </p>
          <p>
            Pour terminer, vous trouverez la dernière clé dans un autre récipient parmi tant
            d'autres, celui-ci est le symbole de ma réussite de cette année !
          </p>
        </div>

        <div v-if="!isValid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 w-full">
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s0, 0)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />
            <input
              :disabled="isOk(s0, 0)"
              v-model="s0"
              placeholder="Maman"
              type="text"
              class="h-full w-full bg-sky-500"
            />
          </div>

          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s1, 1)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s1"
              :disabled="isOk(s1, 1)"
              placeholder="Papa"
              type="text"
              class="h-full w-full bg-yellow-300"
            />
          </div>
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s2, 2)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s2"
              :disabled="isOk(s2, 2)"
              placeholder="Inès"
              type="text"
              class="h-full w-full bg-orange-500"
            />
          </div>
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s3, 3)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s3"
              :disabled="isOk(s3, 3)"
              placeholder="Médina"
              type="text"
              class="h-full w-full bg-pink-300"
            />
          </div>
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s4, 4)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s4"
              :disabled="isOk(s4, 4)"
              placeholder="Sofia"
              type="text"
              class="h-full w-full bg-red-500"
            />
          </div>
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s5, 5)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s5"
              :disabled="isOk(s5, 5)"
              placeholder="Amina"
              type="text"
              class="h-full w-full bg-cyan-500"
            />
          </div>
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s6, 6)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s6"
              :disabled="isOk(s6, 6)"
              placeholder="Liess"
              type="text"
              class="h-full w-full bg-lime-200"
            />
          </div>
          <div class="relative h-10 md:h-20">
            <LockClosedIcon
              v-if="!isOk(s7, 7)"
              class="absolute pointer-events-none h-full w-full opacity-30"
            />
            <LockOpenIcon v-else class="absolute pointer-events-none h-full w-full opacity-30" />

            <input
              v-model="s7"
              :disabled="isOk(s7, 7)"
              placeholder="Mélisa"
              type="text"
              class="h-full w-full bg-sky-500"
            />
          </div>
        </div>
        <div v-if="isValid" class="min-h-screen flex flex-col items-center justify-center">
          <p>
            Félicitations à vous, tous les sceaux ont été brisés, la vérité peut maintenant être
            délivrée ! Gloire ! Célébrations !
          </p>

          <p class="border">
            <a
              @click="wait"
              href="https://www.youtube.com/watch?v=xvFZjo5PgG00"
              target="_blank"
              rel="noopener noreferrer"
              >Cliquez ici pour la révalation finale
            </a>
          </p>
        </div>
      </div>
      <div v-else class="min-h-screen flex items-center justify-center">
        <p>
          Trève de plaisanterie, rassemblez chaque papier, triez-les par le numéro inscrit dessus et
          ne conservez que la lettre suivante ! &hearts;
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
p,
button,
input {
  @apply font-mono text-sm  md:text-xl lg:text-2xl placeholder-white;
  text-align: center;
}

input {
  @apply uppercase text-white;
}

@font-face {
  font-family: 'Veneer W01 Two';
  src: url('https://db.onlinewebfonts.com/t/effd74cbf0d7ec814ef5b5c8b44e0988.eot');
  src:
    url('https://db.onlinewebfonts.com/t/effd74cbf0d7ec814ef5b5c8b44e0988.eot?#iefix')
      format('embedded-opentype'),
    url('https://db.onlinewebfonts.com/t/effd74cbf0d7ec814ef5b5c8b44e0988.woff2') format('woff2'),
    url('https://db.onlinewebfonts.com/t/effd74cbf0d7ec814ef5b5c8b44e0988.woff') format('woff'),
    url('https://db.onlinewebfonts.com/t/effd74cbf0d7ec814ef5b5c8b44e0988.ttf') format('truetype'),
    url('https://db.onlinewebfonts.com/t/effd74cbf0d7ec814ef5b5c8b44e0988.svg#Veneer W01 Two')
      format('svg');
}
</style>
