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

  components: {
    // HelloWorld,
  },

  data: () => ({
    artist: 
    Math.random() < 0.3 ?
    {"site": "patreon", "page_link": "https://www.patreon.com/geoffreysiu", "artist_name": "Geoffrey Siu Art", "artist_image": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4365400/0ef3ca7d793e4caca1a02299204a3c57/eyJ3IjoyMDB9/4.png?token-time=2145916800&token-hash=UxdUTHJ1goSnREDHvo5ygr1gwfS6frbREttdkruzCL8%3D", "artist_banner": "https://cdn.ko-fi.com/cdn/useruploads/png_62e6821c-5c4b-4902-83ea-81cca0aa3489cover.jpg?v=8341e32f-412f-4738-9f16-d3747eed0e8c", "bio": "fancy Pokemon pins every month", "bio_long": "Hello there! It's Geoffrey and I am an artist/designer in Honolulu, Hawaii. I design enamel pins, t-shirts, draw silly dad-humor comics, and love staying inside even when the weather is nice out. Expect exclusive Gentlemon pin designs, stickers, and a first look at new products before they hit the shelves! I love to draw cute things with a long history with video games and anime/manga. I got my first start making little charms and t-shirts at a local anime convention! I started doing it with a friend in high school. We had a good run, but school and stuff got in the way. A decade later, I am back at creating products and selling original artwork and have finally made this my full-time job! ", "amount_post": 107, "amount_subs": 351, "price_tiers": [{"title": "Supporter", "monthly": "$3", "description": "For those that simply fancy everything Gentlemon. In this tier, you will receive: Access to blog posts, sneak peeks, and behind-the-scenes Ability to vote and nominate future Gentlemon designs for the next month!"}, {"title": "Sticker Club - US/ INTL (No Tracking)", "monthly": "$6", "description": "Join this tier if you wanna treat yourself to something fancy. In this tier, you will receive the exclusive Gentlemon Sticker of the month. Every month, you will receive an all-new holographic glitter sticker design or a Patreon exclusive variant of a sticker. Gentlemon Sticker of the Month NO TRACKING # You will also have: Access to blog posts, sneak peeks, and behind-the-scenes Ability to vote and nominate future Gentlemon designs for the next month!"}, {"title": "Pin Club - US (+ Tracking)", "monthly": "$15", "description": "Join this tier if you enjoy the finer things in life. In this tier, you will receive the exclusive Gentlemon Pin of the month. Every month, you will receive an all-new pin design or a Patreon exclusive pin variant. Gentlemon Pin of the Month FREE tracking within the United States You will also have: Access to blog posts, sneak peeks, and behind-the-scenes Ability to vote and nominate future Gentlemon designs for the next month!"}], "tags": "", "socialmedias": ["https://www.instagram.com/itsgeoffrey", "https://twitter.com/", "https://facebook.com/", "https://tumblr.com/", "https://google.com/"]}
    :
    Math.random() < 0.5 ?
    {"site": "subscribestar", "page_link": "https://www.subscribestar.com/mhv", "artist_name": "Military History Visualized", "artist_image": "https://d3ts7pb9ldoin4.cloudfront.net/uploads/users/8758/avatars/d96fdd26-4a48-4b75-a76a-191c74fc107e-380x380_39x39_384x384.png", "artist_banner": "https://d3ts7pb9ldoin4.cloudfront.net/uploads/users/8758/covers/c2502e0e-5ceb-43e4-9815-3cfabb8f1d2c-1240x0_0x2_1599x300.png", "bio": "YouTube Channel on Military History", "bio_long": null, "amount_post": "831", "amount_subs": "", "price_tiers": [{"title": "Gefreiter / Corporal", "monthly": "$1", "description": "Weekly updates - on upcoming videos, events and other behind the scenes information. "}, {"title": "Feldwebel / Sergeant", "monthly": "$3", "description": "Early Access - Get Early Access to my videos."}, {"title": "Leutnant / Lieutenant", "monthly": "$7", "description": "Monthly Livestream - Once a month there is live-stream just for the members of this tier and above. The recorded version will also be exclusive to you."}, {"title": "Hauptmann / Captain", "monthly": "$15", "description": "Discord Server Access - Chat with like-minded individuals.   Exclusive Discord server access (includes Military Aviation History and Justin). "}, {"title": "Oberst", "monthly": "$30", "description": "WW2 Question - Submit one Content Question about WW2 to the Monthly Oberst Q & A. Note that the question must be feasible, don't worry so far we also adapted it successfully. The question will be answered at least audio-only for all Obersts, yet might also turn into a full video. Non-WW2 question might be possible, if my library covers it. Note regular content guidelines: NO war crimes, NO atrocities & NO political units."}], "tags": ["MilitaryHistory", "History", "Education", "YouTube", "Military"], "socialmedias": []}
    :
    {"site": "ko-fi", "page_link": "https://ko-fi.com/mixidixy", "artist_name": "Mixi Dixy", "artist_image": "https://storage.ko-fi.com/cdn/useruploads/4955f077-a4c1-4c33-819e-65dcec8ab0f3.gif", "artist_banner": "https://storage.ko-fi.com/cdn/useruploads/png_51cc8ce2-2eaf-414b-90b3-aa006ea8677ccover.jpg?v=2a0858d4-2719-4b67-b10e-11f5268d1491", "bio": "Welcome to my Ko-fi Page. I'm a huge fan of  FFXIV, Warcraft and I love drawing characters or anything related to the fantasy world. If you enjoy my content, please consider supporting what I do. Thank you °˖✧◝(⁰▿⁰)◜✧˖°\n", "bio_long": null, "amount_post": null, "amount_subs": 595, "price_tiers": [{"title": "Scree!!! Tier ", "monthly": "$1", "description": "Scree!!!\n\n🌱Get early access to my drawings in full resolution before being post on any platform! \n\n🌱Feature on Twitter (tweet) and Instagram (story)"}, {"title": "Dust Bunny Tier", "monthly": "$5", "description": "Mine! Mine!! \nGet all the rewards from the previous tier, plus\n\n🌱Sketches and WIPs\n\n🌱 New: Get added to my Twitter Circle where I post exclusive content for Ko-Fi members"}, {"title": "Fatter Cat Tier", "monthly": "$10", "description": "The thing got serious now, eh?\n\nGet all of the above rewards, plus\n\n🌱 Monthly accumulations to get a different drawing\n\n🌱 Priority in commissions\n\n🌱 New: Get added to my Twitter Circle where I post exclusive content for Ko-Fi members"}, {"title": "Seasonal Tier", "monthly": "$15", "description": "We’re all mad here. I’m mad. You’re mad 🌸🍃\n\nWe have to be fashionable, according to the season, don't you think?\n\nGet all of the above rewards, plus\n\n \n🌱 YCH (Your Character Here) seasonal according to the month\n\n🌱 New: Get added to my Twitter Circle where I post exclusive content for Ko-Fi members"}], "tags": ["Drawing & Painting", "Art", "Commissions"], "socialmedias": ["https://instagram.com/mixidixy", "https://twitter.com/mixidixy"]},

  }),

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
