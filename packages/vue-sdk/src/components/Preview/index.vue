<script setup lang="ts">
import type { Article } from "@pantheon-systems/pcc-sdk-core/types";
import queryString from "query-string";
import { PropType, ref, watchEffect } from "vue-demi";

import DocsLogo from "./assets/DocsLogo.vue";
import IconUp from "./assets/IconUp.vue";
import LivePreviewIndicator from "./LivePreviewIndicator.vue";
import HamburgerIcon from "./assets/HamburgerIcon.vue";
import HoverButton from "../Common/HoverButton.vue";
import { getCookie } from "../../utils/cookies";

const props = defineProps({
  article: Object as PropType<Article>,
});

const isLive = ref(false);
const isHidden = ref(false);
const hasCopied = ref(false);
const copyResetTimeoutId = ref<NodeJS.Timeout | null>(null);
const pccGrant = getCookie("PCC-GRANT");

function copyURL() {
  if (copyResetTimeoutId.value) {
    clearTimeout(copyResetTimeoutId.value);
    copyResetTimeoutId.value = null;
  }

  const parsedUrl = queryString.parseUrl(window.location.href, {
    parseFragmentIdentifier: true,
  });

  const query = {
    pccGrant,
    ...parsedUrl.query,
  };

  navigator.clipboard.writeText(
    `${parsedUrl.url}?${queryString.stringify(query)}${parsedUrl.fragmentIdentifier ? `#${parsedUrl.fragmentIdentifier}` : ""
    }`,
  );

  hasCopied.value = true;

  // Reset the copied state after 2 seconds
  const timeoutId = setTimeout(() => {
    hasCopied.value = false;
  }, 2000);

  copyResetTimeoutId.value = timeoutId;
}

watchEffect(() => {
  const article = props.article;

  if (!article?.previewActiveUntil) return;

  const livePreviewTimeRemaining = article.previewActiveUntil - Date.now();
  if (livePreviewTimeRemaining >= 100) {
    isLive.value = true;
    setTimeout(() => {
      isLive.value = false;
    }, livePreviewTimeRemaining);
  }
});
</script>

<template>
  <div :class="['wrapper', isHidden && 'hidden']">
    <div v-if="!isHidden" class="container">
      <a class="title-link">
        <DocsLogo />
        <span>{{ article?.title }}</span>
      </a>
      <div class="lpi-wrapper">
        <LivePreviewIndicator :isLive="isLive" />

        <div class="end-block">
          <div class="copy-url-container">
            <button @click="copyURL">
              {{ hasCopied ? "Copied URL" : "Copy URL" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div :class="['controller-container', isHidden && 'active']">
      <div v-if="isHidden">
        <LivePreviewIndicator :isLive="isLive" />
        <HoverButton @click="isHidden = !isHidden">
          <template v-slot="{ isHovered }">
            <template v-if="!isHidden || isHovered">
              <IconUp :flip="true" />
            </template>
            <template v-else>
              <HamburgerIcon />
            </template>
          </template>
        </HoverButton>
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
  border-bottom: 1px solid #cfcfd3;
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: flex-end;
  background: white;
}

.wrapper.hidden {
  border-bottom: 1px solid transparent;
  background: transparent;
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

.controller-container.active {
  background: #f1f1f1;
  border-radius: 3px;
  box-shadow: 0px 3px 8px 0px #00000026;

  >div {
    display: flex;
    flex-direction: row;
    column-gap: 10px;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
