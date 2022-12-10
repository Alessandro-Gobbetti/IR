<template>
<!--  TODO: call ArtistCardBig with props-->
  <div class="searchResults">
    <ArtistCardBig v-for="(artist,idx) in artists" :artist="artist" :expanded="idx===0" :key="artist.id"  />

  </div>
</template>

<script>
import ArtistCard from "@/components/ArtistCard.vue";
import ArtistCardBig from "@/components/ArtistCardBig.vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "SearchResults",
  props: {
    artists : {
      type: [Object],
      default: []
    }
  },
  components: {
    ArtistCard,
    ArtistCardBig,
  },
})
</script>

<style scoped>

.searchResults {
  width:50%;
}
</style>