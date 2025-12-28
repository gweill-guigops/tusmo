export default defineNuxtConfig({
  app: {
    head: {
      title: 'Trismo',
      meta: [{ name: 'description', content: 'Découvrez les 4 mots à la suite.' }],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
});
