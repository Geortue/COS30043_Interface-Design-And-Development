<template>
  <div v-if="job">
    <h2>{{ job.job_title }}</h2>
    <p><strong>Company:</strong> {{ job.company }}</p>
    <p><strong>Category:</strong> {{ job.category }}</p>
    <p><strong>Location:</strong> {{ job.location }}</p>
    <p><strong>Type:</strong> {{ job.employment_type }}</p>
    <p><strong>Salary:</strong> {{ job.salary_range }}</p>
    <p><strong>Level:</strong> {{ job.job_level }}</p>
    <p>
      <strong>Required Skills:</strong> {{ job.required_skills.join(", ") }}
    </p>
    <p>
      <strong>Preferred Qualifications:</strong>
      {{ job.preferred_qualifications.join(", ") }}
    </p>
    <p><strong>Description:</strong> {{ job.job_description }}</p>
    <p><strong>Supervisor:</strong> {{ job.supervisor }}</p>
    <p><strong>Deadline:</strong> {{ job.application_deadline }}</p>
    <p><strong>Start Date:</strong> {{ job.start_date }}</p>
  </div>
  <div v-else>
    <p>Job not found.</p>
  </div>
</template>

<script>
import { jobs } from "../data/jobs.js";

export default {
  props: ["id"],
  computed: {
    job() {
      return jobs.find((j) => j.job_id === this.id);
    },
  },
};
</script>
