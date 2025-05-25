import { createRouter, createWebHashHistory } from "vue-router";
import JobOverview from "../components/JobOverview.vue";
import JobDetail from "../components/JobDetail.vue";

const routes = [
  { path: "/", redirect: "/overview" },
  { path: "/overview", component: JobOverview },
  { path: "/job/:id", component: JobDetail, props: true },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return {};
  },
});

export default router;
