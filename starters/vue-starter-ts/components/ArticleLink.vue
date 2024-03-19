<script lang="ts">
import type { PropType } from "vue";
import type { ArticleWithoutContent } from "@pantheon-systems/pcc-vue-sdk";

export default {
  props: {
    article: {
      type: Object as PropType<ArticleWithoutContent>,
      required: true,
    },
  },
  computed: {
    heroImage(): string | null {
      const heroImage = this.article.metadata?.['Hero Image'];
      
      return typeof heroImage === 'string' ? heroImage : null;
    },
    identifier(): string {
      return this.article.slug || this.article.id;
    },
    tags(): string[] {
      return this.article.tags || [];
    },
    title(): string {
      return this.article.title || "Untitled Article";
    },
  },  
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden rounded-lg shadow-lg">
    <a :href="/articles/ + identifier">
      <div class="relative flex-shrink-0 h-40 cursor-pointer hover:border-indigo-500 border-2s not-prose">
        <img v-if="heroImage != null" :src="heroImage" alt="Article Hero Image" class="object-cover w-full h-full" />
        <div v-else class="w-full h-full bg-gradient-to-b from-blue-100 to-green-500"></div>
      </div>
    </a>
    <div class="mx-6 my-4 text-xl font-semibold leading-7 text-gray-900">
      <a :href="/articles/ + identifier">
        <div class="hover:scale-105">{{ title }}</div>
      </a>
      <div class="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
        <span class="font-normal">
          Tags:
          {{ tags.length > 0 ? tags?.join(', ') : 'none' }}
        </span>
      </div>
    </div>
  </div>
</template>