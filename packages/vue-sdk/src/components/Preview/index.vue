<script setup lang="ts">
import type { Article } from '@pantheon-systems/pcc-sdk-core/types';
import { PropType } from 'vue';

console.log("preview setup");

defineProps({
  article: Object as PropType<Article>,
});

</script>

<template>
  <div class="wrapper">
    <h1>Preview bar</h1>
    <p>{{ article?.title }}</p>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: turquoise;
}
</style>
