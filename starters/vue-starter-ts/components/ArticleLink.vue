<script lang="ts">
import { PropType } from "vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden rounded-lg shadow-lg">
    <a :href="/articles/ + id">
      <div class="relative flex-shrink-0 h-40 cursor-pointer hover:border-indigo-500 border-2s">
        <div class="w-full h-full bg-gradient-to-b from-blue-100 to-green-500"></div>
      </div>
    </a>
    <div class="mx-6 my-4 text-xl font-semibold leading-7 text-gray-900"><a
        href="/articles/102Lvnk3im6-jsu4D9RXVnv-hfd4H1ClbkzMGXF8J7AM">
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