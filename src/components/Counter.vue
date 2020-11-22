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
  ref,
  onMounted,
  computed
} from "@vue/composition-api";
import axios from "axios";
Vue.use(CompositionApi);

type Status = "ok" | "error:fetch" | "error:save" | "loading";

const msg: Omit<Record<Status, string>, "ok"> = {
  loading: "読み込み中",
  "error:fetch": "読み込みに失敗",
  "error:save": "保存に失敗"
};

const fetchCount = axios
  .get<{ count: string }>("/api/count")
  .then(({ data }) => data.count)
  .then(c => parseInt(c, 10));

const saveCount = (count: number) =>
  axios
    .post<{ count: string }>("/api/count", { count })
    .then(({ data }) => data.count)
    .then(c => parseInt(c, 10));

export default defineComponent({
  props: {
    msg: {
      type: String as PropType<string>,
      default: "default msg"
    }
  },
  setup() {
    const count = ref(0);
    const state = ref<Status>("ok");
    onMounted(() => {
      state.value = "loading";
      return fetchCount
        .then(c => {
          count.value = c;
          state.value = "ok";
        })
        .catch(() => {
          state.value = "error:fetch";
        });
    });
    return {
      count,
      status,
      text: computed(() => {
        switch (state.value) {
          case "ok":
            return count.value;
          default:
            return msg[state.value];
        }
      }),
      increment: () => count.value++,
      decrement: () => count.value--,
      save: () =>
        saveCount(count.value)
          .then(c => {
            count.value = c;
            state.value = "ok";
          })
          .catch(() => {
            state.value = "error:save";
          })
    };
  }
});
</script>
