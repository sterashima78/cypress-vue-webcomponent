import { ref, computed, Ref, SetupContext } from "@vue/composition-api";
import axios from "axios";

export type Status = "ok" | "error:fetch" | "error:save" | "loading";
export type Message = Omit<Record<Status, string>, "ok">;
export const msg: Message = {
  loading: "読み込み中",
  "error:fetch": "読み込みに失敗",
  "error:save": "保存に失敗"
};

type FetchCount = () => Promise<number>;
type SaveCount = (count: number) => Promise<number>;

export const fetchCount: FetchCount = () =>
  axios
    .get<{ count: string }>("/api/count")
    .then(({ data }) => data.count)
    .then(c => parseInt(c, 10));

export const saveCount: SaveCount = (count: number) =>
  axios
    .post<{ count: string }>("/api/count", { count })
    .then(({ data }) => data.count)
    .then(c => parseInt(c, 10));

export const init = (
  count: Ref<number>,
  state: Ref<Status>,
  fetch: FetchCount,
  emit: SetupContext["emit"]
) => () => {
  state.value = "loading";
  return fetch()
    .then(c => {
      count.value = c;
      state.value = "ok";
    })
    .catch(() => {
      state.value = "error:fetch";
      emit("loaderr");
    });
};

export const save = (
  count: Ref<number>,
  state: Ref<Status>,
  save: SaveCount
) => () =>
  save(count.value)
    .then(c => {
      count.value = c;
      state.value = "ok";
    })
    .catch(() => {
      state.value = "error:save";
    });

export const toMessage = (
  count: Ref<number>,
  state: Ref<Status>,
  messages: Message
) => () => {
  switch (state.value) {
    case "ok":
      return count.value;
    default:
      return messages[state.value];
  }
};

export const useCounter = (
  onMounted: (fn: () => void) => void,
  emit: SetupContext["emit"]
) => {
  const count = ref(0);
  const state = ref<Status>("ok");
  onMounted(init(count, state, fetchCount, emit));
  return {
    count,
    status,
    text: computed(toMessage(count, state, msg)),
    increment: () => count.value++,
    decrement: () => count.value--,
    save: save(count, state, saveCount)
  };
};
