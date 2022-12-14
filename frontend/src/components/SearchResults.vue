<template>
  <div class="h-100">
    <FeedbackForm ref="feedbackform"
                  :immediately_open="open_feedback_form"
                  :query="(this.$route.query.q===undefined?'':this.$route.query.q).split(' AND')[0]">
    </FeedbackForm>

    <p class="align-self-baseline" v-if="Object.keys(results.stats).length >0">
      Found {{results.stats.found}} results in {{parseFloat(results.stats.exec_time).toFixed(5)}} seconds.
      <span class="font-italic" style="cursor: pointer" href="" @click="this.$refs.feedbackform.open">Not satisfied ?</span>
    </p>

    <template class="d-flex flex-column justify-center mt-7 w-100 h-auto ">
      <v-progress-circular v-if="this.is_loading" class="align-self-center"
                           :size="50"
                           color="black"
                           indeterminate
      ></v-progress-circular>
        <template v-else-if="(results.docs.length)==0">
          <h1 class="text-center">No results found</h1>
          <h3 class="text-center">Try searching for something else</h3>
        </template>
        <ArtistCardBig v-else v-for="(artist,idx) in results.docs" :artist="artist" :expanded="idx===0 && results.stats.page === 1" :key="artist.id" />
    </template>
    </div>
</template>

<script>
import ArtistCard from "@/components/ArtistCard.vue";
import ArtistCardBig from "@/components/ArtistCardBig.vue";
import {defineComponent} from "vue";
import FeedbackForm from "@/components/FeedbackForm.vue";

export default defineComponent({
  name: "SearchResults",

  data(){
    return {
      open_feedback_form: false
    }
  },
  props: {
    results: {
      type: [Object],
      default: {
        stats: {},
        docs: []
      }
    },
    is_loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openFeedbackForm() {
      console.log("APRO")
      this.open_feedback_form = true
    }
  },
  components: {
    FeedbackForm,
    ArtistCard,
    ArtistCardBig,
  },
})
</script>

<style scoped>

</style>