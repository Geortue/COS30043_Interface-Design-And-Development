<template>
  <div class="container py-4">
    <h2 class="mb-4">Dashboard</h2>

    <!-- Student View -->
    <div v-if="isStudent">
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card text-white bg-primary mb-3">
            <div class="card-body">
              <h5 class="card-title">Courses Enrolled</h5>
              <p class="card-text fs-4">{{ enrolledCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card text-white bg-success mb-3">
            <div class="card-body">
              <h5 class="card-title">Courses Completed</h5>
              <p class="card-text fs-4">{{ completedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <h4 class="mt-4">Liked Courses</h4>
      <div class="row" v-if="likedCourses.length">
        <div
          class="col-md-6 mb-3"
          v-for="course in likedCourses"
          :key="course.id"
        >
          <div class="card border-danger">
            <div class="card-body">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text">{{ course.description }}</p>
              <router-link
                :to="`/courses/${course.id}`"
                class="btn btn-sm btn-outline-danger"
                >View</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">You haven't liked any courses yet.</p>

      <h4 class="mt-4">Completed Courses</h4>
      <div class="row" v-if="completedCourseList.length">
        <div
          class="col-md-6 mb-3"
          v-for="course in completedCourseList"
          :key="course.id"
        >
          <div class="card border-success">
            <div class="card-body">
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text">{{ course.description }}</p>
              <router-link
                :to="`/courses/${course.id}`"
                class="btn btn-sm btn-outline-success"
                >Review</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">No completed courses yet.</p>
    </div>

    <!-- Instructor View -->
    <div v-else-if="isInstructor">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Your Courses</h4>
        <button class="btn btn-primary btn-sm" @click="openCreateModal">
          + New Course
        </button>
      </div>

      <div v-if="instructorCourses.length">
        <div
          class="card mb-3"
          v-for="course in instructorCourses"
          :key="course.id"
        >
          <div
            class="card-body d-flex justify-content-between align-items-start"
          >
            <div>
              <h5 class="card-title">{{ course.title }}</h5>
              <p class="card-text text-muted">{{ course.description }}</p>
            </div>
            <div>
              <button
                class="btn btn-sm btn-outline-info me-2"
                @click="openEditModal(course)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="removeCourse(course.id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-muted">You haven't created any courses yet.</p>
    </div>
    <!-- Course Edit/Create Modal -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingCourse ? "Edit Course" : "New Course" }}
            </h5>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Title</label>
              <input
                type="text"
                class="form-control"
                v-model="courseForm.title"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">Description</label>
              <textarea
                class="form-control"
                v-model="courseForm.description"
                rows="3"
              ></textarea>
            </div>
            <div class="mb-2">
              <label class="form-label">Category</label>
              <input
                type="text"
                class="form-control"
                v-model="courseForm.category"
              />
            </div>
            <div class="mb-2">
              <label class="form-label">Difficulty</label>
              <select class="form-select" v-model="courseForm.difficulty">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">
              Cancel
            </button>
            <button class="btn btn-primary" @click="saveCourse">
              {{ editingCourse ? "Update" : "Create" }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isStudent && !isInstructor">
      <p class="text-muted">No dashboard data available.</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      showModal: false,
      editingCourse: null,
      courseForm: {
        title: "",
        description: "",
        category: "",
        difficulty: "",
      },
    };
  },
  computed: {
    ...mapGetters("auth", ["user"]),
    ...mapGetters("courses", ["allCourses"]),
    ...mapGetters("enrolments", ["enrolledCourses", "completedCourses"]),
    ...mapGetters("likes", ["likedCourseIds"]),

    isStudent() {
      return this.user?.role === "student";
    },
    isInstructor() {
      return this.user?.role === "instructor";
    },
    enrolledCount() {
      return this.enrolledCourses?.length || 0;
    },
    completedCount() {
      return this.completedCourses?.length || 0;
    },
    likedCourses() {
      return this.allCourses.filter((c) =>
        this.likedCourseIds.includes(Number(c.id))
      );
    },
    completedCourseList() {
      return this.allCourses.filter((c) =>
        this.completedCourses.some((e) => e.course_id == c.id)
      );
    },
    instructorCourses() {
      return this.allCourses.filter((c) => c.instructor_id == this.user?.id);
    },
  },
  methods: {
    ...mapActions("courses", [
      "fetchCourses",
      "createCourse",
      "updateCourse",
      "deleteCourse",
    ]),
    ...mapActions("enrolments", ["fetchEnrolments"]),
    ...mapActions("likes", ["fetchUserLikes"]),

    openCreateModal() {
      this.editingCourse = null;
      this.courseForm = {
        title: "",
        description: "",
        category: "",
        difficulty: "",
      };
      this.showModal = true;
    },
    openEditModal(course) {
      this.editingCourse = course;
      this.courseForm = {
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
      };
      this.showModal = true;
    },
    async saveCourse() {
      try {
        if (this.editingCourse) {
          await this.updateCourse({
            id: this.editingCourse.id,
            instructor_id: this.user.id,
            ...this.courseForm,
          });
        } else {
          await this.createCourse({
            instructor_id: this.user.id,
            ...this.courseForm,
          });
        }
        await this.fetchCourses();
        this.showModal = false;
        this.editingCourse = null;
      } catch (e) {
        console.error("Error saving course:", e);
      }
    },
    async removeCourse(courseId) {
      try {
        if (confirm("Are you sure you want to delete this course?")) {
          await this.deleteCourse(courseId);
          await this.fetchCourses();
        }
      } catch (e) {
        console.error("Error deleting course:", e);
      }
    },
  },
  async mounted() {
    await this.fetchCourses();
    if (this.user?.role === "student") {
      await this.fetchEnrolments(this.user.id);
      await this.fetchUserLikes(this.user.id);
    }
  },
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card {
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.badge {
  margin-right: 0.5rem;
}

.modal .form-label {
  font-weight: 500;
}

.modal-content {
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

button + button {
  margin-left: 8px;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #eee;
  padding: 0.75rem 1rem;
}

.list-group-item:last-child {
  border-bottom: none;
}

.section-title {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.25rem;
}
</style>
