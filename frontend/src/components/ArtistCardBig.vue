<template>
  <div class="artist_card_big" :class="expanded? 'expanded' : 'collapsed'" @click="openPageIfCollapsed">
    <img v-if="expanded" class="banner" :src="artist.artist_banner" alt="artist banner" />
    <div class="artist">
      <img class="pic" :src="artist.artist_image" alt="artist image" />
      <img class="site_logo" :src="getLogo()" alt=""/>
      <h2 v-snip="{ lines: 1, mode: 'css' }" class="name">{{ artist.artist_name }}</h2>
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
      <p v-if="artist.bio" class="bio" v-snip="{ lines: expanded ? -1 : 1, mode: 'css' }">{{ artist.bio }}</p>
      <p v-if="expanded && artist.bio_long" class="long_bio">{{artist.bio_long}}</p>
      <div v-if="(show_tiers && expanded && artist.price_tiers && artist.price_tiers.length > 0)" class="tiers">
        <h2 class="title">Price tiers</h2>
        <div class="tier" v-for="tier in artist.price_tiers" :key="tier">
          <div class="tier_price">{{ tier.monthly }}</div>
          <div class="tier_title">{{ tier.title }}</div>
          <div class="tier_desc">{{ tier.description }}</div>
        </div>
      </div>

      <div v-if="expanded" class="social_media">
        <a v-for="social in artist.socialmedias" :key="social" :href="social" target="blank">
          <div class="tooltip">
            <v-icon class="social">{{getIconCode(social)}}</v-icon>
            <span class="tooltiptext">{{social}}</span>
          </div>  
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
      default: {"site": "ko-fi", "page_link": "https://ko-fi.com/kahahuna", "artist_name": "Kahahuna", "artist_image": "https://storage.ko-fi.com/cdn/useruploads/6e66cb54-1712-4b53-b172-d38f923edfc4.jpg", "artist_banner": "https://cdn.ko-fi.com/cdn/useruploads/jpg_f9560df2-dd82-43b1-a479-85d6450b06e9cover.jpg?v=17adc55b-1c19-44ec-9301-992d2abe75c6", "bio": "I'm Jess, a 39 year old artist and maker from Indiana. I love carving linocuts, ink and paint, webcomics and press bath bombs as my side hustle. You'll get a little bit of everything in my feed. Check out my monthly print and tub club tiers!", "bio_long": null, "amount_post": null, "amount_subs": 72, "price_tiers": [{"title": "Print of the Month Club", "monthly": "$15", "description": "Do you like getting physical mail? Me too. This benefit will feature a monthly exclusive original linocut just for members. I will tend to keep them smaller to keep the shipping in check, so the prints will likely range from 4x6\" to 5x7\" and may even be a linen fabric patch. Prints will be mailed within the first week of the month and include a handwritten note. Themes will coincide with the Tub Club tier! Worldwide shipping is available and included. Please allow time if ordering internationally. "}, {"title": "Tub Club", "monthly": "$25", "description": "What is Tub Club? Every month I will announce a theme for the next box. Subscriptions may be edited up until the 20th. For your $25, I will curate a seasonal box to be sent on the first week of the month. Domestic shipping is included.\n\nBoxes will include:\n1 soap\n1 large bath bomb\n1 surprise handmade item such as artwork, ornaments, candles, sugar scrubs, etc. (it's a surprise!)\n"}], "tags": ["Drawing & Painting", "Art", "Commissions", "Comics"], "socialmedias": ["https://instagram.com/Kahahuna_jess", "https://facebook.com/kahahuna", "https://twitter.com/kahahuna", "https://@kahahuna.tumblr.com", "https://www.twitch.tv/kahahuna", "https://www.tiktok.com/@kahahuna"]},
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    show_tiers: {
      type: Boolean,
      default: true,
    },
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

  openPageIfCollapsed() {
    // if(!this.expanded){
      // open link
      console.log("go to artist page: " + this.artist.page_link);
      // window.open(this.artist.page_link);
    // }
  }
});
</script>


<style scoped>

.artist_card_big {
  width: 75%;
  margin-left: 10%;
  border-radius: 2vh;
}


.artist_card_big.expanded {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 5vh;
  transition: box-shadow 0.5s;
}
.artist_card_big.expanded:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.expanded img.banner{
  width: 100%;
  height: 20vh;
  object-fit: cover;
  border-radius: 2vh 2vh 0vh 0vh;
}

