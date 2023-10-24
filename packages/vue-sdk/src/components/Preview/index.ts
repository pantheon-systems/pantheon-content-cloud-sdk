import type { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { defineComponent, PropType } from "vue-demi";

const PreviewBar = defineComponent({
  name: "PreviewBar",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  setup(props) {
    console.log("preview setup", props.article);
  },
  data() {
    return {
      article: this.$props.article,
    };
  },
  template: `
    <div class="wrapper">
      <link rel="stylesheet" href="./preview.css" />
      <h1>Preview Bar</h1>
      <p>{{ article.title }}</p>
    </div>
  `,
});

export default PreviewBar;
