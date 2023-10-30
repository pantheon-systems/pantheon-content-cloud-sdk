<script setup lang="ts">
import ArticlePreview from '../../components/article/ArticlePreview.vue';
import ArticleView from '../../components/article/ArticleView.vue';
import type { PantheonClientConfig } from '@pantheon-systems/pcc-vue-sdk';

const route = useRoute()
const config = useRuntimeConfig()

const { publishingLevel } = route.query
const pccSiteId = config.public.siteId
const pccGrant = useCookie('PCC-GRANT').value ?? route.query.pccGrant?.toString()

const pantheonConfig = {
  siteId: pccSiteId,
  pccGrant,
  apiKey: "not-needed-on-client",
} satisfies PantheonClientConfig

const articleId = route.params.id

const { data: article, error } = await useFetch(`/api/articles/${articleId}`, {
  query: {
    publishingLevel
  }
})

const isPreview = pccGrant && publishingLevel === "REALTIME";
</script>

<template>
  <ArticleView v-if="!isPreview" :article="article" :error="!!error" />
  <ArticlePreview v-else :article="article" :error="!!error" :pantheonConfig="pantheonConfig" />
</template>