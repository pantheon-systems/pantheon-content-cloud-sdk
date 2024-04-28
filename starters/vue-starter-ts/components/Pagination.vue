<script setup lang="ts">
import { computed } from 'vue';
import ArrowLeft from './icons/ArrowLeft.vue';
import ArrowRight from './icons/ArrowRight.vue';

const props = defineProps<{
  totalCount: number,
  pageSize: number,
  currentPage: number,
  onChange: (page: number) => void,
  disabled: boolean
}>();

const pageCount = computed(() => Math.ceil(props.totalCount / props.pageSize));
const showPrevButton = computed(() => props.currentPage > 0);
const showNextButton = computed(() => props.currentPage + 1 < pageCount.value);

const goToNextPage = () => {
  const newPage = Math.min(props.currentPage + 1, pageCount.value - 1);
  props.onChange(newPage);
};

const goToPreviousPage = () => {
  const newPage = Math.max(props.currentPage - 1, 0);
  props.onChange(newPage);
};
</script>

<template>
  <div class="my-5 flex items-center">
    <button v-if="showPrevButton" @click="goToPreviousPage"
      class="rounded flex px-3 py-2 text-base font-bold hover:bg-slate-100" :disabled="disabled">
      <ArrowLeft />
      <div class="ml-2">Previous</div>
    </button>
    <div class="px-2">{{ currentPage + 1 }} of {{ pageCount }}</div>
    <button v-if="showNextButton" @click="goToNextPage"
      class="rounded flex px-3 py-2 text-base font-bold hover:bg-slate-100" :disabled="disabled">
      <div class="mr-2">Next</div>
      <ArrowRight />
    </button>
  </div>
</template>
