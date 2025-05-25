import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import store from "./store"; 
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap; 

const app = createApp(App);

app.use(store); 
app.use(router);

app.mount("#app");
