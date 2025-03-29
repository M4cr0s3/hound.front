import {api} from "../";
import type {AxiosResponse} from "axios";
import type {Project} from "./";

export const getProjects = async (): Promise<AxiosResponse<Project[]>> => api.get('/projects');

export const getProject = async (slug: string): Promise<AxiosResponse<Project>> => api.get(`/projects/${slug}`);