<template>
  <div class="form">
    <img src="@/assets/images/logo1.png" alt="logo" class="logo" @click="goHomepage">

    <input
        ref="input"
        class="form-control rounded-lg"
        placeholder="Search"
        :value="this.getTextFromBackendFilterUrl(this.curr_params.q)"
        @keyup.enter="this.onenterkey"
        :oninput="(e)=>{
          this.oninputchange(e)
        }"
    />

    <div class="advance_button rounded-lg" @click="toggleAdvancedSearch" :class="{active: show_advanced_search}">
      <v-icon class="mr-2">mdi-tune-variant</v-icon>
      
      <v-icon v-if="show_advanced_search">mdi-chevron-up</v-icon>
      <v-icon v-else>mdi-chevron-down</v-icon>
    </div>
    
    <Transition name="slide-fade">
      <div v-if="show_advanced_search" class="advance_form">
        
        <!-- Select websites -->
        <div class="search_field">
          <h3>Website</h3>
          <v-select
            class="selector"
            v-model="website_list_value"
            :items="filter_options.website_list"
            item-title="title"
            item-value="value"

            label="Select website"
            multiple
            variant="solo"
            density="compact"
            clearable
            select-content-border-radius="0"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span style="font-size: 0.7em;">{{ item.value }}</span>
              </v-chip>
              <span
                v-if="index === 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ website_list_value.length - 2 }})
              </span>
            </template>
          </v-select>
        </div>
    

        <!-- Select categories -->
        <div class="search_field">
          <h3>Category</h3>
          <v-select
            class="selector"
            v-model="category_list_value"
            :items="filter_options.category_list"
            item-title="title"
            item-value="value"

            label="Select category"
            multiple
            variant="solo"
            density="compact"
            persistent-hint
            clearable
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span style="font-size: 0.7em;">{{ item.value }}</span>
              </v-chip>
              <span
                v-if="index === 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ category_list_value.length - 2 }})
              </span>
            </template>
          </v-select>
        </div>

        <!-- Select subs range -->
        <div class="search_field">
          <h3>Supporters</h3>
          <v-range-slider
            class="range"
            v-model="subs_range_value"
            :min="filter_options.subs_range[0]"
            :max="filter_options.subs_range[1]"
            step="20"
            thumb-label
          ></v-range-slider>
        </div>

        <!-- Select price range -->
        <div class="search_field">
          <h3>Price</h3>
          <v-range-slider
            class="range"
            v-model="price_range_value"
            :min="filter_options.price_range[0]"
            :max="filter_options.price_range[1]"
            step="1"
            thumb-label="always"
          ></v-range-slider>
        </div>
        <!-- search button -->
        
      </div>
    </Transition>
    

  </div>
</template>

