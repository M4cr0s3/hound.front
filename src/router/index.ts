import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./routes.ts";
import {authMiddleware} from "./middlewares";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authMiddleware);