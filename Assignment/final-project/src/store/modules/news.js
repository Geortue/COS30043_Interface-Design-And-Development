import api from "@/services/api";

const state = () => ({
  news: [],
});

const mutations = {
  setNews(state, newsList) {
    state.news = newsList;
  },
};

const actions = {
  async fetchNews({ commit }) {
    try {
      const { data } = await api.get("/news.php");
      commit("setNews", data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  },
};

const getters = {
  allNews: (state) => state.news,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
