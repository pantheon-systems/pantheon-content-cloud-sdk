<script setup lang="ts">
defineProps({
  fill: { type: String, required: true },
});
</script>

<template>
  <svg width="6" height="6" viewBox="0 0 6 6" :fill="fill" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3" cy="3" r="3" :fill=fill />
  </svg>
</template>