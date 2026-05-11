import { httpClient } from '../../../api/httpClient';
import { queryString } from '../../../utils/queryString';

export const performanceApi = {
  list:   (params)          => httpClient.get(`/performance${queryString(params)}`),
  create: (payload)         => httpClient.post('/performance', payload),
  update: (id, payload)     => httpClient.put(`/performance/${id}`, payload),
  remove: (id)              => httpClient.delete(`/performance/${id}`),
};
