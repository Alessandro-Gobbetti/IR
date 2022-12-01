<template>
  <ArtistCard v-for="(artist,idx) in results" :key="idx" expand="{{idx===0}}" v-bind="artist"  />
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