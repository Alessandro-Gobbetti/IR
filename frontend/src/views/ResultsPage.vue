<template>
  <div class="h-100 w-100 d-flex flex-column align-center">
    <SearchBar :queryParam="this.$route.query" :fetch-initial-value="true" :onchange="this.onquerychange" :onresultschange="onresultschange" />


    <div class="results">
      <SearchResults class="w-75" :loading="is_loading" :results="results" />
      <MoreLikeThis class="w-25"/>
    </div>

    <v-pagination 
      v-if="results.stats.total_pages > 1"
      :model-value="results.stats.page"
      @update:model-value="onpaginationchange"
      :length="results.stats.total_pages"
      total-visible=7
      rounded="lg"
      :elevation="3"
      class="mb-10"
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
import MoreLikeThis from "@/components/MoreLikeThis.vue";
import store from "@/store";
import router from "@/router";

export default defineComponent({
  name: "ResultsPage",

  components: {
    SearchResults,
    SearchBar,
    ArtistCard,
    ArtistCardBig,
    MoreLikeThis,
  },

  data: () => ({
    results: {
      stats: {},
      docs: []
    },
    is_loading: false,
  }),

  methods: {
    async onquerychange(value) {
      console.log(value);
      // await router.push({path:'/search', query: {q: value}})
      // router.forward();
      await router.push({path: '/search', query: {q:value, token: Math.random()}})
      router.forward()
      this.is_loading = true;
    },
    onresultschange(result) {
      // check if the results are from mlt query
      if (result && result.match && result.match.numFound > 0) {
        this.results =  {
          stats: {
            page: 1,
            total_pages: 1,
            total_results: result.response.docs.length
          },
          docs: result.response.docs
        };
      } else {
        this.results = result
      }
      this.is_loading = false;
    },
    async onpaginationchange(e) {
      await router.push({path: '/search', query: {...this.$route.query, page: e}})
      router.forward()
      window.scrollTo({top: 0, behavior: 'smooth'});
      // this.$route.query.page = e
    }
  }
});
</script>

<style scoped>
  .results {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
    width: 100%;
    column-gap: 2vh;
    padding: 2vh;
  }

</style>