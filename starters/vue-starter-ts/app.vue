<script setup lang="ts">
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <NuxtLayout>
    <div
      class="flex flex-col max-h-screen min-h-screen overflow-x-hidden min-w-screen max-w-screen"
    >
      <div id="__pcc-portal-target__" />
      <Header />
      <main class="mb-auto">
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </NuxtLayout>
</template>
