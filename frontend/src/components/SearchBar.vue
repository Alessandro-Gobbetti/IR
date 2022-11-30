<template>
  <!-- input text -->
  <input
    type="text"
    class="form-control"
    placeholder="Search"
  />
</template>

<script>
// Components
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchBar",

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
