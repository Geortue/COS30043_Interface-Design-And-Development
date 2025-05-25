import api from "@/services/api";

const state = () => ({
  units: [],
});

const mutations = {
  setUnits(state, units) {
    state.units = Array.isArray(units) ? units : [];
  },

  addUnits(state, newUnits) {
    const unitsArray = Array.isArray(newUnits) ? newUnits : [];
    unitsArray.forEach((unit) => {
      const existingIndex = state.units.findIndex((u) => u.id === unit.id);
      if (existingIndex >= 0) {
        state.units[existingIndex] = unit;
      } else {
        state.units.push(unit);
      }
    });
  },
};

const actions = {
  async fetchUnits({ commit }, courseId) {
    try {
      const response = await api.get(`/units.php?course_id=${courseId}`);

      const units = response.data || [];

      if (Array.isArray(units)) {
        commit("setUnits", units);
        return units;
      } else {
        commit("setUnits", []);
        return [];
      }
    } catch (error) {
      commit("setUnits", []);
      throw error;
    }
  },

  async fetchAllUnits({ commit }) {
    try {
      const response = await api.get("/units.php");

      const units = response.data || [];
      commit("setUnits", units);
      return units;
    } catch (error) {
      commit("setUnits", []);
      throw error;
    }
  },

  async createUnit({ dispatch }, unitData) {
    try {
      const response = await api.post("/units.php", unitData);
      await dispatch("fetchUnits", unitData.course_id);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUnit({ dispatch }, { id, courseId, ...unitData }) {
    try {
      const response = await api.put(`/units.php?id=${id}`, unitData);
      await dispatch("fetchUnits", courseId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteUnit({ dispatch }, { id, courseId }) {
    try {
      const response = await api.delete(`/units.php?id=${id}`);
      await dispatch("fetchUnits", courseId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

const getters = {
  allUnits: (state) => state.units,

  unitsByCourse: (state) => (courseId) => {
    const filteredUnits = state.units.filter((u) => {
      // Convert both to strings for comparison since API returns strings
      const unitCourseId = String(u.course_id);
      const targetCourseId = String(courseId);
      const matches = unitCourseId === targetCourseId;
      return matches;
    });

    return filteredUnits;
  },

  unitById: (state) => (id) => state.units.find((unit) => unit.id == id),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
