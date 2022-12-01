import { createStore } from "vuex";

export default createStore({
  state: {

  },
  getters: {
    getResults: () => async (query) => {
      const url = import.meta.env.VITE_BACKEND_URL
      return await (await fetch(`${url}/query${query}`)).json()
    }
  },
  mutations: {

  },
  actions: {

  },
  modules: {

  },
});
