import api from "@/services/api";

const state = () => ({
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null,
  users: [],
});

const mutations = {
  setUser(state, user) {
    state.user = user;
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  },
  logout(state) {
    state.user = null;
    localStorage.removeItem("loggedInUser");
  },
  setUsers(state, users) {
    state.users = users;
  },
};

const actions = {
  async login({ commit }, credentials) {
    const { data } = await api.post("/users.php?action=login", credentials);
    commit("setUser", data);
  },
  async register(_, user) {
    await api.post("/users.php", user);
  },
  async fetchUsers({ commit }) {
    const { data } = await api.get("/users.php");
    commit("setUsers", data);
  },
};

const getters = {
  user: (state) => state.user,
  isLoggedIn: (state) => !!state.user,
  role: (state) => state.user?.role,
  users: (state) => state.users,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
