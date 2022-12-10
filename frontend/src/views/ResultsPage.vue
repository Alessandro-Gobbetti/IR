<template>
  <div class="h-100 w-100 d-flex flex-column align-center">
    <SearchBar :initial-value="this.$route.query.q" :fetch-initial-value="true" :onchange="onchange" :onresultschange="onresultschange" />

    <SearchResults :artists="results.docs"/>
    
    <div v-if="is_loading" class="d-flex justify-content-center align-items-center h-50">
      <v-progress-circular class="align-self-center"
        :size="50"
        color="black"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else-if="(results.docs.length===0)" class="d-flex flex-column align-center justify-center h-50">
      <h1 class="text-center">No results found</h1>
      <h3 class="text-center">Try searching for something else</h3>
    </div>



    <v-pagination 
      v-if="results.docs.length > 0"
      v-model="page"
      :length="20"
      :total-visible="5"
      rounded="lg"
      :elevation="3"
    ></v-pagination>
    


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
    results: {
      stats: {},
      docs: []
    },
    is_loading: false,
  }),

  methods: {
    onchange(value) {
      router.push(`/search?q=${value}`)
      router.forward();
      this.is_loading = true;
    },
    onresultschange(result) {
      this.results = result
      this.is_loading = false;
    }
  }
});
</script>

