import {api} from "../";
import {type Team} from "./";
import type {AxiosResponse} from "axios";

export const getTeams = async (): Promise<AxiosResponse<Team[]>> => api.get('/teams')