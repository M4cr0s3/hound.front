import {api} from "../";
import type {AxiosResponse} from "axios";
import type {Project} from "./";

export const getProjects = async (): Promise<AxiosResponse<Project[]>> => api.get('/projects');