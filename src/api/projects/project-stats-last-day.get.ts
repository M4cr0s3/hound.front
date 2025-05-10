import {httpClient} from '@/api';
import type { LastDayStatsResponse } from '@/api';

export const getProjectStatsLastDay = async () =>
	httpClient.get<LastDayStatsResponse>(`/projects/stats/day`);
