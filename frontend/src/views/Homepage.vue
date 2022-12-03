<template>
  <div class="h-100 w-100 d-flex flex-column justify-center align-center">
    <img class="rounded-lg" src="@/assets/images/rambo.gif" />
    <SearchBar :onchange="onchange" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import SearchBar from "@/components/SearchBar.vue";
import router from "@/router";

export default defineComponent({
  name: "Homepage",

  components: {
    SearchBar
  },

  methods: {
    async onchange(value) {
      if (!value)
        return

      await router.push(`/search?q=${value}`)
      router.forward()
    }
  }
});
</script>

