<template>
  <div class="container py-4" v-if="course">
    <div class="row">
      <!-- Course Details -->
      <div class="col-md-8">
        <h2 class="mb-3">{{ course.title }}</h2>
        <p><strong>Description:</strong> {{ course.description }}</p>
        <p><strong>Instructor ID:</strong> {{ course.instructor_id }}</p>
        <p><strong>Category:</strong> {{ course.category }}</p>
        <p><strong>Level:</strong> {{ course.difficulty }}</p>
        <p><strong>Likes:</strong> {{ course.likes }}</p>
        <p><strong>Total Enrolments:</strong> {{ totalEnrolments }}</p>

        <!-- Student Controls -->
        <div v-if="isStudent">
          <button
            class="btn me-2"
            :class="isEnrolled ? 'btn-success' : 'btn-outline-success'"
            @click="toggleEnrol"
            :disabled="enrolling"
          >
            {{
              enrolling ? "Processing..." : isEnrolled ? "Enrolled ✓" : "Enroll"
            }}
          </button>

          <button
            class="btn me-2"
            :class="isLiked ? 'btn-danger' : 'btn-outline-danger'"
            @click="toggleLike"
            :disabled="liking"
          >
            ❤️ {{ liking ? "Processing..." : isLiked ? "Unlike" : "Like" }}
          </button>

          <div v-if="feedback" class="alert alert-info mt-2">
            {{ feedback }}
          </div>

          <!-- Review Form -->
          <div class="mt-4">
            <h5>Write a Review</h5>
            <textarea
              v-model="reviewText"
              class="form-control mb-2"
              rows="3"
              placeholder="Share your thoughts about this course..."
            ></textarea>
            <button
              class="btn btn-primary btn-sm"
              @click="submitReview"
              :disabled="!reviewText.trim()"
            >
              {{ editingReviewId ? "Update" : "Submit" }}
            </button>
          </div>
        </div>

        <!-- Instructor View -->
        <div v-if="isInstructor" class="mt-4">
          <h5>Students Enrolled</h5>
          <ul v-if="enrolledStudents && enrolledStudents.length">
            <li v-for="(student, index) in enrolledStudents" :key="index">
              {{ student }}
            </li>
          </ul>
          <p v-else class="text-muted">
            No students enrolled in this course yet.
          </p>
        </div>

        <!-- Reviews -->
        <div class="mt-4">
          <h4>Reviews</h4>
          <div v-if="users.length > 0 && reviews.length">
            <ul class="list-group">
              <li
                v-for="review in reviews"
                :key="review.id"
                class="list-group-item"
              >
                <p class="mb-1">{{ review.review }}</p>
                <small class="text-muted">
                  {{ getReviewerName(review.user_id) }}
                </small>
              </li>
            </ul>
          </div>
          <p v-else class="text-muted">No reviews yet.</p>
        </div>
      </div>

      <!-- Course Units -->
      <div class="col-md-4">
        <h4>Course Units</h4>
        <ul class="list-group">
          <li
            class="list-group-item d-flex align-items-center"
            v-for="unit in units"
            :key="unit.id"
          >
            <span class="text-muted">{{ unit.title }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CourseDetail",
  data() {
    return {
      course: null,
      reviewText: "",
      editingReviewId: null,
      enrolling: false,
      liking: false,
      feedback: "",
      totalEnrolments: 0,
    };
  },
  computed: {
    ...mapGetters("auth", ["user", "users"]),
    ...mapGetters("courses", ["allCourses"]),
    ...mapGetters("enrolments", [
      "enrolledCourses",
      "allEnrolments",
      "completedCourses",
    ]),
    ...mapGetters("reviews", ["reviewsByCourse"]),
    ...mapGetters("unit", ["unitsByCourse"]),

    isStudent() {
      return this.user?.role === "student";
    },
    isInstructor() {
      return this.user?.role === "instructor";
    },
    isEnrolled() {
      return this.enrolledCourses?.some((e) => e.course_id == this.course.id);
    },
    isLiked() {
      return this.$store.getters["likes/isCourseLiked"](this.course?.id);
    },
    reviews() {
      return this.reviewsByCourse(this.course.id) || [];
    },
    units() {
      return this.unitsByCourse(this.course.id) || [];
    },
    enrolledStudents() {
      if (!this.course || !this.users.length || !this.allEnrolments?.length)
        return [];
      return this.allEnrolments
        .filter((e) => e.course_id == this.course.id)
        .map((e) => {
          const u = this.users.find((user) => user.id == e.user_id);
          return u ? `${u.first_name} ${u.last_name}` : "Unknown";
        });
    },
  },
  methods: {
    ...mapActions("auth", ["fetchUsers"]),
    ...mapActions("courses", ["fetchCourses"]),
    ...mapActions("enrolments", [
      "fetchEnrolments",
      "fetchAllEnrolments",
      "enrolCourse",
      "unenrolCourse",
      "getTotalEnrolments",
    ]),
    ...mapActions("reviews", ["fetchReviews", "addReview"]),
    ...mapActions("unit", ["fetchUnits"]),
    ...mapActions("likes", ["likeCourse", "unlikeCourse", "checkIfLiked"]),

    getReviewerName(userId) {
      const user = this.users?.find((u) => u.id == userId);
      return user ? `${user.first_name} ${user.last_name}` : "Anonymous";
    },

    async toggleEnrol() {
      this.enrolling = true;
      try {
        if (this.isEnrolled) {
          await this.unenrolCourse({
            userId: this.user.id,
            courseId: this.course.id,
          });
          this.feedback = "Enrollment cancelled.";
        } else {
          await this.enrolCourse({
            userId: this.user.id,
            courseId: this.course.id,
          });
          this.feedback = "Successfully enrolled.";
        }
        await this.fetchEnrolments(this.user.id);
        this.totalEnrolments = await this.getTotalEnrolments(this.course.id);
      } catch {
        this.feedback = "Error processing enrollment.";
      } finally {
        this.enrolling = false;
        setTimeout(() => (this.feedback = ""), 3000);
      }
    },

    async toggleLike() {
      this.liking = true;
      const payload = { userId: this.user.id, courseId: this.course.id };
      try {
        if (this.isLiked) {
          await this.unlikeCourse(payload);
          this.feedback = "You unliked the course.";
        } else {
          await this.likeCourse(payload);
          this.feedback = "You liked the course!";
        }
        await this.fetchCourses();
        this.course = this.allCourses.find((c) => c.id === this.course.id);
      } catch {
        this.feedback = "There was a problem updating your like.";
      } finally {
        this.liking = false;
        setTimeout(() => (this.feedback = ""), 3000);
      }
    },

    async submitReview() {
      try {
        await this.addReview({
          course_id: this.course.id,
          user_id: this.user.id,
          review: this.reviewText.trim(),
        });
        this.reviewText = "";
        this.feedback = "Review submitted!";
        setTimeout(() => (this.feedback = ""), 3000);
      } catch {
        this.feedback = "Failed to submit review.";
      }
    },
  },
  async mounted() {
    const courseId = parseInt(this.$route.params.id);

    // Load all courses and locate the current one
    await this.fetchCourses();
    this.course = this.allCourses.find((c) => c.id == courseId);
    if (!this.course) return;

    // Fetch all relevant data
    await Promise.all([
      this.fetchUnits(courseId),
      this.fetchReviews(),
      this.fetchUsers(),
    ]);

    // For students only: check like status and enrolments
    if (this.user?.role === "student") {
      await this.fetchEnrolments(this.user.id);
      await this.checkIfLiked({ userId: this.user.id, courseId });
    }

    if (this.user?.role === "instructor") {
      await this.fetchAllEnrolments(); // ✅ fetch all enrolments
    }

    // Get total enrolments (for all users)
    try {
      const total = await this.getTotalEnrolments(courseId);
      this.totalEnrolments = total;
    } catch (e) {
      console.error("Failed to fetch total enrolments:", e);
      this.totalEnrolments = 0;
    }
  },
};
</script>

<style scoped>
.container {
  background-color: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

h2,
h4,
h5 {
  font-weight: 600;
}

p {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.badge {
  margin-left: 8px;
  font-size: 0.8rem;
  padding: 0.4em 0.6em;
  border-radius: 0.6rem;
}

.alert {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.btn {
  min-width: 100px;
  transition: all 0.2s ease-in-out;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.btn-link {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}

.list-group-item {
  border: none;
  border-bottom: 1px solid #e9ecef;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s ease;
}

.list-group-item:hover {
  background-color: #f1f3f5;
}

textarea.form-control {
  border-radius: 0.5rem;
}

.modal-content {
  border-radius: 1rem;
}

.modal-header,
.modal-footer {
  border: none;
}

.modal-title {
  font-weight: 600;
}

.unit-title {
  font-weight: 500;
  font-size: 1rem;
}

.enrolled-list {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.review-meta {
  font-size: 0.8rem;
  color: #6c757d;
}
</style>
