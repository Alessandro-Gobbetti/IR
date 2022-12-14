<template>
  <div class="h-100 w-100 d-flex flex-column align-center">
    <img class="logo" src="@/assets/images/logo1.png" />
    <SearchBar :onchange="onchange" />

    <div class="mb-16 w-100 d-flex align-center flex-column bottom">
      <h3> Explore popular categories</h3>
      <v-progress-circular v-if="this.tagsLoading" class="align-self-center"
                           :size="30"
                           color="black"
                           indeterminate
      ></v-progress-circular>
      <div v-else class="mt-3 w-50 justify-center align-center">
        <template v-for="(tag,idx) in this.tags.slice(0,20)" >
          <router-link style="text-decoration: none;" :to="`/search?q= AND tags=(${tag.title.toLowerCase()})`">
            <v-chip class="ma-1 text-orange-darken-4 category">
              <span>{{ `${tag.title} (${tag.value})` }}</span>
            </v-chip>
          </router-link>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import SearchBar from "@/components/SearchBar.vue";
import router from "@/router";
import store from "@/store";

export default defineComponent({
  name: "Homepage",

  components: {
    SearchBar
  },
  data() {
    return {
      tagsLoading : true,
      tags: []
    }
  },
  async beforeMount() {
    this.tags = (await store.getters.getFilters()).tags
    this.tagsLoading = false
    console.log(this.tags)
  },

  methods: {
    async onchange(value) {
      if (!value)
        return

      await router.push(`/search?q=${value}`)
      router.forward()
    },
    onchipclick(e) {
      console.log(e)
    }
  }
});
</script>

<style scoped>

.category {
  font-variant: small-caps;
  transition: transform 0.2s;
  cursor: pointer;
}

.category:hover {
  transform: scale(1.1);
}

.logo {
  margin-top: 5%;
  width:15vw;
}

.bottom {
  position: absolute;
  top: 75%;
}

</style>

