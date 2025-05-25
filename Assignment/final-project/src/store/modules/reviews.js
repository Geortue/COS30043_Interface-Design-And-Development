import api from "@/services/api";

const state = () => ({
  reviews: [],
});

const mutations = {
  setReviews(state, reviews) {
    state.reviews = reviews;
  },
  addReview(state, review) {
    state.reviews.push(review);
  },
  updateReview(state, updated) {
    const index = state.reviews.findIndex((r) => r.id === updated.id);
    if (index !== -1) state.reviews.splice(index, 1, updated);
  },
  deleteReview(state, id) {
    state.reviews = state.reviews.filter((r) => r.id !== id);
  },
};

const actions = {
  async fetchReviews({ commit }) {
    const { data } = await api.get("/reviews.php");
    commit("setReviews", data);
  },
  async addReview({ dispatch }, review) {
    await api.post("/reviews.php", review);
    dispatch("fetchReviews");
  },
  async updateReview({ dispatch }, review) {
    await api.post(`/reviews.php?action=update&id=${review.id}`, review);
    dispatch("fetchReviews");
  },
  async deleteReview({ dispatch }, id) {
    await api.delete(`/reviews.php?id=${id}`);
    dispatch("fetchReviews");
  },
};

const getters = {
  reviewsByCourse: (state) => (courseId) =>
    state.reviews.filter((r) => r.course_id == courseId),
  reviewsByUser: (state) => (userId) =>
    state.reviews.filter((r) => r.user_id == userId),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
