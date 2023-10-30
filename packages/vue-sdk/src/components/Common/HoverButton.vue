<template>
  <button
    @mouseover="isHovered = true"
    @focus="isHovered = true"
    @mouseout="isHovered = false"
    @blur="isHovered = false"
    :style="style"
    :class="class"
    v-bind="$attrs"
  >
    <slot :isHovered="isHovered"></slot>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue-demi";

const isHovered = ref(false);

defineProps({
  style: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },
});
</script>
