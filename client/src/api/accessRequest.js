import api from '../services/api';

 export const accessRequestApi = {

    create: (accessRequestData) => api.post('/access-requests', accessRequestData),

    getAll: () => api.get('/access-requests'),

    updateStatus: (id, statusData) => api.patch(`/access-requests/${id}/status`, statusData),

    delete: (id) => api.delete(`/access-requests/${id}`),
    
 };