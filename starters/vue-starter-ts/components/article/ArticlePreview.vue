<script setup lang="ts">
import { useArticle, pccPlugin, type Article, type PantheonClientConfig } from '@pantheon-systems/pcc-vue-sdk'
import ArticleView from './ArticleView.vue';
import { ref, watch, onMounted, PropType } from 'vue';

const props = defineProps({
  article: {
    type: Object as PropType<Article | null>,
  },
  error: {
    type: Boolean,
    required: false,
    default: false,
  },
  pantheonConfig: {
    type: Object as PropType<PantheonClientConfig>,
    required: true,
  },
})

const hydratedArticle = ref(props.article)
const error = ref(props.error)

onMounted(() => {
  // Hydrate the article client-side
  const nuxtApp = useNuxtApp()
  nuxtApp.vueApp.use(pccPlugin, props.pantheonConfig)

  if (!props.article)
    return

  const { article, error: fetchedError } = useArticle(props.article.id, {
    publishingLevel: props.article.publishingLevel ?? "REALTIME",
  })

  watch(article, (newData) => {
    if (newData)
      hydratedArticle.value = newData
  })

  if (fetchedError.value) {
    console.error(fetchedError.value)
    error.value = true
  }
})
</script>

<template>
  <ArticleView :article="hydratedArticle" :error="error" />
</template>