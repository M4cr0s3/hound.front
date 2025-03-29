import type {RouteRecordRaw} from "vue-router";
import GeneralSettings from "../pages/GeneralSettings.vue";
import SecuritySettings from "../pages/SecuritySettings.vue";
import ProjectSettings from "../pages/ProjectSettings.vue";

export const ROUTES = {
  INDEX: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  CREATE_TEAM: '/teams/create',
  PROJECTS: '/projects',
  CREATE_PROJECT: '/projects/create'
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
  },
  {
    path: ROUTES.PROJECTS,
    component: () => import('../pages/Projects.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: ROUTES.CREATE_PROJECT,
    component: () => import('../pages/CreateProject.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:slug/settings',
    component: ProjectSettings,
    children: [
      {path: 'general', component: GeneralSettings},
      {path: 'security', component: SecuritySettings},
    ]
  }
  // {
  //   path: '/projects/:slug',
  //   component: ProjectSettingsPage,
  //   meta: { requiresAuth: true },
  //   children: [
  //     {
  //       path: '',
  //       name: 'project-overview',
  //       component: ProjectOverviewPage
  //     },
  //     {
  //       path: 'settings',
  //       name: 'project-settings',
  //       component: ProjectSettingsForm
  //     }
  //   ]
  // }
];