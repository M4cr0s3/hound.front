import {httpClient} from '@/api';
import type { LastDayStatsResponse } from '@/api';

export const getProjectsStatsLastDay = async () =>
	httpClient.get<LastDayStatsResponse>(`/projects/stats/day`);
