import api from '../api';
import type { LastDayStatsResponse } from './types';

export const getProjectStatsLastDay = async () =>
	api.get<LastDayStatsResponse>(`/projects/stats/day`);
