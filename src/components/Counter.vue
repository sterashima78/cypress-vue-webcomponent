<template>
  <div>
    <span>{{ count }}</span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  data() {
    return {
      count: 0,
      state: "ok"
    };
  }
  // mounted: ()=> this.fetchState,
  // methods: {
  //   fetchState: () => {
  //     axios
  //       .get<{ count: string }>("/api/count")
  //       .then(({ data }) => data.count)
  //       .then(count => (this.count = parseInt(count, 10)))
  //       .catch(() => (this.state = "error:fetch"));
  //   }
  // }
  // saveState: ()=> {
  //   this.state = "loading"
  //   fetch("/api/count", {
  //     method : "post",
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: JSON.stringify({ count: this.count })
  //   })
  //   .then(d => d.json())
  //   .then(({ count })=> {
  //     this.count = count
  //     this.state = "ok"
  //   })
  //   .catch(()=> this.state = "error:save")
  // },
  // increment: ()=> this.count++,
  // decrement: ()=> this.count--,
  // }
});
</script>
