declare module "*.vue" {
  import { defineComponent } from "vue-demi";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export default defineComponent<any, any, any>();
}
