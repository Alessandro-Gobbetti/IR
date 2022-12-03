<template>
  <input
      ref="input"
      class="form-control"
      placeholder="Search"
      :value="value"
      :onchange="(e)=>{
        this.value = e.target.value
        this.onchange(this.value)
        performQuery();
      }"
      :oninput="(e)=>{
        this.oninputchange(e)
       }"
  />
</template>

<script>
// Components
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "SearchBar",
  data() {
    return {
      // Current value of the input field
      value: this.initialValue,
      // The last fetched query
      last_query: null
    }
  },
  watch: {
    // Listener running on mount and when prop 'initialValue' changes.
    'initialValue': {
      handler() {
        // Does not do anything if it's the same value and has already fetched it.
        if (this.initialValue == this.value && this.last_query)
          return
        this.value = this.initialValue;
        if(this.fetchInitialValue)
          this.performQuery()
      },
      immediate: true
    }
  },

  methods: {
    // Runs the query and calls the callback function with the fetched results
    async performQuery(){
      // Avoids performing a fetch if the callback function is not defined.
      if(this.onresultschange)
        this.onresultschange(await this.fetchResults(this.value))
    },
    // Async runs a query and returns the results.
    async fetchResults(query) {
      console.log(`++ fetching query '${query}'++`)
      this.last_query = this.value
      return await store.getters.getResults(query)
    }
  },
  props: {
    initialValue: {
      type: String,
      default: ""
    },
    fetchInitialValue: {
      type: Boolean,
      default: false
    },
    // When the input value changes (eg any key press)
    oninputchange: {
      type: Function,
      default: (e)=>{}
    },
    // When the input is confirmed (eg 'Enter' key)
    onchange: {
      type: Function,
      default: (e)=>{}
    },
    // When the results are fetched. If none the fetch does not run in the first place.
    onresultschange: {
      type: Function,
    }
  },

  components: {
    // HelloWorld,
  },
});
</script>


<style scoped>
.form-control {
  width: 50%;
  margin: 3vh;
  border-radius: 10vh;
  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.form-control:focus { /* TODO: add suggestions */
  border: none;
  outline: none;
}
</style>
