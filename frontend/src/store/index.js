import { createStore } from "vuex";

export default createStore({
  state: {

  },
  getters: {
    getResults: () => async (query) => {
      const url = import.meta.env.VITE_BACKEND_URL
      console.log(`++ FETCH ++\n'${url}/query?${query}'`)
      let results = await (await fetch(`${url}/query?${query}`)).json()
      console.log(results)
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
