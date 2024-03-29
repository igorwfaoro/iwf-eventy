export const API_BASE_URL = '/api';

export const API_URLS = {
  events: {
    search: () => `${API_BASE_URL}/events/search`,
    recommended: () => `${API_BASE_URL}/events/recommended`,
    getByUser: () => `${API_BASE_URL}/events/by-user`,
    getById: (id: number) => `${API_BASE_URL}/events/${id}`,
    create: () => `${API_BASE_URL}/events`,
    update: (id: number) => `${API_BASE_URL}/events/${id}`
  },
  invitations: {
    getByDescription: (eventId: number) =>
      `${API_BASE_URL}/events/${eventId}/invitations/by-description`,
    updateGuestsConfirmations: (eventId: number) =>
      `${API_BASE_URL}/events/${eventId}/invitations/guests-confirmations`
  },
  gifts: {
    getAllByEvent: (eventId: number) =>
      `${API_BASE_URL}/events/${eventId}/gifts`,
    getById: (eventId: number, id: number) =>
      `${API_BASE_URL}/events/${eventId}/gifts/${id}`,
    create: (eventId: number) => `${API_BASE_URL}/events/${eventId}/gifts`,
    update: (eventId: number, id: number) =>
      `${API_BASE_URL}/events/${eventId}/gifts/${id}`,
    delete: (eventId: number, id: number) =>
      `${API_BASE_URL}/events/${eventId}/gifts/${id}`
  },
  handbooks: {
    getAllByEvent: (eventId: number) =>
      `${API_BASE_URL}/events/${eventId}/handbooks`,
    getById: (eventId: number, id: number) =>
      `${API_BASE_URL}/events/${eventId}/handbooks/${id}`,
    create: (eventId: number) => `${API_BASE_URL}/events/${eventId}/handbooks`,
    update: (eventId: number, id: number) =>
      `${API_BASE_URL}/events/${eventId}/handbooks/${id}`,
    delete: (eventId: number, id: number) =>
      `${API_BASE_URL}/events/${eventId}/handbooks/${id}`
  }
};
