<template>
  <div class="h-100">
<!--    <p class="align-self-baseline" v-if="Object.keys(results.stats).length >0"> Stats </p>-->
    <div class="d-flex flex-column justify-center w-100 mt-10 flex-column ">
    <h2 class="mb-7">Based on what you like:</h2>

      <v-progress-circular v-if="is_loading" class="align-self-center"
                           :size="50"
                           color="black"
                           indeterminate
      ></v-progress-circular>
      <template v-else>
          <template v-if="!this.recommended_docs.response || this.recommended_docs.response.docs.length === 0">
            <h2 class="text-center mt-6">No results found</h2>
            <h3 class="text-center">Try searching for something else</h3>
          </template>
          <ArtistCard v-else v-for="(artist,idx) in recommended_docs.response.docs" :artist="artist" :expanded="idx===0" :key="artist.id"  />
      </template>


    </div>
  </div>

</template>

<script>
import ArtistCard from "@/components/ArtistCard.vue";
import ArtistCardBig from "@/components/ArtistCardBig.vue";
import {defineComponent} from "vue";
import store from "@/store";

export default defineComponent({
  name: "RecommendationResults",
  components: {
    ArtistCard,
    ArtistCardBig,
  },

  data() {
    return {
      is_loading: true,
      recommended_docs: undefined
    }
  },
  async beforeMount() {
    this.recommended_docs = await this.getRecommendations();
    this.is_loading = false;
  },
  methods: {
    async getRecommendations() {

      let visited_artists = this.$cookies.get('visited_artists');
      let query;
      if (visited_artists) {
        // escape every url
        visited_artists = visited_artists.map(url => this.escapeURL(url));
        query = `q=page_link:(${visited_artists.join(' ')})`
      } else {
        query = 'q=*:*';
      }

      // sleep 3 seconds
      // await new Promise(resolve => setTimeout(resolve, 3000));
      return await store.getters.getRecommendations(query);
    },
    escapeURL(url) {
      return url.replace(/:/g, '\\:');
    }
  },
})
</script>

<style scoped>

</style>