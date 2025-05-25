import api from "@/services/api";

export const state = () => ({
  courses: [],
});

export const mutations = {
  setCourses(state, list) {
    state.courses = list;
  },
  addCourse(state, course) {
    state.courses.push(course);
  },
  updateCourse(state, updated) {
    const index = state.courses.findIndex((c) => c.id === updated.id);
    if (index !== -1) state.courses.splice(index, 1, updated);
  },
  deleteCourse(state, id) {
    state.courses = state.courses.filter((c) => c.id !== id);
  },
  updateCourseLikes(state, { courseId, likes }) {
    const course = state.courses.find((c) => c.id == courseId);
    if (course) {
      course.likes = likes;
    }
  },
};

export const actions = {
  async fetchCourses(
    { commit },
    { category = "", difficulty = "", page = 1, limit = 10 } = {}
  ) {
    const params = new URLSearchParams({ category, difficulty, page, limit });
    const { data } = await api.get(`/courses.php?${params.toString()}`);
    commit("setCourses", data);
  },
  async addCourse({ dispatch }, course) {
    await api.post("/courses.php", course);
    dispatch("fetchCourses");
  },
  async updateCourse({ dispatch }, course) {
    const { id, ...data } = course;
    await api.put(`/courses.php?id=${id}`, data);
    dispatch("fetchCourses");
  },
  async deleteCourse({ dispatch }, id) {
    await api.delete(`/courses.php?id=${id}`);
    dispatch("fetchCourses");
  },

  async updateCourseLikes({ commit }, { courseId, likes }) {
    // This is an optimistic update. It updates the frontend first.
    commit("updateCourseLikes", { courseId, likes });
    try {
      // Then it attempts to update the backend.
      await api.put(`/courses.php?action=update_likes`, {
        id: courseId,
        likes,
      });
    } catch (error) {
      throw error;
    }
  },
};

export const getters = {
  allCourses: (state) => state.courses,
  getCourseById: (state) => (id) => state.courses.find((c) => c.id == id),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
