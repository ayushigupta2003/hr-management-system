import { httpClient } from '../../../api/httpClient';

export const authApi = {
  login:           (payload) => httpClient.post('/auth/login', payload),
  register:        (payload) => httpClient.post('/auth/register', payload),
  me:              ()        => httpClient.get('/auth/me'),
  logout:          ()        => httpClient.post('/auth/logout'),
  updateProfile:   (payload) => httpClient.put('/auth/profile', payload),
  changePassword:  (payload) => httpClient.put('/auth/password', payload),
};
