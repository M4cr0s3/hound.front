import {defineStore} from "pinia";
import {getProject, getProjects, updateProject, type Project, type UpdateProjectBody} from "../api";
import {ref} from "vue";
import {router} from "../router";

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const project = ref<Project>({});
  const updateBody = ref<UpdateProjectBody>({
    name: '',
    slug: '',
  });
  const isLoading = ref(false);

  const fetchProjects = async () => {
    isLoading.value = true;
    try {
      const response = await getProjects();
      projects.value = response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProject = async (slug: string) => {
    isLoading.value = true;
    try {
      const response = await getProject(slug);
      project.value = response.data;
    } finally {
      isLoading.value = false;
    }
  }

  const update = async (slug: string, body: UpdateProjectBody) => {
    isLoading.value = true;
    try {
      const {data: response} = await updateProject(slug, body);
      await fetchProjects();
      await router.push(`/projects/${response.data.slug}/settings/general`);
    } finally {
      isLoading.value = false;
    }
  }

  return {projects, project, updateBody, isLoading, fetchProjects, fetchProject, update};

})