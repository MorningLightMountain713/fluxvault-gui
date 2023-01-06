import Vue from "vue";
import VueRouter from "vue-router";
import AgentsView from "../views/AgentsView.vue";
import AgentsGlobalView from "../views/AgentsGlobalView.vue";
import Overview from "../views/Overview.vue";
import TerminalView from "../views/TerminalView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Overview",
    component: Overview,
    meta: {
      icon: "mdi-home",
      hidden: false,
    },
  },
  {
    path: "/agents",
    name: "AgentsGlobal",
    component: AgentsGlobalView,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/agents/:agent",
    name: "Agents",
    component: AgentsView,
    meta: {
      icon: "mdi-file-tree",
    },
  },
  {
    path: "/terminal",
    name: "Terminal",
    component: TerminalView,
    meta: {
      icon: "mdi-console",
    },
  },
  {
    path: "/keeper",
    name: "Keeper",
    meta: {
      icon: "mdi-information",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(
        /* webpackChunkName: "about" */ "../views/KeeperView.vue"
      );
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
