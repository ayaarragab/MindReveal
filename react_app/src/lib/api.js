const API_BASE_URL = 'http://localhost:3000/mindreveal/api/v1';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchWithAuth(endpoint, options = {}) {
  const accessToken = localStorage.getItem('access-token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {    
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  const responseToJson = await response.json();
  // if (!response.ok) {
    
  //   const error = await response.text();
  //   throw new ApiError(error, response.status);
  // }
  console.log(responseToJson);
  
  return responseToJson;
}

export const api = {
  auth: {
    login: (credentials) => 
      fetchWithAuth('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData) =>
      fetchWithAuth('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    getNewAccessToken: (refreshToken) => 
      fetchWithAuth('/token', {
        method: 'POST',
        body: JSON.stringify(refreshToken),
      })
  },
  thoughts: {
    getAll: (page = 1, limit = 4) =>
      fetchWithAuth(`/thoughts`,{page , limit}),
    search: (query, page = 1, limit = 4) => 
      fetchWithAuth(`/thoughts/search?keyword=${query}`, {page, limit}),
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
