<template>
  <div>
    <ul class="list-group">
      <li class="list-group-item">
        <router-link to="/overview">Overview</router-link>
      </li>
      <li v-for="job in jobs" :key="job.job_id" class="list-group-item">
        <router-link :to="`/job/${job.job_id}`">{{ job.job_id }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { jobs } from "../data/jobs.js";

export default {
  data() {
    return {
      jobs,
    };
  },
};
</script>

<style scoped>
.list-group-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

.list-group-item:hover {
  background-color: #f8f9fa;
}

.list-group-item a {
  text-decoration: none;
}

.list-group-item a:hover {
  text-decoration: underline;
}
</style>
