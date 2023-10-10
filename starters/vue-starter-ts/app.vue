<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col max-h-screen min-h-screen overflow-x-hidden min-w-screen max-w-screen">
      <Header />
      <main class="mb-auto">
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </NuxtLayout>
</template>
