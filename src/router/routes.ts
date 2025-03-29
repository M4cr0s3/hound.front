import type {RouteRecordRaw} from "vue-router";

export const ROUTES = {
  INDEX: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  CREATE_TEAM: '/teams/create',
}

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTES.INDEX,
    component: () => import('../pages/Index.vue'),
  },
  {
    path: ROUTES.LOGIN,
    component: () => import('../pages/Login.vue'),
    meta: {
      guestOnly: true
    }
  },
  {
    path: ROUTES.DASHBOARD,
    component: () => import('../pages/Dashboard.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: ROUTES.TEAMS,
    component: () => import('../pages/Teams.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: ROUTES.CREATE_TEAM,
    component: () => import('../pages/CreateTeam.vue'),
    meta: {
      requiresAuth: true
    }
  }
];