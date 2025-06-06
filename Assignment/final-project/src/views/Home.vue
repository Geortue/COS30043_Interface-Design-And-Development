<template>
  <div class="page-container">
    <div>
      <!-- Hero Section -->
      <section class="hero text-center py-5 text-white">
        <h3 class="display-4 fw-bold text-black">Welcome to</h3>
        <h1 class="display-1 fw-bold text-black">Learniverse</h1>
        <p class="blockquote text-black">
          Your gateway to a world of knowledge and skills.
        </p>
      </section>

      <!-- About Section -->
      <section class="about py-5 bg-light">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6 mb-3">
              <img src="../assets/books.svg" alt="Learning" class="img-fluid" />
            </div>
            <div class="col-md-6">
              <h3 class="fw-bold">About Learniverse</h3>
              <p>
                Learniverse is an interactive online platform offering
                high-quality courses in programming, design, marketing, and
                more. Whether you're a beginner or an advanced learner, our
                courses are designed to help you grow your skills at your own
                pace.
              </p>
              <router-link to="/about-us" class="btn btn-primary mt-3"
                >Learn More About Us</router-link
              >
            </div>
          </div>
        </div>

        <div class="wave-container">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" class="wave">
            <path d="M0,96L1440,0L1440,120L0,120Z" fill="#010d47" />
          </svg>
        </div>
      </section>

      <!-- Featured Courses -->
      <section class="courses py-5">
        <div class="container py-5">
          <h2 class="mb-4">Featured Courses</h2>
          <div class="row">
            <div
              v-for="course in featuredCourses"
              :key="course.id"
              class="col-md-4 mb-4"
            >
              <BaseCard>
                <h5>{{ course.title }}</h5>
                <p>{{ course.description }}</p>
                <router-link
                  v-if="user"
                  class="btn btn-sm btn-outline-info me-2"
                  :to="`/courses/${course.id}`"
                >
                  View Details
                </router-link>

                <button
                  v-else
                  class="btn btn-sm btn-outline-info me-2"
                  @click="showLoginPrompt"
                >
                  View Details
                </button>
              </BaseCard>
            </div>
          </div>
        </div>
      </section>

      <!-- News Section -->
      <section class="news py-5 bg-light">
        <h2 class="mt-5 mb-4">Latest News</h2>
        <div class="row">
          <div v-for="news in newsItems" :key="news.id" class="col-md-6 mb-4">
            <BaseCard>
              <h5>{{ news.title }}</h5>
              <p class="text-muted">{{ news.date }}</p>
              <p>{{ news.content }}</p>
            </BaseCard>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer text-center py-4 text-white bg-dark">
        <small>2025 Learniverse. All rights reserved.</small><br />
        <a href="#" class="text-white me-2">Privacy Policy</a>
        <a href="#" class="text-white">Terms of Service</a>
      </footer>
    </div>
  </div>

  <!-- Login modal -->
  <div
    class="modal fade"
    id="loginPrompt"
    tabindex="-1"
    ref="loginPrompt"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center p-4">
        <button
          type="button"
          class="btn-close ms-auto"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
        <div class="modal-body">
          <h5>Please log in to view course details</h5>
          <button
            type="button"
            class="btn btn-primary mt-3"
            @click="goToLoginAndCloseModal"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";
import { mapGetters, mapActions } from "vuex";
import * as bootstrap from "bootstrap";

export default {
  name: "Home",
  components: { BaseCard },
  computed: {
    ...mapGetters("auth", ["user"]),
    ...mapGetters("courses", ["allCourses"]),
    ...mapGetters("news", ["allNews"]),
    featuredCourses() {
      return Array.isArray(this.allCourses) ? this.allCourses.slice(0, 3) : [];
    },
    newsItems() {
      return Array.isArray(this.allNews) ? this.allNews.slice(0, 4) : [];
    },
  },
  methods: {
    ...mapActions("courses", ["fetchCourses"]),
    ...mapActions("news", ["fetchNews"]),

    showLoginPrompt() {
      const modalElement = this.$refs.loginPrompt;
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    },
    goToLoginAndCloseModal() {
      const modalElement = this.$refs.loginPrompt;
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
      this.$router.push("/auth");
    },
  },
  mounted() {
    this.fetchCourses();
    this.fetchNews();
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>
