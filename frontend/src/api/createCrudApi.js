import { httpClient } from './httpClient';
import { queryString } from '../utils/queryString';

/**
 * Factory that creates a standard CRUD API object for a given base path.
 *
 * @param {string} basePath  e.g. '/employees'
 * @param {object} overrides Optional method overrides
 */
export function createCrudApi(basePath, overrides = {}) {
  return {
    list:   (params = {}) => httpClient.get(`${basePath}${queryString(params)}`),
    get:    (id)          => httpClient.get(`${basePath}/${id}`),
    create: (payload)     => httpClient.post(basePath, payload),
    update: (id, payload) => httpClient.put(`${basePath}/${id}`, payload),
    remove: (id)          => httpClient.delete(`${basePath}/${id}`),
    ...overrides,
  };
}
