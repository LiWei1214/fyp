import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Set up Axios with credentials for authentication (JWT)
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
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

export const getTodosWithType = async () => {
  const response = await axiosInstance.get('/api/todos/with-type', {
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

// List API functions
export const getLists = async () => {
  const response = await axiosInstance.get('/api/lists', {
    headers: getAuthHeaders(), // Add authentication headers if needed for lists
  });
  return response.data;
};

export const createList = async name => {
  const response = await axiosInstance.post(
    '/api/lists',
    {name},
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteList = async id => {
  await axiosInstance.delete(`/api/lists/${id}`, {
    headers: getAuthHeaders(), // Add authentication headers if needed
  });
};

export const renameList = async (id, name) => {
  await axiosInstance.put(
    `/api/lists/${id}`,
    {name},
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    },
  );
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/api/categories', {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const uploadMaterial = async formData => {
  try {
    const response = await axiosInstance.post(
      '/api/lecturer/materials',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading material:', error);
    throw error;
  }
};

export const getUploadedMaterials = async () => {
  try {
    const response = await axiosInstance.get('/api/lecturer/materials', {
      headers: getAuthHeaders(),
    });
    return response.data.materials; // Return the array of materials
  } catch (error) {
    console.error('Error fetching uploaded materials:', error);
    throw error;
  }
};

export const deleteMaterial = async materialId => {
  try {
    const response = await axiosInstance.delete(
      `/api/lecturer/materials/${materialId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
};

export const updateMaterial = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/api/lecturer/materials/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating material:', error);
    throw error;
  }
};

export const getMaterialById = async id => {
  try {
    const response = await axiosInstance.get(`/api/lecturer/materials/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.material;
  } catch (error) {
    console.error(`Error fetching material with ID ${id}:`, error);
    throw error;
  }
};

export const getQuizQuestionsByMaterialId = async materialId => {
  try {
    const response = await axiosInstance.get(
      `/api/quizzes/by-material/${materialId}`,
      {headers: getAuthHeaders()},
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching quiz questions for category ID ${materialId}:`,
      error,
    );
    throw error;
  }
};

export const getMaterials = async (categoryIds = []) => {
  try {
    const query = categoryIds.length
      ? `?categories=${categoryIds.join(',')}`
      : '';
    const response = await axiosInstance.get(`/api/materials${query}`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

export const getUserCategories = async () => {
  const res = await axiosInstance.get('/api/user-categories', {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const saveUserCategories = async categoryIds => {
  const res = await axiosInstance.post(
    '/api/user-categories',
    {categoryIds},
    {headers: getAuthHeaders()},
  );
  return res.data;
};

export const deleteUserCategory = async categoryId => {
  const response = await axiosInstance.delete(
    `/api/user-categories/${categoryId}`,
    {headers: getAuthHeaders()},
  );
  return response.data;
};

export const getStudentQuizByMaterialId = async materialId => {
  const response = await axiosInstance.get(
    `/api/quizzes/by-material/${materialId}`,
  );
  return response.data;
};
