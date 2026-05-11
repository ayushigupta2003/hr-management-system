import { httpClient } from '../../../api/httpClient';
import { queryString } from '../../../utils/queryString';

export const recruitmentApi = {
  listJobs:          (params)           => httpClient.get(`/recruitment/jobs${queryString(params)}`),
  createJob:         (payload)          => httpClient.post('/recruitment/jobs', payload),
  updateJob:         (id, payload)      => httpClient.put(`/recruitment/jobs/${id}`, payload),
  deleteJob:         (id)               => httpClient.delete(`/recruitment/jobs/${id}`),
  listApplicants:    (jobId, params)    => httpClient.get(`/recruitment/jobs/${jobId}/applicants${queryString(params)}`),
  createApplicant:   (jobId, payload)   => httpClient.post(`/recruitment/jobs/${jobId}/applicants`, payload),
  updateApplicant:   (jobId, id, payload) => httpClient.put(`/recruitment/jobs/${jobId}/applicants/${id}`, payload),
  deleteApplicant:   (jobId, id)        => httpClient.delete(`/recruitment/jobs/${jobId}/applicants/${id}`),
};
