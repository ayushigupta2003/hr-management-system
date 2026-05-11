import { createCrudApi } from '../../../api/createCrudApi';
import { httpClient } from '../../../api/httpClient';
import { queryString } from '../../../utils/queryString';

export const attendanceApi = createCrudApi('/attendance', {
  mark:          (payload) => httpClient.post('/attendance', payload),
  bulkMark:      (payload) => httpClient.post('/attendance/bulk', payload),
  monthlyReport: (params)  => httpClient.get(`/attendance/monthly-report${queryString(params)}`),
});
