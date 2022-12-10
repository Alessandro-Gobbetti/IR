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
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {

  },
});
