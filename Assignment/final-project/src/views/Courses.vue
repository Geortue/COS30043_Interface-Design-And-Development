<template>
  <div class="page-container">
    <div class="container py-4">
      <h2 class="mb-4">Browse Courses</h2>

      <div class="row mb-3">
        <div class="col-md-4 mb-2">
          <input
            v-model="filters.search"
            class="form-control"
            placeholder="Search..."
          />
        </div>
        <div class="col-md-3 mb-2">
          <select v-model="filters.category" class="form-select">
            <option value="">All Categories</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
        <div class="col-md-3 mb-2">
          <select v-model="filters.difficulty" class="form-select">
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div class="col-md-2 mb-2">
          <button class="btn btn-outline-secondary w-100" @click="clearFilters">
            Clear
          </button>
        </div>
      </div>

      <div
        class="d-flex justify-content-between align-items-center mb-3"
        v-if="filtersApplied"
      >
        <div class="text-primary">
          Showing filtered results ({{ filteredCourses.length }})
        </div>
      </div>

      <div class="row">
        <div
          v-for="course in paginatedCourses"
          :key="course.id"
          class="col-md-6 mb-4"
        >
          <BaseCard>
            <h5>{{ course.title }}</h5>
            <p>{{ course.description }}</p>
            <p>
              <strong>Instructor:</strong>
              {{ getInstructorName(course.instructor_id) || "Unknown" }}
            </p>
            <p><strong>Level:</strong> {{ course.difficulty }}</p>
            <p><strong>Category:</strong> {{ course.category }}</p>

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

            <div
              v-if="user?.role === 'student'"
              class="mt-2 d-flex flex-wrap gap-2"
            >
              <span
                v-if="isCourseLiked(course.id)"
                class="badge bg-danger"
                title="You liked this course"
              >
                Liked
              </span>
              <span
                v-if="isEnrolled(course.id)"
                class="badge bg-success"
                title="You are enrolled in this course"
              >
                Enrolled
              </span>
              <span v-if="isCompleted(course.id)" class="badge bg-info me-2"
                >Completed</span
              >
            </div>
          </BaseCard>
        </div>
      </div>

      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @prev="prevPage"
        @next="nextPage"
        @goToPage="goToPage"
      />

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
    </div>
  </div>
</template>

<script>
import BaseCard from "../components/BaseCard.vue";
import Pagination from "../components/Pagination.vue";
import { mapGetters, mapActions } from "vuex";
import * as bootstrap from "bootstrap";

export default {
  name: "Courses",
  components: { BaseCard, Pagination },
  data() {
    return {
      filters: {
        search: "",
        category: "",
        difficulty: "",
      },
      currentPage: 1,
      pageSize: 4,
    };
  },
  computed: {
    ...mapGetters("courses", ["allCourses"]),
    ...mapGetters("auth", ["user", "users"]),
    ...mapGetters("enrolments", ["enrolledCourses", "completedCourses"]),
    ...mapGetters("likes", ["isCourseLiked"]),

    uniqueCategories() {
      return [...new Set(this.allCourses.map((c) => c.category))];
    },

    filteredCourses() {
      return this.allCourses.filter((course) => {
        const searchMatch = Object.values(course)
          .join(" ")
          .toLowerCase()
          .includes(this.filters.search.toLowerCase());
        const categoryMatch = this.filters.category
          ? course.category === this.filters.category
          : true;
        const levelMatch = this.filters.difficulty
          ? course.difficulty === this.filters.difficulty
          : true;
        return searchMatch && categoryMatch && levelMatch;
      });
    },

    paginatedCourses() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredCourses.slice(start, start + this.pageSize);
    },

    totalPages() {
      return Math.ceil(this.filteredCourses.length / this.pageSize);
    },

    filtersApplied() {
      return (
        this.filters.search || this.filters.category || this.filters.difficulty
      );
    },
  },
  methods: {
    ...mapActions("auth", ["fetchUsers"]),
    ...mapActions("courses", ["fetchCourses"]),
    ...mapActions("enrolments", ["fetchEnrolments"]),
    ...mapActions("likes", ["fetchUserLikes"]),

    getInstructorName(instructorId) {
      const instructor = this.users?.find((u) => u.id == instructorId);
      return instructor
        ? `${instructor.first_name} ${instructor.last_name}`
        : "Unknown";
    },
    isCompleted(courseId) {
      return (
        Array.isArray(this.completedCourses) &&
        this.completedCourses.some((e) => e.course_id == courseId)
      );
    },
    isEnrolled(courseId) {
      return Array.isArray(this.enrolledCourses)
        ? this.enrolledCourses.some((e) => e.course_id == courseId)
        : false;
    },
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
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    clearFilters() {
      this.filters = {
        search: "",
        category: "",
        difficulty: "",
      };
    },
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1;
      },
    },
  },
  async mounted() {
    try {
      await Promise.all([this.fetchCourses(), this.fetchUsers()]);

      if (this.user?.role === "student") {
        await this.fetchUserLikes(this.user.id);
        await this.fetchEnrolments(this.user.id);
      }
    } catch (error) {
      console.error("Error during mounted lifecycle in Courses.vue:", error);
    }
  },
};
</script>

<style scoped>
button {
  margin-right: 5px;
}
.badge {
  margin-top: 8px;
  display: inline;
}
.modal-content {
  border-radius: 1rem;
}
</style>
