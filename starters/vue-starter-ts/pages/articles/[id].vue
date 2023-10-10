<script setup lang="ts">
import type { Article } from '@pantheon-systems/pcc-vue-sdk'
import { ArticleRenderer } from '@pantheon-systems/pcc-vue-sdk/components'

const route = useRoute()
const articleId = route.params.id as string

const { data: article, error } = await useFetch<Article>(`/api/articles/${articleId}`)

if (error) {
  console.error(error)
}
</script>

<template>
  <div class="max-w-screen-lg mx-auto mt-16 prose">
    <h2 v-if="error" class="text-red-500">
      Failed to load article, please try again.
    </h2>
    <h2 v-else-if="!article">
      Loading...
    </h2>
    <div v-else>
      <ArticleRenderer :article="article" />
      <!-- <ArticleRenderer article={article} renderTitle={(titleElement)=> (
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">{titleElement}</h1>

          {article.updatedAt ? (
          <p className="py-2">
            Last Updated:{" "}
            {new Date(article.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            })}
          </p>
          ) : null}

          <hr className="mt-6 mb-8" />
        </div>
        )}
        smartComponentMap={pantheonAPIOptions.smartComponentMap}
        /> -->

      <div v-if="article.tags" className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
        <span class="font-normal">
          Tags:
          {{ article.tags.length > 0 ? article.tags?.join(', ') : 'none' }}
        </span>
      </div>
    </div>

  </div>
</template>