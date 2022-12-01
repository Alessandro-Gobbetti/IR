<template>
  <!-- input text -->
  <input
    type="text"
    class="form-control"
    placeholder="Search"
    :onchange="this.onchange"
    :oninput="this.oninputchange"
  />
</template>

<script>
// Components
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchBar",
  props: {
    // When the input value changes (eg any key press)
    oninputchange: {
      type: Function,
      default: (e)=>{}
    },
    // When the inout is confirmed (eg 'Enter' key)
    onchange: {
      type: Function,
      default: (e)=>{}
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
  margin-left: 25%;
  border-radius: 10vh;
  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.form-control:focus { /* TODO: add suggestions */
  border: none;
  outline: none;
}
</style>
