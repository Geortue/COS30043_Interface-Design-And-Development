import { createStore } from "vuex";
import auth from "./modules/auth";
import courses from "./modules/courses";
import news from "./modules/news";
import reviews from "./modules/reviews";
import enrolments from "./modules/enrolments";
import unit from "./modules/unit";
import likes from "./modules/likes";

export default createStore({
  modules: {
    auth,
    reviews,
    courses,
    news,
    enrolments,
    unit,
    likes,
  },
});
