<template>
  <div class="h-100 w-100 d-flex flex-column align-center">
    <SearchBar :initial-value="this.$route.query.q" :fetch-initial-value="true" :onchange="onchange" :onresultschange="onresultschange" />

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
import router from "@/router";

export default defineComponent({
  name: "ResultsPage",

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
    onchange(value) {
      router.push(`/search?q=${value}`)
      router.forward();
    },
    onresultschange(result) {
      this.results = result
    }
  }
});
</script>

