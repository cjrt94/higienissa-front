// https://nuxt.com/docs/api/configuration/nuxt-config
// Grupo Higienissa — Nuxt 3, JS nativo. Render híbrido por routeRules:
//  · Público corporativo → SSG/prerender (Firestore solo en build/server, sin SDK en cliente)
//  · /admin/** → SPA protegida (ssr:false), SDK Firebase reactivo fuera del bundle público
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  ssr: true,

  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/site.css',
    '~/assets/css/sections.css',
  ],

  modules: [
    '@nuxtjs/i18n',
  ],

  i18n: {
    strategy: 'prefix',
    defaultLocale: 'es',
    detectBrowserLanguage: false, // toggle manual ES|EN (como el wireframe)
    langDir: 'locales',
    lazy: true,
    locales: [
      { code: 'es', language: 'es-PE', name: 'Español', file: 'es.json', dir: 'ltr' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json', dir: 'ltr' },
    ],
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://higienissa.com',
    bundle: { optimizeTranslationDirective: false },
  },

  routeRules: {
    '/**': { prerender: true },
    '/admin/**': { ssr: false, prerender: false, robots: false, index: false },
  },

  runtimeConfig: {
    // Solo server (no expuesto al cliente)
    firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT || '',
    vercelDeployHook: process.env.VERCEL_DEPLOY_HOOK || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://higienissa.com',
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '',
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', href: '/logos/isotipo-azul.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },
})
