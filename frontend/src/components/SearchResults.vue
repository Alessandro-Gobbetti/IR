<template>
<!--  TODO: Merge ArtistCardBig and ArtistCard in one component. Use prop 'expanded' to make it bigger-->
  <component v-for="(artist,idx) in results" :is="idx===0? 'ArtistCardBig' : 'ArtistCard'" :key="idx" v-bind="artist"  />
<!--  <ArtistCardBig />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->
<!--  <ArtistCard />-->

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