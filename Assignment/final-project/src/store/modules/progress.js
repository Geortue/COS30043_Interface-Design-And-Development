import api from "@/services/api";

const state = () => ({
  progress: [],
});

const mutations = {
  setProgress(state, progress) {
    state.progress = progress;
  },
  addProgress(state, record) {
    state.progress.push(record);
  },
  removeProgress(state, { user_id, course_id, unit_id }) {
    state.progress = state.progress.filter(
      (p) =>
        !(
          p.user_id == user_id &&
          p.course_id == course_id &&
          p.unit_id == unit_id
        )
    );
  },
};

const actions = {
  async fetchProgress({ commit }, userId) {
    try {
      const { data } = await api.get(`/progress.php?user_id=${userId}`);
      commit("setProgress", data);
    } catch (error) {
      console.error("Failed to fetch progress:", error);
    }
  },

  async markUnitComplete({ commit }, { user_id, course_id, unit_id }) {
    try {
      await api.post("/progress.php", { user_id, course_id, unit_id });
      commit("addProgress", { user_id, course_id, unit_id });
    } catch (error) {
      console.error("Failed to mark unit complete:", error);
    }
  },

  async unmarkUnitComplete({ commit }, { user_id, course_id, unit_id }) {
    try {
      await api.delete(
        `/progress.php?user_id=${user_id}&unit_id=${unit_id}&course_id=${course_id}`
      );
      commit("removeProgress", { user_id, course_id, unit_id });
    } catch (error) {
      console.error("Failed to unmark unit complete:", error);
    }
  },
};

const getters = {
  unitProgressByCourse: (state) => (courseId) => {
    return state.progress.filter((p) => p.course_id == courseId);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
