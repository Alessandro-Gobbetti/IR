<template>
  <!-- input text -->


  <div class="artist_card_big">
    <img class="banner" :src="artist.artist_banner" alt="artist banner" />
    <div class="artist">
      <img class="pic" :src="artist.artist_image" alt="artist image" />
      <img class="site_logo" :src="getLogo()" alt=""/>
      <h2 class="name">{{ artist.artist_name }}</h2>
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
      <p v-if="artist.bio" class="bio">{{ artist.bio }}</p>
      <p v-if="artist.bio_long" class="long_bio">{{artist.bio_long}}</p>
      <div v-if="artist.price_tiers" class="tiers">
        <h2 class="title">Price tiers</h2>
        <div class="tier" v-for="tier in artist.price_tiers" :key="tier">
          <div class="tier_price">{{ tier.monthly }}</div>
          <div class="tier_title">{{ tier.title }}</div>
          <div class="tier_desc">{{ tier.description }}</div>
        </div>
      </div>

      <div class="social_media">
        <a v-for="social in artist.socialmedias" :key="social" :href="social" target="blank">
          <v-icon class="social">{{getIconCode(social)}}</v-icon>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// Components
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArtistCardBig",

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

    getIconCode(social){
      // parse url to get website name
      let url = new URL(social);
      let host = url.hostname.replace("www.", "");
      host = host.split(".")[0];

      console.log(host);

      let supported_websites = [
        'facebook',
        'google',
        'instagram',
        'linkedin',
        'pinterest',
        'reddit',
        'snapchat',
        'twitter',
        'vimeo',
        'youtube',
        'twitch',
      ];

      if (supported_websites.includes(host)){
        return `mdi-${host}`;
      } else {
        return 'mdi-web';
      }
    }
  },
});
</script>


<style scoped>

.artist_card_big {
  width: 75%;
  margin-left: 10%;
  border-radius: 2vh;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 5vh;
  overflow: hidden;
}
.artist_card_big:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.5s;
}

.artist {
  display: grid;
  grid-template-columns: max(12vh, 100px) auto auto;
  grid-template-rows: 2em 1.5em 1.2em auto auto auto;
  grid-template-areas:
    "img name site"
    "img stats socials"
    "img tags tags"
    "bio bio bio"
    "longbio longbio longbio"
    "tiers tiers tiers";
  grid-column-gap: 10px;
  background-color: white;
  text-decoration: none;
  color: black;
  margin: 3vw;
  margin-top: 0;
}


.artist_card_big img.banner{
  width: 100%;
  height: 20vh;
  object-fit: cover;
}

.artist_card_big img.pic {
  grid-area: img;
  width: 100%;
  border-radius: 100%;
  overflow: hidden;
  /*move it up by 50%*/
  transform: translateY(-40%);
}
.artist_card_big img.site_logo {
  grid-area: site;
  height: 1.5rem;
  justify-self: end;
  align-self: baseline;
  margin-right: -2vw;
  position: relative;
}

.artist_card_big h2.name {
  grid-area: name;
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}

.artist_card_big p.stats {
  grid-area: stats;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}

.artist_card_big p.bio {
  grid-area: bio;
}
.artist_card_big p.bio::first-letter {
  text-transform: capitalize;
}

.artist_card_big p.long_bio {
  grid-area: longbio;
  margin-top: 1vh;
  margin-bottom: 1vh;
  /*justification*/
  text-align: justify;
}
.artist_card_big p.long_bio::first-letter {
  text-transform: capitalize;
}

.artist_card_big .tags {
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
}

.artist_card_big .tag {
  margin: 0 5px 5px 0;
  border-radius: 5px;
  background-color: rgb(232, 232, 232);
  padding: 0px 5px;
  font-variant: small-caps;
  transition: transform 0.2s;
}
.artist_card_big .tag:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.artist_card_big .tiers {
  grid-area: tiers;
  display: flex;
  flex-direction: column;
}

.artist_card_big .tier {
  display: grid;
  grid-template-columns: 7rem 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "price title"
    "price desc";
  padding: 0 2vw;
}

.artist_card_big .tier .tier_price {
  grid-area: price;
  font-weight: bold;
  font-size: 3rem;
  align-self: start;
}

.artist_card_big .tier .tier_title {
  grid-area: title;
  font-weight: bold;
  font-size: 1.2rem;
  align-self: end;
}

.artist_card_big .tier .tier_desc {
  grid-area: desc;
  font-size: 0.8rem;
  align-self: start;
}

.artist_card_big .social_media {
  grid-area: socials;
  font-size: 0.8rem;
  justify-self: end;
  margin-right: -2vw;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.artist_card_big .social_media a {
  text-decoration: none;
  color: black;
  transition: transform 0.2s;
  background-color: rgb(232, 232, 232);
  border-radius: 100%;
  margin-left: 0.5vw;
  padding: 0.2rem;
}

.artist_card_big .social_media a:hover {
  cursor: pointer;
  transform: translateY(-0.2rem);
}

</style>
