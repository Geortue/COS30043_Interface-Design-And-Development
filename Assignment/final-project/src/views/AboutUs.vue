<template>
  <div class="page-container">
    <div class="container py-5">
      <h2 class="mb-4">About Learniverse</h2>

      <!-- Description -->
      <p>
        <strong>Learniverse</strong> is an interactive online learning platform
        designed to connect students and educators. Whether you're a beginner
        looking to explore new skills or an instructor ready to share your
        expertise, Learniverse helps you reach your goals through rich content,
        flexible courses, and a vibrant community.
      </p>

      <!-- Name Input Section -->
      <div class="row mt-4">
        <div class="col-md-6">
          <h5 class="mb-3">Tell us your name:</h5>
          <input
            v-model="firstName"
            class="form-control mb-2"
            placeholder="First Name"
          />
          <input
            v-model="lastName"
            class="form-control"
            placeholder="Last Name"
          />
          <p v-if="firstName || lastName" class="mt-3 fw-semibold">
            👋 Welcome, {{ fullName }}!
          </p>
        </div>

        <!-- Image Selector Section -->
        <div class="col-md-6">
          <h5 class="mb-3">Choose your inspiration:</h5>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              value="mountain"
              v-model="selectedTheme"
              id="mountain"
            />
            <label class="form-check-label" for="mountain">Mountain</label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              value="ocean"
              v-model="selectedTheme"
              id="ocean"
            />
            <label class="form-check-label" for="ocean">Ocean</label>
          </div>

          <!-- Image Display -->
          <div class="mt-3">
            <img
              v-if="selectedTheme === 'mountain'"
              src="https://images.unsplash.com/photo-1508264165352-258db2ebd59b?auto=format&fit=crop&w=700&q=80"
              alt="Mountain"
              class="img-fluid rounded shadow"
            />
            <img
              v-if="selectedTheme === 'ocean'"
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80"
              alt="Ocean"
              class="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutUs",
  data() {
    return {
      firstName: "",
      lastName: "",
      selectedTheme: "",
    };
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`.trim();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
img {
  max-width: 100%;
  height: auto;
}
</style>
