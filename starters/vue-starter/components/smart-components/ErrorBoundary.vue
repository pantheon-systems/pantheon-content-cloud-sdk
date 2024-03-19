<template>
  <div>
    <slot v-if="!error" />
    <div v-else className="my-2 text-gray-400">
      Something went wrong while rendering this smart component.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
    };
  },
  errorCaptured(err, vm, info) {
    this.error = err;
    
    // Replace this with your own error logging solution
    console.error(err, info);

    // Prevent the error from propagating further
    return false;
  },
};
</script>