<template>
  <div>
    <h1>{{ msg }}</h1>
    <span v-text="text" />
    <button data-test="increment" @click="increment">increment</button>
    <button data-test="decrement" @click="decrement">decrement</button>
    <button data-test="save" @click="save">save</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CompositionApi, {
  defineComponent,
  PropType,
  onMounted
} from "@vue/composition-api";
import { useCounter } from "./counter.composition";
Vue.use(CompositionApi);

export default defineComponent({
  props: {
    msg: {
      type: String as PropType<string>,
      default: "default msg"
    }
  },
  setup(_, { emit }) {
    return useCounter(onMounted, emit);
  }
});
</script>
