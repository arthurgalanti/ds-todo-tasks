import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { TaskService, TodoStatus, TodoTask, CreateTodoTaskDto, UpdateTodoTaskDto } from '../services/api';

interface TaskContextType {
  tasks: TodoTask[];
  filteredTasks: TodoTask[];
  loading: boolean;
  error: string | null;
  statusFilter: string;
  searchTerm: string;
  setStatusFilter: (status: string) => void;
  setSearchTerm: (term: string) => void;
  fetchTasks: () => Promise<void>;
  addTask: (task: CreateTodoTaskDto) => Promise<TodoTask>;
  updateTask: (id: number, task: UpdateTodoTaskDto) => Promise<TodoTask>;
  deleteTask: (id: number) => Promise<boolean>;
}

interface TaskProviderProps {
  children: ReactNode;
}

const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<TodoTask[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const sanitizeTask = (task: any): TodoTask => {

    return {
      id: Number(task.id) || 0,
      title: task.title || 'Sem título',
      description: task.description || null,
      createdAt: task.createdAt || new Date().toISOString(),
      completedAt: task.completedAt || null,
      status: typeof task.status === 'number' ? task.status : TodoStatus.Pendente
    };
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskService.getAll();
      
      const validTasks = Array.isArray(data) ? data.map(sanitizeTask) : [];
      
      setTasks(validTasks);
      setFilteredTasks(validTasks);
      setError(null);
    } catch (err) {
      console.error('TaskContext.fetchTasks erro:', err);
      setError('Erro ao carregar as tarefas');

      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (Array.isArray(tasks) && tasks.length > 0) {
      let result = [...tasks];
      
      if (statusFilter) {
        const statusNumber = 
          statusFilter === 'Pendente' ? TodoStatus.Pendente :
          statusFilter === 'EmProgresso' ? TodoStatus.EmProgresso :
          statusFilter === 'Concluída' ? TodoStatus.Concluída : -1;

        if (statusNumber !== -1) {
          result = result.filter(task => task.status === statusNumber);
        }
      }
      
      if (searchTerm) {
        result = result.filter(task => 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      setFilteredTasks(result);
    } else {
      setFilteredTasks([]);
    }
  }, [tasks, statusFilter, searchTerm]);

  const addTask = async (task: CreateTodoTaskDto): Promise<TodoTask> => {
    try {
      setLoading(true);
      const newTask = await TaskService.create(task);
      
      const sanitizedTask = sanitizeTask(newTask);
      
      setTasks(prev => {
        if (Array.isArray(prev)) {
          return [...prev, sanitizedTask];
        } else {
          console.warn('prev não é um array em addTask, inicializando com [newTask]');
          return [sanitizedTask];
        }
      });
      
      return sanitizedTask;
    } catch (err) {
      console.error('TaskContext.addTask erro:', err);
      setError('Erro ao criar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: number, task: UpdateTodoTaskDto): Promise<TodoTask> => {
    try {
      setLoading(true);
      const updatedTask = await TaskService.update(id, task);
      
      const sanitizedTask = sanitizeTask(updatedTask);
      
      setTasks(prev => {
        if (Array.isArray(prev)) {
          return prev.map(t => (t.id === id ? sanitizedTask : t));
        } else {
          console.warn('prev não é um array em updateTask');
          return [sanitizedTask];
        }
      });
      
      return sanitizedTask;
    } catch (err) {
      console.error('TaskContext.updateTask erro:', err);
      setError('Erro ao atualizar tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await TaskService.delete(id);
      
      setTasks(prev => {
        if (Array.isArray(prev)) {
          return prev.filter(task => task.id !== id);
        } else {
          console.warn('prev não é um array em deleteTask');
          return [];
        }
      });
      
      return true;
    } catch (err) {
      console.error('TaskContext.deleteTask erro:', err);
      setError('Erro ao excluir tarefa');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        loading,
        error,
        statusFilter,
        searchTerm,
        setStatusFilter,
        setSearchTerm,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;