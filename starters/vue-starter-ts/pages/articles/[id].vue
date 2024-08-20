<script setup lang="ts">
import ArticlePreview from '../../components/article/ArticlePreview.vue';
import ArticleView from '../../components/article/ArticleView.vue';
import { type Article, type ArticleWithoutContent, type PantheonClientConfig } from '@pantheon-systems/pcc-vue-sdk';

const route = useRoute()
const config = useRuntimeConfig()

const { publishingLevel } = route.query
const pccSiteId = config.public.siteId
const pccGrant = (route.query.pccGrant?.toString() ?? useCookie('PCC-GRANT').value) || undefined

const pantheonConfig = {
  siteId: pccSiteId,
  pccGrant,
  apiKey: "not-needed-on-client",
} satisfies PantheonClientConfig

const articleId = route.params.id
const { data, error } = await useFetch<{article:Article, recommendedArticles: ArticleWithoutContent[]}>(`/api/articles/${articleId}`, {
  query: {
    publishingLevel
  }
})

const isPreview = pccGrant && publishingLevel === "REALTIME";
</script>

<template>
  <ArticleView v-if="!isPreview" :article="data?.article" :error="!!error" />
  <ArticlePreview v-else :article="data?.article" :error="!!error" :pantheonConfig="pantheonConfig" />
  
  <div class="max-w-screen-lg mx-auto mt-16 prose text-black">
    <h3>Recommended Articles</h3>
    <div class="grid gap-5 mx-auto mt-12 max-w-content lg:max-w-screen-lg lg:grid-cols-3">
      <article-link v-for="article in data?.recommendedArticles" :key="article.id" :article="article"/>
    </div>
  </div>
</template>