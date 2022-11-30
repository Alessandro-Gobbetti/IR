<template>
  <div>
    <SearchBar />

    <ArtistCardBig />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />
    <ArtistCard />

  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import SearchBar from "@/components/SearchBar.vue";
import ArtistCardBig from "@/components/ArtistCardBig.vue";
import ArtistCard from "@/components/ArtistCard.vue";

export default defineComponent({
  name: "HomeView",

  components: {
    SearchBar,
    ArtistCard,
    ArtistCardBig,
  },

  data: () => ({
    menu: false
  })
});
</script>

