import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  getProjectsStatsLastDay,
  updateProject,
  type CreateProjectBody,
  type Project,
  type ProjectKey,
  type Slug,
  type Team,
  type UpdateProjectBody,
} from '@/api';
import { router } from '@/router';
import { ROUTES } from '@/router/routes.ts';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const project = ref<Project>(
    {
      id: 0,
      team_id: 0,
      name: 'none',
      slug: '',
      platform: '',
      team: {} as Team,
      key: {} as ProjectKey,
      events: [],
      issues: [],
      endpoints: [],
      notificationRules: [],
    });
  const updateBody = ref<UpdateProjectBody>({
    name: '',
    slug: '',
  });
  const isLoading = ref(false);

  const fetchProjects = async () => {
    isLoading.value = true;
    try {
      projects.value = await getProjects();
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProject = async (slug: string) => {
    isLoading.value = true;
    try {
      project.value = (await getProject(slug)).project;
    } finally {
      isLoading.value = false;
    }
  };

  const update = async (slug: string, body: UpdateProjectBody) => {
    isLoading.value = true;
    try {
      const { data: response } = await updateProject(slug, body);
      await fetchProjects();
      await router.push(`/projects/${response.slug}/settings/general`);
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (body: CreateProjectBody) => {
    isLoading.value = true;
    try {
      await createProject(body);
      await router.push(ROUTES.PROJECT.INDEX);
    } finally {
      isLoading.value = false;
    }
  };

  const destroy = async (slug: Slug) => {
    isLoading.value = true;
    try {
      await deleteProject(slug);
      await fetchProjects();
      await router.push('/projects');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProjectsWithStats = async () => {
    isLoading.value = true;
    try {
      projects.value = await getProjectsStatsLastDay();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    projects,
    project,
    updateBody,
    isLoading,
    fetchProjects,
    fetchProject,
    fetchProjectsWithStats,
    update,
    create,
    destroy,
  };
});
