<script setup lang="ts">
import type { PropType } from 'vue';
import { ArticleRenderer, getArticleTitle } from '@pantheon-systems/pcc-vue-sdk/components'
import type { Article } from '@pantheon-systems/pcc-vue-sdk'
import '@pantheon-systems/pcc-vue-sdk/components/style.css'

import { smartComponentMap } from '../smart-components';

defineProps({
  article: {
    type: Object as PropType<Article | null>,
  },
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<template>
  <div class="max-w-screen-lg mx-auto mt-16 prose text-black">
    <h2 v-if="error" class="text-red-500">
      Failed to load article, please try again.
    </h2>
    <h2 v-else-if="!article">
      Loading...
    </h2>
    <div v-else>
      <div>
        <div class="text-3xl font-bold md:text-4xl">
          {{ getArticleTitle(article) }}
        </div>
        <p class="py-2" v-if="article.updatedAt">
          Last Updated:
          {{
            new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </p>
        <hr class="mt-6 mb-8">
      </div>
      <ArticleRenderer :article="article" :smart-component-map="smartComponentMap">
      </ArticleRenderer>

      <div v-if="article.tags" className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
        <span class="font-normal">
          Tags:
          {{ article.tags.length > 0 ? article.tags?.join(', ') : 'none' }}
        </span>
      </div>
    </div>
  </div>
</template>