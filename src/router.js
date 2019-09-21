import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import login from "./views/login"
import base from "./router/base";
import test from "./router/test";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/home",
      component: Home,
      children: [
          ...base,
          ...test
      ]
    },
    {
      path: "/",
      name: "login",
      component: login,
      component: () =>
        import("./views/login.vue")
    },
    {
      path: "/login",
      name: "login",
      component: login,
      component: () =>
        import("./views/login.vue")
    }
  ]
});