.expanded .artist {
  display: grid;
  grid-template-columns: min(12vh, 100px) 1fr auto;
  grid-template-rows: 2em 1.5em 1.2em auto auto auto;
  grid-template-areas:
    "img name site"
    "img stats socials"
    "img tags tags"
    "bio bio bio"
    "longbio longbio longbio"
    "tiers tiers tiers";
  grid-column-gap: 10px;
  text-decoration: none;
  color: black;
  margin: 3vw;
  margin-top: 0;
  padding-bottom: 2vh;
}

.expanded img.pic {
  grid-area: img;
  width: 100%;
  border-radius: 100%;
  overflow: hidden;
  /*move it up by 50%*/
  transform: translateY(-40%);
}
.expanded img.site_logo {
  grid-area: site;
  height: 1.5rem;
  justify-self: end;
  align-self: baseline;
  margin-right: -2vw;
  position: relative;
}

.expanded h2.name {
  grid-area: name;
  margin: 0;
  padding: 0;
  font-size: 1.5rem;
}

.expanded p.stats {
  grid-area: stats;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}

.expanded p.bio {
  grid-area: bio;
}
.expanded p.bio::first-letter {
  text-transform: capitalize;
}

.expanded p.long_bio {
  grid-area: longbio;
  margin-top: 1vh;
  margin-bottom: 1vh;
  /*justification*/
  text-align: justify;
}
.expanded p.long_bio::first-letter {
  text-transform: capitalize;
}

.expanded .tags {
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
  max-height: 0.8rem;
}

.expanded .tag {
  margin: 0 5px 5px 0;
  border-radius: 5px;
  background-color: rgb(232, 232, 232);
  padding: 0px 5px;
  font-variant: small-caps;
  transition: transform 0.2s;
}
.expanded .tag:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.expanded .tiers {
  grid-area: tiers;
  display: flex;
  flex-direction: column;
}

.expanded .tier {
  display: grid;
  grid-template-columns: 7rem 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "price title"
    "price desc";
  padding: 0 2vw;
}

.expanded .tier .tier_price {
  grid-area: price;
  font-weight: bold;
  font-size: 3rem;
  align-self: start;
}

.expanded .tier .tier_title {
  grid-area: title;
  font-weight: bold;
  font-size: 1.2rem;
  align-self: end;
}

.expanded .tier .tier_desc {
  grid-area: desc;
  font-size: 0.8rem;
  align-self: start;
}

.expanded .social_media {
  grid-area: socials;
  font-size: 0.8rem;
  justify-self: end;
  margin-right: -2vw;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.expanded .social_media a {
  text-decoration: none;
  color: black;
  transition: transform 0.2s;
  background-color: rgb(232, 232, 232);
  border-radius: 100%;
  margin-left: 0.5vw;
  padding: 0.2rem;
}

.expanded .social_media a:hover {
  cursor: pointer;
  transform: translateY(-0.2rem);
}

.tooltip {
  position: relative;
  display: flex;
  flex-direction: row;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgb(232, 232, 232);
  text-align: center;
  position: absolute;
  z-index: 1;
  padding: 0.3rem;
  border-radius: 10rem;
  font-size: 0.6rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
}




.artist_card_big.collapsed {
  transition: box-shadow 0.5s;
  text-decoration: none;
  color: black;
  margin-bottom: 2vh;
}
.collapsed:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.collapsed .artist {
  display: grid;
  grid-template-columns: 10vh 1fr auto;
  grid-template-rows: 2em auto auto auto;
  grid-template-areas:
    "img name logo"
    "img stats stats"
    "img tags tags"
    "img bio bio";
  border-radius: 2vh;
  padding: 1vh;
  grid-column-gap: 1vw;  
}

.collapsed img.pic {
  grid-area: img;
  width: 100%;
  border-radius: 100%;
  overflow: hidden;
}

.collapsed img.site_logo {
  grid-area: logo;
  height: 50%;
  justify-self: end;
  align-self: baseline;
  margin: 1vh;
  /* fully tranparent img*/
  opacity: 0;
  transition: opacity 0.5s;
}

.collapsed:hover img.site_logo {
  opacity: 1;
}

.collapsed h2.name {
  grid-area: name;
  margin: 0;
  padding: 0;
}

.collapsed p.stats {
  grid-area: stats;
  font-size: 0.9rem;
}

.collapsed .tags {
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  font-size: 0.8rem;
  max-height: 0.8rem;
}

.collapsed .tag {
  margin: 0 5px 5px 0;
  border-radius: 5px;
  background-color: rgb(232, 232, 232);
  padding: 0px 5px;
  font-variant: small-caps;
  transition: transform 0.2s;
}
.collapsed .tag:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.collapsed p.bio {
  grid-area: bio;
  margin: 0;
  padding: 0;
  font-size: 1rem;
}
.collapsed p.bio::first-letter {
  text-transform: capitalize;
}

</style>
