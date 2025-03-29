import type {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {ROUTES} from "../routes.ts";

export const authMiddleware = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (to.meta.guestOnly && isAuthenticated) {
    return next({path: ROUTES.INDEX});
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: ROUTES.LOGIN,
      query: {redirect: to.fullPath}
    });
  }

  next();
};