<template>
  <nav
    class="navbar navbar-expand-lg navbar-light nav-gradient shadow-sm fixed-top"
  >
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold text-white" to="/"
        >Learniverse</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center gap-3">
          <li class="nav-item">
            <a
              class="nav-link text-white"
              href="#"
              @click.prevent="navigateAndCollapse('/courses')"
              >Courses</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link text-white"
              href="#"
              @click.prevent="navigateAndCollapse('/news')"
              >News</a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link text-white"
              href="#"
              @click.prevent="navigateAndCollapse('/about-us')"
              >About Us</a
            >
          </li>

          <template v-if="!user">
            <li class="nav-item">
              <a
                class="nav-link text-white"
                href="#"
                @click.prevent="navigateAndCollapse('/auth')"
                >Login</a
              >
            </li>
          </template>

          <template v-else>
            <li class="nav-item dropdown ms-3">
              <a
                class="nav-link dropdown-toggle text-white d-flex align-items-center"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  :src="`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`"
                  class="rounded-circle me-2"
                  style="width: 32px; height: 32px"
                />
                <span>{{ user.firstName }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="navigateAndCollapse('/dashboard')"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <button class="dropdown-item" @click="logoutAndRedirect">
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "NavBar",
  computed: {
    ...mapGetters("auth", ["user"]),
  },
  methods: {
    ...mapMutations("auth", ["logout"]),
    logoutAndRedirect() {
      this.logout();
      this.$router.push("/");
      this.collapseNavbar();
    },
    collapseNavbar() {
      const nav = document.getElementById("navbarNav");
      if (nav && window.getComputedStyle(nav).display !== "none") {
        const bsCollapse =
          bootstrap.Collapse.getInstance(nav) ||
          new bootstrap.Collapse(nav, { toggle: false });
        bsCollapse.hide();
      }
    },
    navigateAndCollapse(path) {
      this.$router.push(path);
      this.collapseNavbar();
    },
  },
};
</script>

<style scoped>
.nav-gradient {
  background: linear-gradient(to right, #4e54c8, #8f94fb);
  z-index: 1050;
}
.navbar {
  padding: 1rem 2rem;
}
.navbar .nav-link {
  font-weight: 500;
  transition: 0.3s;
}
.navbar .nav-link:hover {
  color: #ffd700 !important;
}
</style>
