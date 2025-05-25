import api from "@/services/api";

const state = () => ({
  likedCourses: {},
});

const mutations = {
  setLikedCourse(state, { courseId, liked }) {
    state.likedCourses = {
      ...state.likedCourses,
      [courseId]: liked,
    };
  },
  setLikedCourses(state, courseIds) {
    const map = {};
    courseIds.forEach((id) => {
      map[id] = true;
    });
    state.likedCourses = map;
  },
};

const actions = {
  async checkIfLiked({ commit }, { userId, courseId }) {
    try {
      const { data } = await api.get(
        `/likes.php?action=check&user_id=${userId}&course_id=${courseId}`
      );
      commit("setLikedCourse", { courseId, liked: Boolean(data.liked) });
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  },

  async fetchUserLikes({ commit }, userId) {
    try {
      const { data } = await api.get(`/likes.php?action=user&id=${userId}`);
      const courseIds = data.map((like) => parseInt(like.course_id));
      commit("setLikedCourses", courseIds);
    } catch (error) {
      console.error("Failed to fetch user likes:", error);
    }
  },

  async likeCourse({ commit }, { userId, courseId }) {
    try {
      await api.post("/likes.php", { user_id: userId, course_id: courseId });
      commit("setLikedCourse", { courseId, liked: true });
    } catch (error) {
      console.error("Failed to like course:", error);
      throw error;
    }
  },

  async unlikeCourse({ commit }, { userId, courseId }) {
    try {
      await api.delete(`/likes.php?user_id=${userId}&course_id=${courseId}`);
      commit("setLikedCourse", { courseId, liked: false });
    } catch (error) {
      console.error("Failed to unlike course:", error);
      throw error;
    }
  },
};

const getters = {
  isCourseLiked: (state) => (courseId) => !!state.likedCourses[courseId],
  likedCourseIds: (state) => {
    return Object.keys(state.likedCourses)
      .filter((id) => state.likedCourses[id])
      .map(Number);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
