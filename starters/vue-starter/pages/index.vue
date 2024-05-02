<script setup>
import ArticleLink from "../components/ArticleLink.vue";
import Pagination from "../components/Pagination.vue";
import usePagination from "../hooks/usePagination";

const PAGE_SIZE = 20

const {
  totalCount,
  articlePages,
  currentPage,
  fetching,
  error,
  onPageChange
} = await usePagination({ pageSize: PAGE_SIZE })

const data = computed(() => articlePages.value[currentPage.value])
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
      <h2 v-else-if="fetching">
        Loading...
      </h2>
      <div v-else class="mx-auto mt-12 max-w-content lg:max-w-screen-lg ">
        <div>
          <pagination :total-count="totalCount" :page-size="PAGE_SIZE" :current-page="currentPage"
            :on-change="onPageChange" :disabled="fetching" />
        </div>
        <div class="grid gap-5 lg:grid-cols-3">
          <article-link v-for="article in data" :key="article.id" :article="article" />
        </div>
      </div>
    </section>
  </div>
</template>