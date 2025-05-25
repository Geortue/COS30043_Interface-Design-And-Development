<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">Insight Hire</a>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <button
              class="nav-link btn btn-link text-white"
              @click="scrollTo('job-explorer')"
            >
              Job Explorer
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link btn btn-link text-white"
              @click="scrollTo('application-form')"
            >
              Application Form
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link btn btn-link text-white"
              @click="scrollTo('todo-list')"
            >
              To-Do List
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div id="event_image_container">
    <img src="./assets/event.jpg" alt="Office Desk" class="img-fluid" />
  </div>

  <section id="job-explorer" class="container mt-5">
    <h2 class="mb-4">Job Explorer</h2>
    <div class="row">
      <div class="col-md-3">
        <JobList />
      </div>
      <div class="col-md-9">
        <router-view />
      </div>
    </div>
  </section>

  <section id="application-form" class="container mt-5">
    <h2 class="mb-4">Job Application</h2>
    <ApplicationForm />
  </section>

  <section id="todo-list" class="container mt-5 mb-5">
    <h2 class="mb-4">To-Do List</h2>
    <ToDoList />
  </section>
</template>

<script>
import JobList from "./components/JobList.vue";
import ApplicationForm from "./components/ApplicationForm.vue";
import ToDoList from "./components/ToDoList.vue";

export default {
  components: {
    JobList,
    ApplicationForm,
    ToDoList,
  },
  methods: {
    scrollTo(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    },
  },
};
</script>

<style scoped>
.nav-link:hover {
  color: #ffc107 !important;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

#event_image_container {
  position: relative;
  width: 100%;
  height: 300px;
}
#event_image_container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
