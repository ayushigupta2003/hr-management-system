import { httpClient } from '../../../api/httpClient';
import { queryString } from '../../../utils/queryString';

export const documentsApi = {
  list:     (params)        => httpClient.get(`/documents${queryString(params)}`),
  upload:   (payload)       => httpClient.post('/documents', payload),
  update:   (id, payload)   => httpClient.put(`/documents/${id}`, payload),
  remove:   (id)            => httpClient.delete(`/documents/${id}`),
  download: (id, fileName)  => {
    const link = document.createElement('a');
    link.href = `http://localhost:8000/api/v1/documents/${id}/download`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
