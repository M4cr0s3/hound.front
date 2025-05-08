import {httpClient} from "../";
import type {Project} from "./";

export const getProjects = async (): Promise<Project[]> => httpClient.get('/projects');

export const getProject = async (slug: string) => httpClient.get<{ project: Project }>(`/projects/${slug}`);