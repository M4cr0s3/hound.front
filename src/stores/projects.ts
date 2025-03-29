import {defineStore} from "pinia";
import {getProjects, type Project} from "../api";
import {ref} from "vue";

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const isLoading = ref(false);

  const fetchProjects = async () => {
    if (projects.value.length > 0) return;

    isLoading.value = true;
    try {
      const response = await getProjects();
      projects.value = response.data;
    } finally {
      isLoading.value = false;
    }
  };

  return {projects, isLoading, fetchProjects};

})