<script lang="ts">
export default {
  data() {
    return {
      error: null as Error | null,
    };
  },
  errorCaptured(err, vm, info) {
    this.error = err as Error;

    console.error(err, info);

    // Prevent the error from propagating further
    return false;
  },
};
</script>

<template>
  <div>
    <slot v-if="!error" />
    <div v-else>Something went wrong while rendering this smart component.</div>
  </div>
</template>
