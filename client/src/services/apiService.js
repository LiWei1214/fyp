import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust based on your backend URL

// Set up Axios with credentials for authentication (JWT)
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Needed if using cookies for authentication
});

// Helper function to get JWT from local storage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
  return token ? {Authorization: `Bearer ${token}`} : {};
};

export const getNotes = async () => {
  try {
    const response = await axiosInstance.get('/api/notes', {
      headers: getAuthHeaders(),
    });

    console.log('API Response (getNotes):', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
};

export const getRecentNotes = async () => {
  try {
    const response = await axiosInstance.get('/api/notes', {
      headers: getAuthHeaders(),
    });

    console.log('API Response (getRecentNotes):', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent notes:', error);
    return [];
  }
};

export const createNote = async noteData => {
  const response = await axiosInstance.post('/api/notes', noteData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await axiosInstance.put(`/api/notes/${id}`, noteData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const deleteNote = async id => {
  await axiosInstance.delete(`/api/notes/${id}`, {
    headers: getAuthHeaders(),
  });
};

// 🚀 TO-DO LIST API
export const getTodos = async () => {
  const response = await axiosInstance.get('/api/todos', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const createTodo = async todoData => {
  const response = await axiosInstance.post('/api/todos', todoData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 🛠 FIX: Corrected updateTodo to include the `id` in URL
export const updateTodo = async (id, todoData) => {
  const response = await axiosInstance.put(`/api/todos/${id}`, todoData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// 🛠 FIX: Corrected deleteTodo to use URL instead of request body
export const deleteTodo = async task_id => {
  await axiosInstance.delete(`/api/todos/${task_id}`, {
    headers: getAuthHeaders(),
  });
};
