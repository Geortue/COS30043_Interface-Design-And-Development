import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import "./assets/bootstrap.min.css";
import "./assets/bootstrap.bundle.min.js";

const app = createApp(App);

app.use(router);

app.mount("#app");
