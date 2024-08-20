<script setup lang="ts">
import type { Article } from "@pantheon-systems/pcc-vue-sdk";
import {
  ArticleRenderer,
  getArticleTitle,
} from "@pantheon-systems/pcc-vue-sdk/components";
import type { PropType } from "vue";
import "@pantheon-systems/pcc-vue-sdk/components/style.css";
import { smartComponentMap } from "../smart-components";

defineProps({
  article: {
    type: Object as PropType<Article | null>,
  },
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>

<template>
  <div class="prose mx-4 mt-16 text-black sm:mx-6 lg:mx-auto">
    <h2 v-if="error" class="text-red-500">
      Failed to load article, please try again.
    </h2>
    <h2 v-else-if="!article">Loading...</h2>
    <div v-else>
      <div>
        <div class="text-5xl font-bold">
          {{ getArticleTitle(article) }}
        </div>
        <p class="py-2" v-if="article.updatedAt">
          {{
            new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }}
        </p>
      </div>
      <ArticleRenderer
        :article="article"
        :smart-component-map="smartComponentMap"
      >
      </ArticleRenderer>
    </div>
  </div>
</template>
