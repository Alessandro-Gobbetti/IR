<template>
  <a class="artist_card" v-bind:href=artist.page_link>
    <img class="artist_image" :src="artist.artist_image" alt="artist image" />
    <img class="site_logo" :src="getLogo()" alt="" />
    <h2 class="name" v-snip="{ lines: 1, mode: 'css'}">{{ artist.artist_name }}</h2>
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

  // props: {
  //   artist: {
  //     type: Object,
  //     required: true,
  //   },
  // },

  data: () => ({
    artist_kofi: {
      site: "ko-fi",
      page_link: "https://ko-fi.com/aircrackle",
      artist_name: "aircrackle",
      artist_image:
        "https://cdn.ko-fi.com/cdn/useruploads/3b003a89-1b2f-4ab0-a704-96c7eddb4ece.png",
      artist_banner:
        "https://cdn.ko-fi.com/cdn/useruploads/jpeg_70d00cc9-7aa4-4fbb-9391-e422e3d83815cover.jpeg?v=7f416b42-8058-4163-8564-d4b98326fdda",
      bio: "i'm saving up for emergency funds once again since the pandemic feels like it's not going to end soon. if you donate 5 ko-fi or more you get a colored sketch from me! thank you ~",
      bio_long: null,
      amount_post: null,
      amount_subs: 79,
      price_tiers: [],
      tags: ["Animation", "Art", "Commissions"],
      socialmedias: [
        "https://instagram.com/aircrackle",
        "https://twitter.com/youkaishain",
      ],
    },

  artist: 
    Math.random() < 0.3 ?
    {"site": "patreon", "page_link": "https://www.patreon.com/geoffreysiu", "artist_name": "Geoffrey Siu Art", "artist_image": "https://c10.patreonusercontent.com/4/patreon-media/p/campaign/4365400/0ef3ca7d793e4caca1a02299204a3c57/eyJ3IjoyMDB9/4.png?token-time=2145916800&token-hash=UxdUTHJ1goSnREDHvo5ygr1gwfS6frbREttdkruzCL8%3D", "artist_banner": "", "bio": "fancy Pokemon pins every month", "bio_long": "Hello there! It's Geoffrey and I am an artist/designer in Honolulu, Hawaii. I design enamel pins, t-shirts, draw silly dad-humor comics, and love staying inside even when the weather is nice out. Expect exclusive Gentlemon pin designs, stickers, and a first look at new products before they hit the shelves! I love to draw cute things with a long history with video games and anime/manga. I got my first start making little charms and t-shirts at a local anime convention! I started doing it with a friend in high school. We had a good run, but school and stuff got in the way. A decade later, I am back at creating products and selling original artwork and have finally made this my full-time job! ", "amount_post": 107, "amount_subs": 351, "price_tiers": [{"title": "Supporter", "monthly": "$3", "description": "For those that simply fancy everything Gentlemon. In this tier, you will receive: Access to blog posts, sneak peeks, and behind-the-scenes Ability to vote and nominate future Gentlemon designs for the next month!"}, {"title": "Sticker Club - US/ INTL (No Tracking)", "monthly": "$6", "description": "Join this tier if you wanna treat yourself to something fancy. In this tier, you will receive the exclusive Gentlemon Sticker of the month. Every month, you will receive an all-new holographic glitter sticker design or a Patreon exclusive variant of a sticker. Gentlemon Sticker of the Month NO TRACKING # You will also have: Access to blog posts, sneak peeks, and behind-the-scenes Ability to vote and nominate future Gentlemon designs for the next month!"}, {"title": "Pin Club - US (+ Tracking)", "monthly": "$15", "description": "Join this tier if you enjoy the finer things in life. In this tier, you will receive the exclusive Gentlemon Pin of the month. Every month, you will receive an all-new pin design or a Patreon exclusive pin variant. Gentlemon Pin of the Month FREE tracking within the United States You will also have: Access to blog posts, sneak peeks, and behind-the-scenes Ability to vote and nominate future Gentlemon designs for the next month!"}], "tags": "", "socialmedias": ["https://www.instagram.com/itsgeoffrey"]}
    :
    Math.random() < 0.5 ?
    {"site": "subscribestar", "page_link": "https://www.subscribestar.com/mhv", "artist_name": "Military History Visualized", "artist_image": "https://d3ts7pb9ldoin4.cloudfront.net/uploads/users/8758/avatars/d96fdd26-4a48-4b75-a76a-191c74fc107e-380x380_39x39_384x384.png", "artist_banner": "https://d3ts7pb9ldoin4.cloudfront.net/uploads/users/8758/covers/c2502e0e-5ceb-43e4-9815-3cfabb8f1d2c-1240x0_0x2_1599x300.png", "bio": "YouTube Channel on Military History", "bio_long": null, "amount_post": "831", "amount_subs": "", "price_tiers": [{"title": "Gefreiter / Corporal", "monthly": "$1", "description": "Weekly updates - on upcoming videos, events and other behind the scenes information. "}, {"title": "Feldwebel / Sergeant", "monthly": "$3", "description": "Early Access - Get Early Access to my videos."}, {"title": "Leutnant / Lieutenant", "monthly": "$7", "description": "Monthly Livestream - Once a month there is live-stream just for the members of this tier and above. The recorded version will also be exclusive to you."}, {"title": "Hauptmann / Captain", "monthly": "$15", "description": "Discord Server Access - Chat with like-minded individuals.   Exclusive Discord server access (includes Military Aviation History and Justin). "}, {"title": "Oberst", "monthly": "$30", "description": "WW2 Question - Submit one Content Question about WW2 to the Monthly Oberst Q & A. Note that the question must be feasible, don't worry so far we also adapted it successfully. The question will be answered at least audio-only for all Obersts, yet might also turn into a full video. Non-WW2 question might be possible, if my library covers it. Note regular content guidelines: NO war crimes, NO atrocities & NO political units."}], "tags": ["MilitaryHistory", "History", "Education", "YouTube", "Military"], "socialmedias": []}
    :
    {"site": "ko-fi", "page_link": "https://ko-fi.com/butterberrycafe", "artist_name": "giuseppe", "artist_image": "https://storage.ko-fi.com/cdn/useruploads/16e23638-fd32-4663-9120-50ab2807aa17.png", "artist_banner": "https://cdn.ko-fi.com/cdn/useruploads/png_9be579f5-59e1-4909-850f-ee8199da292acover.png?v=a3371dc2-4916-4f99-a99f-d29bd4ab908a", "bio": "「 butterberry café 」is a purveyor of custom and premade (P2U) pixel art twitch badges and emotes. and we make a darn good cup of coffee, too!", "bio_long": null, "amount_post": null, "amount_subs": 2731, "price_tiers": [], "tags": ["Art", "Commissions", "Gaming"], "socialmedias": ["https://twitter.com/butterberrycafe"]},


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
  padding: 10px 10px;
  grid-column-gap: 10px;
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
  opacity: 1;
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
