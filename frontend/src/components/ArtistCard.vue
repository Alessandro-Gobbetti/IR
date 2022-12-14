<template>
  <div class="artist_card" @click="openArtistPage(artist.page_link)">
    <img class="artist_image" :src="artist.artist_image" alt="artist image" />
    <img class="site_logo" :src="getLogo()" alt="" />
    <h3 class="name" v-snip="{ lines: 1, mode: 'css', midWord: true}">{{ artist.artist_name }}</h3>
    <p class="stats">
      <span v-if="artist.amount_subs">{{ artist.amount_subs }} subs</span>
      <span v-if="artist.amount_subs && artist.amount_post"> ・ </span>
      <span v-if="artist.amount_post">{{ artist.amount_post }} posts</span>
    </p>
    <div class="tags">
      <div class="tag" v-for="tag in artist.tags" :key="tag">
        <!-- TODO: onclick search for the tag -->
        {{ tag }}
      </div>
    </div>
  </div>
</template>

<script>
// Components
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArtistCard",

  props: {
    artist: {
      type: Object,
    }
  },

  methods: {
    getLogo() {
      switch (this.artist.site) {
        case "ko-fi":
          return "src/assets/images/KoFi-Logo.png";
        case "patreon":
          return "src/assets/images/Patreon-Logo.png";
        case "subscribestar":
          return "src/assets/images/SubscribeStar-Logo.png";
        default:
          return "";
      }
    },
    openArtistPage() {
      this.addCookies(this.artist.page_link);
      window.location.assign(this.artist.page_link);
    },
    addCookies(url){
      if (this.$cookies.isKey('visited_artists')) {
        let visited_artists = this.$cookies.get('visited_artists');
        if (!visited_artists.includes(url)){

          // keep the last 9 visited artists
          visited_artists = visited_artists.slice(Math.max(visited_artists.length - 9, 0));

          visited_artists.push(url);
          this.$cookies.set('visited_artists', JSON.stringify(visited_artists));
        }
      } else {
        this.$cookies.set('visited_artists', JSON.stringify([url]));
      }
    },
  },

});
</script>


<style scoped>
.artist_card {
  display: grid;
  grid-template-columns: 6vh 1fr auto;
  grid-template-rows: 2em auto auto auto;
  grid-template-areas:
    "img name logo"
    "img stats stats"
    "img tags tags"
    "img bio bio";
  /*width: ;*/
  border-radius: 2vh;
  padding: 1vh;
  grid-column-gap: 1vw;
  transition: box-shadow 0.5s;
  text-decoration: none;
  color: black;
  margin-bottom: 1vh;
}

.artist_card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.artist_card img.artist_image {
  grid-area: img;
  object-fit: cover;
  width: min(6vh, 100px);
  height: min(6vh, 100px);
  overflow: hidden;
  border-radius: 50%;
}

.artist_card img.site_logo {
  grid-area: logo;
  height: 30%;
  justify-self: end;
  align-self: baseline;
  margin-top: 0.5vh;
  margin-right: 0.5vh;
  /* fully tranparent img*/
  opacity: 0;
  transition: opacity 0.5s;
}

.artist_card:hover img.site_logo {
  opacity: 1;
}

.artist_card .name {
  grid-area: name;
  margin: 0;
  padding: 0;
}

.artist_card p.stats {
  grid-area: stats;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
}

.artist_card .tags {
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
}

.artist_card .tag {
  margin: 0 5px 5px 0;
  border-radius: 5px;
  background-color: rgb(232, 232, 232);
  padding: 0px 5px;
  font-variant: small-caps;
  transition: transform 0.2s;
}
.artist_card .tag:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.artist_card p.bio {
  grid-area: bio;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}
.artist_card p.bio::first-letter {
  text-transform: capitalize;
}
</style>
