import Vue from "vue";
import Router from "vue-router";

import CheckAuth from "./auth-check";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: require("@/contents/Auth/Login").default,
      meta: {
        auth: true,
      },
    },
    {
      path: "/",
      name: "Home",
      redirect: "/logins",
      component: require("@/contents/Home/index").default,
      children: [
        {
          path: "/logins",
          name: "Logins",
          component: require("@/contents/Logins/index").default,
          children: [
            {
              path: "create",
              name: "LoginCreate",
              component: require("@/contents/Logins/Create").default,
            },
            {
              path: ":id",
              name: "LoginDetail",
              component: require("@/contents/Logins/Detail").default,
            },
          ],
        },
      ],
    },
    {
      path: "/servers",
      name: "Servers",
      component: require("@/contents/Servers/index").default,
      children: [
        {
          path: "create",
          name: "ServerCreate",
          component: require("@/contents/Servers/Create").default,
        },
        {
          path: ":id",
          name: "ServerDetail",
          component: require("@/contents/Servers/Detail").default,
        },
      ],
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});

router.beforeEach(CheckAuth);

export default router;
