import { httpClient } from '../../../api/httpClient';

export const dashboardApi = {
  stats() {
    return httpClient.get('/dashboard/stats');
  },
};
