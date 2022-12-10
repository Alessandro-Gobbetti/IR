<template>
  <div class="form">
    <img src="@/assets/images/logo.png" alt="logo" class="logo">

    <input
        ref="input"
        class="form-control"
        placeholder="Search"
        :value="value"
        @keyup.enter="(e)=>{
          this.value = e.target.value
          this.onchange(this.value)
          performQuery();
        }"
        :oninput="(e)=>{
          this.oninputchange(e)
        }"
    />

    <div class="advance_button" @click="toggleAdvancedSearch" :class="{active: show_advanced_search}">
      Advanced search
      
      <v-icon v-if="show_advanced_search">mdi-chevron-up</v-icon>
      <v-icon v-else>mdi-chevron-down</v-icon>
    </div>
    
    <Transition name="slide-fade">
      <div v-if="show_advanced_search" class="advance_form">
        
        <!-- Select websites -->
        <div class="search_field">
          <h2>Website</h2>
          <v-select
            class="selector"
            v-model="website_list_value"
            :items="website_list"
            label="Select website"
            multiple
            variant="solo"
            persistent-hint
            clearable
            select-content-border-radius="0"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span style="font-size: 0.7em;">{{ item.title }}</span>
              </v-chip>
              <span
                v-if="index == 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ website_list_value.length - 2 }})
              </span>
            </template>
          </v-select>
        </div>
    

        <!-- Select categories -->
        <div class="search_field">
          <h2>Category</h2>
          <v-select
            class="selector"
            v-model="category_list_value"
            :items="category_list"
            label="Select category"
            multiple
            variant="solo"
            persistent-hint
            clearable
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2">
                <span style="font-size: 0.7em;">{{ item.title }}</span>
              </v-chip>
              <span
                v-if="index == 2"
                class="text-grey text-caption align-self-center"
              >
                (+{{ category_list_value.length - 2 }})
              </span>
            </template>
          </v-select>
        </div>

        <!-- Select subs range -->
        <div class="search_field">
          <h2>Supporters</h2>
          <v-range-slider
            class="range"
            v-model="subs_range_value"
            :min="subs_range[0]"
            :max="subs_range[1]"
            step="1"
            thumb-label="always"
          ></v-range-slider>
        </div>

        <!-- Select price range -->
        <div class="search_field">
          <h2>Price</h2>
          <v-range-slider
            class="range"
            v-model="price_range_value"
            :min="price_range[0]"
            :max="price_range[1]"
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
  watch: {
    // Listener running on mount and when prop 'initialValue' changes.
    'initialValue': {
      handler() {
        // Does not do anything if it's the same value and has already fetched it.
        if (this.initialValue == this.value && this.last_query)
          if (this.initialValue == this.value && this.last_query !== null)
            return
        this.value = this.initialValue;
        if(this.fetchInitialValue)
          this.performQuery()
      },
      immediate: true
    }
  },
  data() {
    return {
      // Current value of the input field
      value: this.initialValue,
      // The last fetched query
      last_query: null,
      show_advanced_search: false,

      website_list: ['Patreon', 'Ko-Fi', 'SubscribeStar'],
      website_list_value: [],

      category_list: ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'],
      category_list_value: [],

      subs_range: [0, 1000],
      price_range: [0, 250],
      subs_range_value: [0, 1000],
      price_range_value: [0, 250],

    }
  },

  methods: {
    // Runs the query and calls the callback function with the fetched results
    async performQuery(){
      // Avoids performing a fetch if the callback function is not defined.
      if(this.onresultschange)
        this.onresultschange(await this.fetchResults(this.value))
    },
    // Async runs a query and returns the results.
    async fetchResults(query) {
      this.last_query = query
      // TODO: Once there are complex queries (filters ecc). Parse it into string form here
      return await store.getters.getResults(`q=${query}`)
    },
    toggleAdvancedSearch(){
      this.show_advanced_search = !this.show_advanced_search
    },
  },
  props: {
    initialValue: {
      type: String,
      default: ""
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
  column-gap: 3vh;
  row-gap: 1vh;
  padding: 3vh;
  padding-bottom: 0;

}

.logo {
  grid-area: logo;
  width: 100%;
  height: 100%;
}

.form-control {
  grid-area: input;

  border-radius: 10vh;
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
  border-radius: 10vh;
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
  border-radius: 1vh;
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
