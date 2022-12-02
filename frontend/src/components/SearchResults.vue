<template>
<!--  TODO: call ArtistCardBig with props-->
  <div>
    <ArtistCardBig v-for="(artist,idx) in results" :artist="artist" :expanded="idx===0" :key="artist.id"  />

  </div>
</template>

<script>
import ArtistCard from "@/components/ArtistCard.vue";
import ArtistCardBig from "@/components/ArtistCardBig.vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "SearchResults",
  props: {
    results : {
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

</style>