import type { RouteRecordRaw } from 'vue-router';

export const ROUTES = {
  INDEX: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/:pathMatch(.*)*',
  TEAM: {
    INDEX: '/teams',
    CREATE: '/teams/create',
    EDIT: '/teams/:slug/edit',
    SHOW: '/teams/:slug'
  },
  PROJECT: {
    INDEX: '/projects',
    CREATE: '/projects/create',
    EVENTS: '/projects/:slug/events',
    ISSUES: '/projects/:slug/issues',
    SHOW: '/projects/:slug',
    SETTINGS: '/projects/:slug/settings',
  },
  ISSUE: {
    INDEX: '/issues',
    SHOW: '/issues/:id',
    CREATE: '/projects/:slug/issues/create',
  },
  USER: {
    INDEX: '/users',
    CREATE: '/users/create',
    PROFILE: '/profile',
  },
  EVENT: {
    SHOW: '/events/:id',
  },
  INVITE: '/invite/:token',
};

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTES.INDEX,
    component: () => import('../pages/Index.vue'),
  },
  {
    path: ROUTES.LOGIN,
    component: () => import('../pages/Login.vue'),
    meta: {guestOnly: true},
  },
  {
    path: ROUTES.DASHBOARD,
    component: () => import('../pages/Dashboard.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.TEAM.INDEX,
    component: () => import('../pages/team/Index.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.TEAM.SHOW,
    component: () => import('../pages/team/Show.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.TEAM.CREATE,
    component: () => import('../pages/team/Create.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.TEAM.EDIT,
    component: () => import('../pages/team/Edit.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.PROJECT.INDEX,
    component: () => import('../pages/project/Index.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.PROJECT.SHOW,
    component: () => import('../pages/project/Show.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: ROUTES.PROJECT.CREATE,
    component: () => import('../pages/project/Create.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.PROJECT.EVENTS,
    component: () => import('../pages/project/events/Events.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.ISSUE.INDEX,
    component: () => import('../pages/issue/Index.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.ISSUE.SHOW,
    component: () => import('../pages/issue/Show.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.USER.INDEX,
    component: () => import('../pages/user/Index.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.USER.CREATE,
    component: () => import('../pages/user/Create.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.USER.PROFILE,
    component: () => import('../pages/user/Profile.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.INVITE,
    component: () => import('../pages/Invite.vue'),
    meta: {guestOnly: true}
  },
  {
    path: ROUTES.PROJECT.SETTINGS,
    component: () => import('../pages/project/ProjectSettings.vue'),
    children: [
      {
        path: 'general',
        component: () => import('../pages/project/GeneralSettings.vue'),
        props: true,
      },
      // {
      //   path: 'security',
      //   component: () => import('../pages/project/SecuritySettings.vue'),
      //   props: true,
      // },
      {
        path: 'delete',
        component: () => import('../pages/project/Delete.vue'),
        props: true,
      },
      {
        path: 'healthcheck',
        component: () => import('../pages/project/HealthCheckSettings.vue'),
        props: true,
      },
      {
        path: 'notification',
        component: () => import('../pages/project/NotificationSettings.vue'),
        props: true,
      },
    ],
    meta: {requiresAuth: true},
  },
  {
    path: '/healthcheck/:endpointId/results',
    component: () => import('../pages/healthcheck/Results.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.EVENT.SHOW,
    component: () => import('../pages/event/Show.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.PROJECT.ISSUES,
    component: () => import('../pages/project/Issues.vue'),
    props: true,
    meta: {requiresAuth: true},
  },
  {
    path: ROUTES.NOT_FOUND,
    component: () => import('../pages/NotFound.vue'),
  },
];
