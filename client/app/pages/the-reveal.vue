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
        Nous comptons sur vous pour déchiffrer cette énigme en rettrouvant différentes clés
        éparpillées dans la maison.
      </p>
      <p>&hearts; &hearts; &hearts;</p>

      <div class="w-full flex justify-center">
        <button class="border mt-5 p-5" @click.prevent="skipIntro">C'est parti !</button>
      </div>
    </div>
    <div v-else>
      <div v-if="!waited">
        <div v-if="!isValid">
          <p>Maman, tu l'as porté le jour où tu as dit oui à ton éphèbe !</p>
          <p>
            Papa, sans elle, tu es perdu, à la maison ou en vacances, elle t'accompagne pendant des
            heures !
          </p>
          <p>Pips, ta porte y est toujours ouverte, mais ce n'est pas ta chambre...</p>
          <p>
            Chaque année, pour contenter Bacchus, papa remplit cette pièce de nouvelles offrandes !
          </p>
          <p>
            Le dernier bolide de maman en a besoin pour démarrer mais elle reste à l'abri des
            regards !
          </p>
          <p>Pips, tu y entretiens ton corps de rêve !</p>
          <p>Papa, nous t'avons régulièrement vu déambuler et te déhancher prêt de cet objet !</p>
          <p>Maman et Pips, ce lieu est le témoin de vos miracles culinaires</p>
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
              placeholder="Maman 1"
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
              placeholder="Papa 1"
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
              placeholder="Pips 1"
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
              placeholder="Papa 2"
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
              placeholder="Maman 2"
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
              placeholder="Pips 2"
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
              placeholder="Papa 3"
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
              placeholder="Mams & Pips"
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
