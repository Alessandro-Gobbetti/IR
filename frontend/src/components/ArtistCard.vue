<template>
  <a class="artist_card" v-bind:href=artist.page_link>
    <img class="artist_image" :src="artist.artist_image" alt="artist image" />
    <img class="site_logo" :src="getLogo()" alt="" />
    <h2 class="name" v-snip="{ lines: 1, mode: 'css'}">{{ artist.artist_name }}</h2>
    <p class="stats">
      <span v-if="artist.amount_subs">{{ amount_subs }} subs</span>
      <span v-if="artist.amount_subs && amount_post"> ・ </span>
      <span v-if="artist.amount_post">{{ artist.amount_post }} posts</span>
    </p>
    <div class="tags">
      <div class="tag" v-for="tag in artist.tags" :key="tag">
        <!-- TODO: onclick search for the tag -->
        {{ tag }}
      </div>
    </div>

    <p v-snip="{ lines: 2, mode: 'js' }" class="bio">
      {{ artist.bio }}
    </p>
  </a>
</template>

<script>
// Components
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArtistCard",

  props: {
    artist: {
      type: Object,
      default: {"site": "subscribestar", "page_link": "https://www.subscribestar.com/LukeAbsolumReid", "artist_name": "Luke Absolum Reid ", "artist_image": "https://d3ts7pb9ldoin4.cloudfront.net/uploads/users/203278/avatars/c4eba439-10d0-4816-a08b-7293a4cfef68-380x380_48x149_429x429.jpg", "artist_banner": "https://d3ts7pb9ldoin4.cloudfront.net/uploads/users/203278/covers/47ce6685-ccc4-4bf9-91e2-daa2a806e955-1240x0_0x2500_3599x675.jpg", "bio": "I am an artist and a dungeon master that enjoys bringing fantasy worlds to life through illustration. ", "bio_long": null, "amount_post": "21", "amount_subs": "", "price_tiers": [], "tags": ["Illustration", "Cartography", "Art", "DungeonsAndDragons", "Ttrpg", "Map"], "socialmedias": []},
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
  },

});
</script>


<style scoped>
.artist_card {
  display: grid;
  grid-template-columns: 10vh auto auto;
  grid-template-rows: 2em auto auto auto;
  grid-template-areas:
    "img name logo"
    "img stats stats"
    "img tags tags"
    "img bio bio";
  width: 75%;
  margin-left: 10%;
  border-radius: 2vh;
  padding: 1vh;
  grid-column-gap: 1vw;
  transition: box-shadow 0.5s;
  text-decoration: none;
  color: black;
  margin-bottom: 2vh;
}

.artist_card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.artist_card img.artist_image {
  grid-area: img;
  width: 100%;
  border-radius: 100%;
  overflow: hidden;
}

.artist_card img.site_logo {
  grid-area: logo;
  height: 50%;
  justify-self: end;
  align-self: baseline;
  margin: 1vh;
  /* fully tranparent img*/
  opacity: 0;
  transition: opacity 0.5s;
}

.artist_card:hover img.site_logo {
  opacity: 1;
}

.artist_card h2.name {
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
