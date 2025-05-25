import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";
import Courses from "../views/Courses.vue";
import CourseDetails from "../views/CourseDetail.vue";
import News from "../views/News.vue";
import Auth from "../views/Auth.vue";
import AboutUs from "../views/AboutUs.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/courses", component: Courses },
  { path: "/courses/:id", component: CourseDetails, props: true },
  { path: "/news", component: News },
  { path: "/auth", component: Auth },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {path: "/about-us", component: AboutUs },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters["auth/isLoggedIn"];
  if (to.meta.requiresAuth && !isLoggedIn) {
    next("/auth");
  } else {
    next();
  }
});

export default router;
