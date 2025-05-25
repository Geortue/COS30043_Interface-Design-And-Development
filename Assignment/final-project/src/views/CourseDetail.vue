<template>
  <v-container class="py-4" v-if="course">
    <v-row>
      <v-col cols="12" md="8">
        <h2 class="mb-3">{{ course.title }}</h2>
        <p><strong>Description:</strong> {{ course.description }}</p>
        <p><strong>Instructor ID:</strong> {{ course.instructor_id }}</p>
        <p><strong>Category:</strong> {{ course.category }}</p>
        <p><strong>Level:</strong> {{ course.difficulty }}</p>
        <p><strong>Likes:</strong> {{ course.likes }}</p>
        <p><strong>Total Enrolments:</strong> {{ totalEnrolments }}</p>

        <!-- Student Controls -->
        <div v-if="isStudent">
          <v-btn
            :color="isEnrolled ? 'success' : 'primary'"
            class="me-2"
            @click="toggleEnrol"
            :loading="enrolling"
          >
            {{ isEnrolled ? "Enrolled ✓" : "Enroll" }}
          </v-btn>

          <v-btn
            :color="isLiked ? 'error' : 'pink-lighten-1'"
            class="me-2"
            @click="toggleLike"
            :loading="liking"
          >
            ❤️ {{ isLiked ? "Unlike" : "Like" }}
          </v-btn>

          <v-alert v-if="feedback" type="info" class="mt-2">
            {{ feedback }}
          </v-alert>

          <!-- Progress Tracking -->
          <div class="mt-4">
            <h5>Progress</h5>
            <v-progress-linear
              :model-value="progressPercent"
              height="20"
              color="green"
              class="mb-3"
              rounded
            >
              <template #default>{{ progressPercent }}%</template>
            </v-progress-linear>

            <div v-for="unit in units" :key="unit.id" class="unit-checkbox">
              <v-checkbox
                v-model="completedMap[unit.id]"
                :label="unit.title"
                hide-details
                density="comfortable"
                class="d-block"
                @change="() => handleCheckbox(unit.id)"
              />
            </div>
          </div>

          <!-- Review Section -->
          <div class="mt-4">
            <h5>Write a Review</h5>
            <v-textarea
              v-model="reviewText"
              label="Share your thoughts about this course..."
              rows="3"
              class="mb-2"
              auto-grow
            />
            <v-btn
              color="primary"
              @click="submitReview"
              :disabled="!reviewText.trim()"
              size="small"
            >
              {{ editingReviewId ? "Update" : "Submit" }}
            </v-btn>
          </div>
        </div>

        <!-- Instructor View -->
        <div v-else-if="isInstructor">
          <h5 class="mt-4">Students Enrolled</h5>
          <v-list v-if="enrolledStudents.length">
            <v-list-item
              v-for="(student, index) in enrolledStudents"
              :key="index"
            >
              <v-list-item-title>{{ student }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <p v-else class="text-muted">
            No students enrolled in this course yet.
          </p>
        </div>

        <!-- Review List -->
        <div class="mt-4">
          <h4>Reviews</h4>
          <div v-if="users.length && reviews.length">
            <v-list>
              <v-list-item v-for="review in reviews" :key="review.id">
                <v-list-item-content>
                  <v-list-item-title class="mb-1">
                    {{ review.review }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-muted">
                    {{ getReviewerName(review.user_id) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="user && review.user_id == user.id">
                  <v-btn
                    variant="text"
                    size="small"
                    @click="editReview(review)"
                  >
                    Edit
                  </v-btn>
                  <v-btn
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDelete(review.id)"
                  >
                    Delete
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </div>
          <p v-else class="text-muted">No reviews yet.</p>
        </div>

        <!-- Delete Confirmation Modal -->
        <v-dialog v-model="showDeleteModal" max-width="400">
          <v-card>
            <v-card-title>Confirm Deletion</v-card-title>
            <v-card-text>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="removeReviewConfirmed"
                >Yes, delete it</v-btn
              >
              <v-btn color="secondary" @click="showDeleteModal = false"
                >Cancel</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "CourseDetail",
  data() {
    return {
      course: null,
      enrolling: false,
      liking: false,
      feedback: "",
      totalEnrolments: 0,
      reviewText: "",
      editingReviewId: null,
      showDeleteModal: false,
      deleteReviewId: null,
      completedMap: {},
    };
  },
  computed: {
    ...mapGetters("auth", ["user", "users"]),
    ...mapGetters("courses", ["allCourses"]),
    ...mapGetters("enrolments", [
      "enrolledCourses",
      "completedCourses",
      "allEnrolments",
    ]),
    ...mapGetters("reviews", ["reviewsByCourse"]),
    ...mapGetters("unit", ["unitsByCourse"]),
    ...mapGetters("likes", ["isCourseLiked"]),
    ...mapGetters("progress", ["unitProgressByCourse"]),

    isStudent() {
      return this.user?.role === "student";
    },
    isInstructor() {
      return this.user?.role === "instructor";
    },
    isEnrolled() {
      return this.enrolledCourses.some((e) => e.course_id == this.course.id);
    },
    isLiked() {
      return this.isCourseLiked(this.course.id);
    },
    reviews() {
      return this.reviewsByCourse(this.course.id) || [];
    },
    units() {
      return this.unitsByCourse(this.course.id) || [];
    },
    enrolledStudents() {
      return this.allEnrolments
        .filter((e) => e.course_id == this.course.id)
        .map((e) => {
          const u = this.users.find((user) => user.id == e.user_id);
          return u ? `${u.first_name} ${u.last_name}` : "Unknown";
        });
    },
    progressPercent() {
      const total = this.units.length;
      const completed = Object.values(this.completedMap).filter(Boolean).length;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
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
    ...mapActions("reviews", [
      "fetchReviews",
      "addReview",
      "updateReview",
      "deleteReview",
    ]),
    ...mapActions("unit", ["fetchUnits"]),
    ...mapActions("likes", ["likeCourse", "unlikeCourse", "checkIfLiked"]),
    ...mapActions("progress", [
      "fetchProgress",
      "markUnitComplete",
      "unmarkUnitComplete",
    ]),

    getReviewerName(userId) {
      const user = this.users?.find((u) => u.id == userId);
      return user ? `${user.first_name} ${user.last_name}` : "Anonymous";
    },

    async toggleEnrol() {
      this.enrolling = true;
      try {
        const payload = { userId: this.user.id, courseId: this.course.id };
        if (this.isEnrolled) {
          await this.unenrolCourse(payload);
          this.feedback = "Enrollment cancelled.";
        } else {
          await this.enrolCourse(payload);
          this.feedback = "Successfully enrolled.";
        }
        await this.fetchEnrolments(this.user.id);
        this.totalEnrolments = await this.getTotalEnrolments(this.course.id);
      } catch (e) {
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
      } catch (e) {
        this.feedback = "There was a problem updating your like.";
      } finally {
        this.liking = false;
        setTimeout(() => (this.feedback = ""), 3000);
      }
    },

    async submitReview() {
      try {
        const payload = {
          course_id: this.course.id,
          user_id: this.user.id,
          review: this.reviewText.trim(),
        };
        if (this.editingReviewId) {
          await this.updateReview({ id: this.editingReviewId, ...payload });
          this.feedback = "Review updated!";
        } else {
          await this.addReview(payload);
          this.feedback = "Review submitted!";
        }
        this.reviewText = "";
        this.editingReviewId = null;
        setTimeout(() => (this.feedback = ""), 3000);
      } catch {
        this.feedback = "Failed to submit review.";
      }
    },

    editReview(review) {
      this.reviewText = review.review;
      this.editingReviewId = review.id;
    },

    confirmDelete(id) {
      this.deleteReviewId = id;
      this.showDeleteModal = true;
    },

    async removeReviewConfirmed() {
      try {
        await this.deleteReview(this.deleteReviewId);
        this.feedback = "Review deleted.";
        this.showDeleteModal = false;
        setTimeout(() => (this.feedback = ""), 3000);
      } catch {
        this.feedback = "Failed to delete review.";
      }
    },

    async handleUnitToggle() {
      const currentProgress = this.unitProgressByCourse(this.course.id).map(
        (p) => Number(p.unit_id)
      );
      const toAdd = this.completedUnitIds.filter(
        (id) => !currentProgress.includes(id)
      );
      const toRemove = currentProgress.filter(
        (id) => !this.completedUnitIds.includes(id)
      );

      const actions = [];
      for (const id of toAdd) {
        actions.push(
          this.markUnitComplete({
            user_id: this.user.id,
            course_id: this.course.id,
            unit_id: id,
          })
        );
      }
      for (const id of toRemove) {
        actions.push(
          this.unmarkUnitComplete({
            user_id: this.user.id,
            course_id: this.course.id,
            unit_id: id,
          })
        );
      }

      await Promise.all(actions);
      await this.fetchProgress(this.user.id);
      const progress = this.unitProgressByCourse(this.course.id);
      this.completedUnitIds = progress
        ? progress.map((p) => Number(p.unit_id))
        : [];

      if (this.completedUnitIds.length === this.units.length) {
        await this.fetchEnrolments(this.user.id);
      }
    },

    async handleCheckbox(unitId) {
      const isChecked = this.completedMap[unitId];
      const payload = {
        user_id: this.user.id,
        course_id: this.course.id,
        unit_id: unitId,
      };

      try {
        if (isChecked) {
          await this.markUnitComplete(payload);
        } else {
          await this.unmarkUnitComplete(payload);
        }

        // Update from backend to stay in sync
        await this.fetchProgress(this.user.id);
        const progress = this.unitProgressByCourse(this.course.id);
        this.completedMap = {};
        progress.forEach((p) => {
          this.completedMap[p.unit_id] = true;
        });

        // Update completed status in enrolments
        if (Object.keys(this.completedMap).length === this.units.length) {
          await this.fetchEnrolments(this.user.id);
        }
      } catch (e) {
        console.error("Error updating unit progress:", e);
      }
    },
  },

  async mounted() {
    const courseId = parseInt(this.$route.params.id);
    await this.$store.dispatch("courses/fetchCourses", {
      page: 1,
      limit: 1000,
    });
    this.course = this.$store.getters["courses/getCourseById"](courseId);
    if (!this.course) return;

    await Promise.all([
      this.fetchUnits(courseId),
      this.fetchReviews(),
      this.fetchUsers(),
    ]);

    if (this.user) {
      await this.fetchEnrolments(this.user.id);
      await this.checkIfLiked({ userId: this.user.id, courseId });
      await this.fetchProgress(this.user.id);
      const progress = this.unitProgressByCourse(courseId);
      this.completedMap = {};
      progress.forEach((p) => {
        this.completedMap[p.unit_id] = true;
      });
    }

    this.totalEnrolments = await this.getTotalEnrolments(courseId);
    await this.fetchAllEnrolments();
  },
};
</script>

<style scoped>
.v-container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

h2,
h4,
h5 {
  font-weight: 600;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.v-btn {
  min-width: 120px;
  margin-right: 8px;
}

.v-textarea {
  max-width: 100%;
}

.text-muted {
  color: #6c757d;
  font-size: 0.9rem;
}

.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 1rem;
}
</style>
