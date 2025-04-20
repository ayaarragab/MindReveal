
const API_BASE_URL = 'http://localhost:3000/mindreveal/api/v1';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(error, response.status);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials) => 
      fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },
  thoughts: {
    getAll: (page = 1, limit = 10) =>
      fetchWithAuth(`/thoughts?page=${page}&limit=${limit}`),
    search: (query, page = 1, limit = 10) =>
      fetchWithAuth(`/thoughts/search?q=${query}&page=${page}&limit=${limit}`),
    create: (thought) =>
      fetchWithAuth('/thoughts', {
        method: 'POST',
        body: JSON.stringify(thought),
      }),
    update: (id, thought) =>
      fetchWithAuth(`/thoughts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(thought),
      }),
    delete: (id) =>
      fetchWithAuth(`/thoughts/${id}`, {
        method: 'DELETE',
      }),
  },
  categories: {
    getAll: () => fetchWithAuth('/categories'),
    create: (category) =>
      fetchWithAuth('/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      }),
    update: (id, category) =>
      fetchWithAuth(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
      }),
    delete: (id) =>
      fetchWithAuth(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },
};
