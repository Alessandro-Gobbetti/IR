<template>
  <div class="artist_card_big" :class="is_expanded? 'expanded' : 'collapsed'" v-on="is_expanded ? {} : {click : expandCard}">
    <v-btn v-if="is_expanded" @click="findSimilar" class="find-similar">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <Transition name="slide-fade">
      <img v-if="is_expanded" class="banner" :src="artist.artist_banner" alt="artist banner" @click="openArtistPage"/>
    </Transition>
    <div class="artist">
      <img class="pic" :src="artist.artist_image" alt="artist image" @click="openArtistPage"/>
      <img class="site_logo" :src="getLogo()" alt=""/>
      <h2 v-snip="{ lines: 1, mode: 'css' }" class="name" @click="openArtistPage()">{{ artist.artist_name }}</h2>
      <p class="stats">
        <span v-if="artist.amount_subs">{{ artist.amount_subs }} subs</span>
        <span v-if="artist.amount_subs && artist.amount_post"> ・ </span>
        <span v-if="artist.amount_post">{{ artist.amount_post }} posts</span>
      </p>
      <div class="tags">
        <div class="tag" v-for="tag in artist.tags" :key="tag" @click="searchTag(tag)">
          {{ tag }}
        </div>
      </div>
      <p v-if="artist.bio" class="bio" >
        <!--bold every word matching the query-->
        <span v-for="(word, idx) in artist.bio.split(' ')" :key="word" class="two-lines">
          <span v-if="(idx <= 40 || is_expanded) && this.query.includes(word.trim().toLowerCase())"><b>{{word}}</b></span>
          <span v-else-if="idx<=40 || is_expanded">{{word}}</span>
          <span v-if="(idx===40 && !is_expanded)">...</span>
          <span>{{" "}}</span>
        </span>
      </p>
      <p v-if="is_expanded && artist.bio_long" class="long_bio">
        <!--bold every word matching the query-->
        <span v-for="word in artist.bio_long.split(' ')" :key="word">
          <span v-if="this.query.includes(word.trim().toLowerCase())"><b>{{word + " "}}</b></span>
          <span v-else>{{word+ " "}}</span>
        </span>
      </p>
      <div v-if="(show_tiers && is_expanded && artist.price_tiers_monthly && artist.price_tiers_monthly.length > 0)" class="tiers">
        <h2 class="title">Price tiers</h2>
        <div class="tier" v-for="idx in artist.price_tiers_monthly.length" :key="idx">
          <div v-if="artist.price_tiers_monthly" class="tier_price">{{ artist.price_tiers_monthly[idx-1] }}</div>
          <div v-if="artist.price_tiers_title" class="tier_title">{{ artist.price_tiers_title[idx-1] }}</div>
          <div v-if="artist.price_tiers_description" class="tier_desc">{{ artist.price_tiers_description[idx-1] }}</div>
        </div>
      </div>

      <div v-if="is_expanded" class="social_media">
        <a v-for="social in artist.socialmedias" :key="social" :href="social" target="blank">
          <div class="tooltip">
            <v-icon class="social">{{getIconCode(social)}}</v-icon>
            <span class="tooltiptext">{{social}}</span>
          </div>  
        </a>
      </div>
      <div class="expand_collapse_icon">
        <v-icon v-if="is_expanded" @click="collapseCard">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon>
      </div>
    </div>

  </div>
</template>

