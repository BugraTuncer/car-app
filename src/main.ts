import { createApp } from "vue";
import App from "./App.vue";
import router from "./app/router";
import store from "./app/store";
import "./style.css";

const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error("Global Error Handler:", {
    error: err,
    component: instance,
    info,
  });
};

app.config.warnHandler = (msg, _instance, trace) => {
  console.warn("Vue Warning:", msg, trace);
};

app.use(router).use(store).mount("#app");
