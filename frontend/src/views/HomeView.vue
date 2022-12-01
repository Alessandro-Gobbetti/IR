<template>
  <div>
    <SearchBar :oninputchange="oninputchange" :onchange="onchange" />

    <SearchResults :results="results"/>

  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import SearchBar from "@/components/SearchBar.vue";
import ArtistCardBig from "@/components/ArtistCardBig.vue";
import ArtistCard from "@/components/ArtistCard.vue";
import SearchResults from "@/components/SearchResults.vue";
import store from "@/store";

export default defineComponent({
  name: "HomeView",

  components: {
    SearchResults,
    SearchBar,
    ArtistCard,
    ArtistCardBig,
  },

  data: () => ({
    results: [],
  }),

  methods: {
    oninputchange(e) {
      console.log(e.target.value)
    },
    async onchange(e) {
      console.log(await store.getters.getResults(e.target.value))
      this.results = await store.getters.getResults(e.target.value)
    }
  }
});
</script>

