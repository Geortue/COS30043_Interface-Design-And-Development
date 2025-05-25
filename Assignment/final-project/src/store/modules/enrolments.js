import api from "@/services/api";

const state = () => ({
  enrolledCourses: [],
  completedCourses: [],
  allEnrolments: [],
});

const mutations = {
  setEnrolled(state, data) {
    state.enrolledCourses = data;
  },
  setCompleted(state, data) {
    state.completedCourses = data;
  },
  setAllEnrolments(state, enrolments) {
    state.allEnrolments = enrolments;
  },
};

const actions = {
  async fetchEnrolments({ commit }, userId) {
    try {
      const { data } = await api.get(`/enrolments.php?user_id=${userId}`);

      // Store all enrolments regardless of completed status
      const enrolled = data.filter((e) => e.user_id == userId);
      const completed = data.filter(
        (e) => e.completed === "1" || e.completed === 1
      );

      commit("setEnrolled", enrolled);
      commit("setCompleted", completed);
    } catch (error) {
      throw error;
    }
  },

  async fetchAllEnrolments({ commit }) {
    try {
      const { data } = await api.get("/enrolments.php");
      commit("setAllEnrolments", data);
    } catch (error) {
      console.error("Failed to fetch all enrolments:", error);
    }
  },

  async enrolCourse({ dispatch }, { userId, courseId }) {
    await api.post("/enrolments.php", {
      user_id: userId,
      course_id: courseId,
    });
    await dispatch("fetchEnrolments", userId);
  },
  async unenrolCourse(_, { userId, courseId }) {
    await api.delete(`/enrolments.php?user_id=${userId}&course_id=${courseId}`);
  },

  async getTotalEnrolments(_, courseId) {
    const { data } = await api.get(
      `/enrolments.php?action=count&course_id=${courseId}`
    );
    return data?.total || 0;
  },
};

const getters = {
  enrolledCourses: (state) => state.enrolledCourses,
  completedCourses: (state) => state.completedCourses,
  allEnrolments: (state) => state.allEnrolments,
  isEnrolled: (state) => (courseId) =>
    state.enrolledCourses.some((e) => e.course_id == courseId),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
