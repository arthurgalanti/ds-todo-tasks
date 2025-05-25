import axios from 'axios';

enum TodoStatus {
  Pendente = 0,
  EmProgresso = 1,
  Concluída = 2
}

interface CreateTodoTaskDto {
  title: string;
  description?: string;
  status: TodoStatus;
}

interface UpdateTodoTaskDto {
  id: number;
  title: string;
  description?: string | null;
  completedAt?: string | null;
  status: TodoStatus;
}

interface TodoTask {
  id: number;
  title: string;
  description?: string | null;
  createdAt: string;
  completedAt?: string | null;
  status: TodoStatus;
}

interface ApiResponse<T> {
  succeeded: boolean;
  data: T;
  errors?: string[];
  message?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

api.interceptors.request.use(
  config => {
    if (config.data) {
    }
    return config;
  },
  error => {
    console.error('API Request Preparation Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Response Error Details:');
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
      console.error('Is network error:', error.message.includes('Network Error'));
    } else {
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
    }
    return Promise.reject(error);
  }
);

export const TaskService = {
  getAll: async (): Promise<TodoTask[]> => {
    try {
      const response = await api.get<ApiResponse<TodoTask[]>>('/tasks');
      
      if (response.data && response.data.succeeded && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.error('Formato de resposta inesperado:', response.data);
        return [];
      }
    } catch (error) {
      console.error('TaskService.getAll erro:', error);
      return [];
    }
  },
  
  getById: async (id: number): Promise<TodoTask | null> => {
    try {
      const response = await api.get<ApiResponse<TodoTask>>(`/task/${id}`);
      
      if (response.data && response.data.succeeded) {
        return response.data.data;
      } else {
        console.error('Formato de resposta inesperado:', response.data);
        return null;
      }
    } catch (error) {
      console.error('TaskService.getById erro:', error);
      return null;
    }
  },
  
  getByStatus: async (status: TodoStatus): Promise<TodoTask[]> => {
    try {
      const response = await api.get<ApiResponse<TodoTask[]>>(`/task/status/${status}`);
      
      if (response.data && response.data.succeeded && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.error('Formato de resposta inesperado:', response.data);
        return [];
      }
    } catch (error) {
      console.error('TaskService.getByStatus erro:', error);
      return [];
    }
  },
  
  create: async (task: CreateTodoTaskDto): Promise<TodoTask | null> => {
    try {
      const response = await api.post<ApiResponse<TodoTask>>('/task', task);
      
      if (response.data && response.data.succeeded) {
        return response.data.data;
      } else {
        console.error('Formato de resposta inesperado:', response.data);
        return null;
      }
    } catch (error) {
      console.error('TaskService.create erro:', error);
      throw error;
    }
  },
  
  update: async (id: number, task: UpdateTodoTaskDto): Promise<TodoTask | null> => {
    try {
      const response = await api.put<ApiResponse<TodoTask>>(`/task/${id}`, task);
      
      if (response.data && response.data.succeeded) {
        return response.data.data;
      } else {
        console.error('Formato de resposta inesperado:', response.data);
        return null;
      }
    } catch (error) {
      console.error('TaskService.update erro:', error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<boolean> => {
    try {
      const response = await api.delete<ApiResponse<null>>(`/task/${id}`);
      
      return response.data && response.data.succeeded || false;
    } catch (error) {
      console.error('TaskService.delete erro:', error);
      throw error;
    }
  }
};

export { TodoStatus };
export type { CreateTodoTaskDto, UpdateTodoTaskDto, TodoTask };
export default api;