import { createCrudApi } from '../../../api/createCrudApi';
import { httpClient } from '../../../api/httpClient';

export const employeesApi = createCrudApi('/employees', {
  // Override update to use POST + _method spoofing for FormData (file uploads)
  update: (id, payload) => {
    if (payload instanceof FormData) {
      payload.append('_method', 'PUT');
      return httpClient.post(`/employees/${id}`, payload);
    }
    return httpClient.put(`/employees/${id}`, payload);
  },
  toggleStatus: (id) => httpClient.patch(`/employees/${id}/toggle-status`),
});