<script>
// Components
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "ArtistCardBig",

  props: {
    artist: {
      type: Object,
      required: true,
    },
    expanded: {
      type: Boolean,
      default: false,
      mutable: true,
    },
    show_tiers: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      is_expanded: this.expanded,
      query: this.getQueryWords(),
    };
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

    getQueryWords() {
      if(this.$route.query.q === undefined)
        return []
      let query = (this.$route.query.q).split("AND")[0].split(' ')
      // remove empty strings
      query = query.filter((word) => word !== "")
      // remove * or " at beginning and end of words
      query = query.map((word) => word.replace(/["*]/g, "").toLowerCase())
      return query;
    },

    getIconCode(social){
      // parse url to get website name
      let url = new URL(social);
      let host = url.hostname.replace("www.", "");
      host = host.split(".")[0];

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
    },

    openArtistPage() {
      this.addCookies(this.artist.page_link);
      window.location.replace(this.artist.page_link);
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

    expandCard() {
      this.is_expanded = true;
      console.log("expanded");
    },

    collapseCard() {
      this.is_expanded = false;
      console.log("collapsed");
    },

    expandCardIfCollapsed() {
      if (!this.is_expanded) {
        this.expandCard();
      }
    },

    expandCollapseCard() {
      if (this.is_expanded) {
        this.collapseCard();
      } else {
        this.expandCard();
      }
    },

    searchTag(tag) {
      this.$router.push({ name: "search", query: { q: `tags:${tag}` } });
      this.$router.forward();
    },

    async findSimilar() {
      this.$router.push({ name: "search", query: { q: `similar_docs:page_link:${this.artist.page_link.replace(/:/g, "\\:")}` } });
      this.$router.forward();
    },
} ,

});
</script>


<style scoped>

.artist_card_big {
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

img.banner{
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
  margin: 0 3vw 3vw;
}


.pic {
  /* crop to square */
  grid-area: img;
  object-fit: cover;
  width: min(12vh, 100px);
  height: min(12vh, 100px);
  overflow: hidden;
  border-radius: 50%;
}
.pic:hover {
  cursor: pointer;
  /* shadow */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.expanded img.pic {
  grid-area: img;
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
  transition: color 0.5s;
}

h2.name:hover {
  cursor: pointer;
  color: blue;
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
}

.expanded .tag {
  margin: 0 5px 5px 0;
  border-radius: 5px;
  background-color: rgb(232, 232, 232);
  padding: 0px 5px;
  font-variant: small-caps;
  transition: transform 0.2s;
  height: 1.2rem;
  font-size: 0.8rem;
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
  font-size: 2.5rem;
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
}

.collapsed .tag {
  margin: 0 5px 5px 0;
  border-radius: 5px;
  background-color: rgb(232, 232, 232);
  padding: 0px 5px;
  font-variant: small-caps;
  transition: transform 0.2s;
  height: 1.2rem;
  font-size: 0.8rem;
}
.collapsed .tag:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.collapsed p.bio {
  grid-area: bio;
  margin-right: 3rem;
  padding: 0;
  font-size: 1rem;
}
.collapsed p.bio::first-letter {
  text-transform: capitalize;
}



.expand_collapse_icon {
  position: absolute;
  justify-self: end;
  align-self: end;
  font-size: 1.5rem;
  z-index: 9999;
  opacity: 0%;
  transition: opacity 0.5s;
}

.expanded .expand_collapse_icon {
  margin-right: -2vw;
}


.expand_collapse_icon:hover {
  cursor: pointer;
}

.artist_card_big:hover .expand_collapse_icon {
  display: block;
  opacity: 100%;
}
.find-similar {
  position: absolute;
  /*align the element to the right of the image*/
  right: 27vw;
  margin-top: 2vh;
  z-index: 1;
  background-color: rgb(232, 232, 232, 0.8);
  border-radius: 100vh;
  transition: all 0.2s;

/*  invert colors*/
}

.find-similar::before {
  content: "";
  font-size: 0;
  transition: all 0.2s;
}

.find-similar:hover::before {
  content: "Find Similar";
  font-size: 1em;
  padding-right: 0.5rem;
}







/* TRANSITION */
/**

* {
  transition: all 1.5s ease;
}

.slide-fade-enter-active {
  transition: all 1.5s ease;
  transform-origin: bottom;
}

.slide-fade-leave-active {
  transition: all 1.5s ease;
  transform-origin: bottom;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform-origin: bottom;
  transform: scaleY(0.0);
  opacity: 0;
}



.translate_animation {
  animation: translate 1.5s ease;
  transform: translateY(0.0);
}

@keyframes translate {
  0% {
    transform: translateY(0.0);
  }
  100% {
    transform: translateY(-20vh);
  }
}**/


</style>
