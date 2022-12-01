<template>
<!--  TODO: call ArtistCardBig with props-->
  <div>
    <component v-for="(artist,idx) in results" :artist="artist" :is="idx===0? 'ArtistCardBig' : 'ArtistCard'" :key="idx"  />
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