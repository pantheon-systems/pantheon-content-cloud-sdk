<script setup lang="ts">
defineProps({
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
})
</script>

<template>
  <div class="w-full p-1">
    <div class="max-w-[300px] w-full outline outline-black/10 p-4 rounded-md">
      <h1 class="font-medium">{{ title }}</h1>
      <p class="my-4 text-sm">{{ body }}</p>
      <div class="pt-2">
        <input class="w-full p-2 border rounded-md border-black/10" />
      </div>
      <button class="px-4 py-2 mt-4 text-sm transition-opacity duration-200 rounded bg-[#FFDC28] hover:opacity-50">
        Submit
      </button>
    </div>
  </div>
</template>