<script>
// Components
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "SearchBar",
  async beforeMount() {
    let filters = await store.getters.getFilters()
    this.$data.filter_options = {
      website_list: filters.sites.slice(0, 7).map(obj=> {
        return {title: `${obj.title} (${obj.value})`, value: obj.title}
      }),
      category_list: filters.tags.slice(0, 30).map(obj=> {
        return {title: `${obj.title} (${obj.value})`, value: obj.title}
      }),
      subs_range: filters.subs,
      price_range: filters.price,
    }
    this.$data.subs_range_value = filters.subs
    this.$data.price_range_value = filters.price
  },
  data() {
    return {
      // Current value of the input field
      curr_params: this.queryParam,
      // The last fetched query
      last_query: null,
      show_advanced_search: false,


      website_list_value: [],

      category_list_value: [],

      filter_options : {
        website_list: ['Banana'],
        category_list: ['Banana'],
        subs_range: [0, 100],
        price_range: [0, 100],
      },


      subs_range_value: [0, 1000],
      price_range_value: [0, 250],

    }
  },

  methods: {
    buildBackendFilterUrl(query) {
      let query_str = `${query}`
      query_str += this.website_list_value.length > 0 ? ` AND site:(${this.website_list_value.map(x => x.toLowerCase()).join(' ')})` : ''
      query_str += this.category_list_value.length > 0 ? ` AND tags:(${this.category_list_value.map(x => x.toLowerCase()).join(' ')})` : ''

      if (this.subs_range_value[0] !== this.filter_options.subs_range[0] || this.subs_range_value[1] !== this.filter_options.subs_range[1]) {
        query_str += ` AND amount_subs:[${this.subs_range_value[0]} TO ${this.subs_range_value[1]}]`
      }
      // TODO: Add price range

      return query_str
    },
    initFiltersFromBackendFilterUrl(query) {
      if(query===undefined)
        return
      // parse query to set filters
      let query_arr = query.split(' AND ')
      for (let filter of query_arr) {
        let [field, value] = filter.split(':')
        switch (field) {
          case 'site':
            this.website_list_value = value.replace('(', '').replace(')', '').split(' ')
            break;
          case 'tags':
            this.category_list_value = value.replace('(', '').replace(')', '').split(' ')
            break;
          case 'amount_subs':
            this.subs_range_value = value.replace('[', '').replace(']', '').split(' TO ')
            break;
          case 'price':
            this.price_range_value = value.replace('[', '').replace(']', '').split(' TO ')
            break;
          default:
            break;
        }
      }
    },
    getTextFromBackendFilterUrl(query) {
      if(query === undefined)
        return
      // the text to display in the input field
      return query.replace('q=', '').split(' AND ')[0]
      // return this.detokenizeQuery(query.replace('q=', '').split(' AND ')[0])
    },
    // Runs the query and calls the callback function with the fetched results
    async performQuery(){
      // Avoids performing a fetch if the callback function is not defined.
      if(this.onresultschange) {
        this.onresultschange(await this.fetchResults(this.buildBackendFilterUrl(this.curr_params.q), this.queryParam.page))
      }
    },
    onenterkey(e) {
      if (e.target.value.length > 0) {
        this.curr_params.q = this.buildBackendFilterUrl(e.target.value)
        this.onchange(this.curr_params.q)
      }
    },
    // Async runs a query and returns the results.
    async fetchResults(query,page=1) {
      this.last_query = query

      if (window.location.href.indexOf('similar_docs:') !== -1) {
        let similar_docs = window.location.href.split('similar_docs:')[1].split(' AND ')[0]
        // scroll to the top of the page smoothly
        window.scrollTo({top: 0, behavior: 'smooth'})
        return await store.getters.getRecommendations(`q=${similar_docs}`)
      }

      return await store.getters.getResults(`q=${query}&page=${page}`)
    },
    toggleAdvancedSearch(){
      this.show_advanced_search = !this.show_advanced_search
    },
    goHomepage(){
      this.$router.push("/");
    },
  },
  watch: {
    // Listener running on mount and when prop 'queryParam' changes.
    'queryParam': {
      handler() {
        // Does not do anything if it's the same value and has already fetched it.
        if (this.queryParam === this.curr_params && this.last_query)
            return
        this.curr_params = this.queryParam
        this.initFiltersFromBackendFilterUrl(this.queryParam.q);
        if(this.fetchInitialValue)
          this.performQuery()
      },
      immediate: true
    }
  },
  props: {
    queryParam: {
      type: Object,
      default: {
        q:"",
        page:1
      }
    },
    fetchInitialValue: {
      type: Boolean,
      default: false
    },
    // When the input value changes (eg any key press)
    oninputchange: {
      type: Function,
      default: (e)=>{}
    },
    // When the input is confirmed (eg 'Enter' key)
    onchange: {
      type: Function,
      default: (e)=>{}
    },
    // When the results are fetched. If none the fetch does not run in the first place.
    onresultschange: {
      type: Function,
    }
  },

  components: {
    // HelloWorld,
  },
});
</script>


<style scoped>
.form {
  width: 70%;
  display: grid;
  grid-template-columns: 50px 1fr auto;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "logo input button"
    "form form form";
  column-gap: 1vh;
  row-gap: 2vh;
  padding: 3vh 3vh 0;

}

.logo {
  grid-area: logo;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo:hover {
  cursor: pointer;
  transform: rotate(360deg) scale(1.2);
}

.form-control {
  grid-area: input;

  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.form-control:focus { /* TODO: add suggestions */
  border: none;
  outline: none;
}

.advance_button {
  grid-area: button;
  background-color: rgb(232, 232, 232);
  cursor: pointer;
  padding: 10px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none;
  transition: transform 0.2s;
}

.advance_button:hover {
  transform: scale(1.05);
}

.advance_button.active::before {
  content: "";
  position: absolute;
  /* center the triangle */
  transform: translateY(85%);
  border-width: 2vh;
  border-style: solid;
  border-color: rgb(232, 232, 232) transparent transparent transparent;}

.advance_form {
  grid-area: form;
  margin-bottom: 3vh;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3vh;
  background-color: rgb(232, 232, 232);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 1vh 2vw ;
}

.search_field {
  width: 20%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

/* get second child */
.search_field > *:nth-child(2) {
  width: 100%;
}

.range {
  margin-top: 2em;
  margin-bottom: 0;
  padding: 0 1vh;
}

















/* TRANSITION */
/**

* {
  transition: all 1.5s ease;
}

.slide-fade-enter-active {
  transition: all 1.5s ease;
  transform-origin: top;
}

.slide-fade-leave-active {
  transition: all 1.5s ease;
  transform-origin: top;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform-origin: top;
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
} **/
</style>
