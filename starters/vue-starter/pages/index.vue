<script setup>
import ArticleLink from "../components/ArticleLink.vue";

const { data, error } = await useFetch("/api/articles/")
</script>

<template>
  <div class="flex flex-col mx-auto mt-20 prose sm:prose-xl max-w-fit">
    <h1 class="h-full text-4xl prose text-center">
      Welcome to
      <nuxt-link class="text-blue-600 no-underline hover:underline" href="https://nuxt.com">
        Nuxt!
      </nuxt-link>
    </h1>
    <div class="text-2xl">
      <div class="flex items-center justify-center max-w-lg p-4 mx-auto text-white bg-black rounded">
        Decoupled PCC on
        <img src="/pantheon.png" style="margin: 0;" alt="Pantheon Logo" :width="191" :height="60" />
      </div>
    </div>

    <section>
      <h2 v-if="error" class="text-red-500">
        Failed to load articles, please try again.
      </h2>
      <h2 v-else-if="!data">
        Loading...
      </h2>
      <div v-else class="grid gap-5 mx-auto mt-12 max-w-content lg:max-w-screen-lg lg:grid-cols-3">
        <article-link v-for="article in data" :key="article.id" :id="article.id" :title="article.title || 'Untitled'"
          :tags="article.tags || []" />
      </div>
    </section>
  </div>
</template>