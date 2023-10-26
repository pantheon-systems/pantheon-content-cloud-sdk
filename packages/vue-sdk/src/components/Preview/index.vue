<script setup lang="ts">
import type { Article } from '@pantheon-systems/pcc-sdk-core/types';
import { PropType, ref } from 'vue-demi';
import DocsLogo from './assets/DocsLogo.vue'
import IconUp from './assets/IconUp.vue';
import LivePreviewIndicator from './LivePreviewIndicator.vue';

console.log("preview setup");

defineProps({
  article: Object as PropType<Article>,
});

const isHidden = ref(false);
const hasCopied = ref(false);
const isLive = ref(false);


// const onCopy = () => {
//   if (copyResetTimeoutId) {
//     clearTimeout(copyResetTimeoutId);
//     setCopyResetTimeoutId(null);
//   }

//   const parsedUrl = queryString.parseUrl(
//     window.location.href,
//     {
//       parseFragmentIdentifier: true,
//     },
//   );

//   const query = {
//     ...(parsedUrl.query || {}),
//     pccGrant,
//   };

//   navigator.clipboard.writeText(
//     `${parsedUrl.url}?${queryString.stringify(query)}${parsedUrl.fragmentIdentifier
//       ? `#${parsedUrl.fragmentIdentifier}`
//       : ""
//     }`,
//   );
//   setHasCopied(true);

//   // Reset the copied state after 2 seconds
//   const timeoutId = setTimeout(() => {
//     setHasCopied(false);
//   }, 2000);
//   setCopyResetTimeoutId(timeoutId);
// }


</script>

<template>
  <div class="wrapper">
    <div class="container">
      <a class="title-link">
        <DocsLogo />
        <span>{{ article?.title }}</span>
      </a>
      <div class="lpi-wrapper">
        <LivePreviewIndicator :isLive=isLive />

        <div class="end-block">
          <div class="copy-url-container">
            <button>
              {{ hasCopied ? "Copied URL" : "Copy URL" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="controller-container">
      <div v-if="isHidden">
        <LivePreviewIndicator :isLive=isLive />
        <button @click="isHidden = !isHidden">
          <template v-if="isHidden">
            <IconUp :flip=true />
          </template>
          <template v-else>
            <!-- <IconHamburger :style="{ margin - left: '10px' } " /> -->
          </template>
        </button>
      </div>
      <button v-else @click="isHidden = !isHidden">
        <IconUp />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  font-family: sans-serif;
  z-index: 5;
  position: absolute;
  top: 0;
  width: 100%;
  border-bottom: 1px solid #CFCFD3;
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: flex-end;
  background: white;
}

.container {
  padding-left: 20px;
  padding-block: 8px;
  display: grid;
  gap: 1em;
  width: 100%;

  @media (min-width: 768px) {
    padding-block: 0;
    grid-auto-flow: column;
    grid-template-columns: 0.45fr 0.55fr;
  }
}

.title-link {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #23232d;
  min-width: 0;

  >span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  >svg {
    flex-shrink: 0;
  }
}

.end-block {
  display: flex;
  flex-direction: row;
  column-gap: 4px;
  align-items: center;
  justify-content: flex-end;
}

.copy-url-container {
  >button {
    background-color: #ffdc28;
    height: 32px;
    font-size: 0.875rem;

    border-radius: 3px;
    font-weight: 700;
    padding: 0px 10px;
    color: rgb(35, 35, 45);

    &:hover {
      opacity: 0.8;
    }
  }
}

.lpi-wrapper {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  align-items: center;
}

.controller-container {
  cursor: pointer;
  padding: 16px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 8px;
    align-items: flex-start;
  }
}
</style>
