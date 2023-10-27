<script setup>
import ArticlePreview from '../../components/article/ArticlePreview.vue';
import ArticleView from '../../components/article/ArticleView.vue';

const route = useRoute()
const config = useRuntimeConfig()

const pccGrant = useCookie('PCC-GRANT')
const pccSiteId = config.public.NUXT_PCC_SITE_ID

const pantheonConfig = {
  siteId: pccSiteId,
  pccGrant: pccGrant.value,
  apiKey: "not-needed-on-client",
}

const articleId = route.params.id
const { publishingLevel } = route.query

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