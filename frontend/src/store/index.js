import { createStore } from "vuex";

export default createStore({
  state: {

  },
  getters: {
    getResults: () => async (query) => {
      const url = import.meta.env.VITE_BACKEND_URL
      let results = await (await fetch(`${url}/query?${query}`)).json()
      console.log(`++ FETCH ++\n'${url}/query?${query}'`, results)
      return results;
    },
    getFilters: () => async () => {
      const url = import.meta.env.VITE_BACKEND_URL
      let results = await (await fetch(`${url}/query/stats`)).json()
      console.log(`++ Filters ++\n'${url}/stats'`, results)
      return results;
    },
    getRecommendations: () => async (query) => {
      const url = import.meta.env.VITE_BACKEND_URL

      let results = await (await fetch(`${url}/query/mlt?${query}`)).json()

      while(!results.response) {
          // solr is buggy and sometimes returns an empty response
          results = await (await fetch(`${url}/query/mlt?${query}`)).json()
      }

      console.log(`++ Recommendations ++\n'${url}/query/mlt?${query}'`, results)
      return results;
    },

    sendFeedback: () => async (form) => {
      const url = import.meta.env.VITE_BACKEND_URL
      console.log(form)
      return fetch(`${url}/query/feedback`, {method:'POST', headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {

  },
});
