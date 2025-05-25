import { useState } from 'react';
import styled from 'styled-components';
import { FaPlus, FaSync } from 'react-icons/fa';
import { useTasks } from '../contexts/TaskContext';
import TaskItem from './TaskItem';
import TaskModal from './TaskModal';
import { TodoTask, CreateTodoTaskDto, UpdateTodoTaskDto } from '../services/api';

const TasksContainer = styled.div`
  padding: 1.5rem;
  flex: 1;
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--text-dark);
  
  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
`;

const FilterLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-light);
  margin-right: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  margin-right: 1rem;
  outline: none;
  font-size: 0.9rem;
  background-color: white;
  
  @media (max-width: 576px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const AddButton = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
  }
`;

const ReloadButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.8rem;
  background-color: #f8f9fa;
  color: var(--text-light);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e9ecef;
    color: var(--primary);
  }
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    margin-left: 0;
    justify-content: center;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
  
  p {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 576px) {
    padding: 2rem 1rem;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid var(--primary);
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  background-color: rgba(255, 0, 0, 0.05);
  border-left: 3px solid red;
  color: darkred;
`;

const TaskList = () => {
  const { 
    filteredTasks, 
    loading,
    error,
    statusFilter, 
    setStatusFilter,
    addTask,
    updateTask,
    deleteTask,
    fetchTasks
  } = useTasks();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TodoTask | null>(null);
  
  const handleOpenModal = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };
  
  const handleEditTask = (task: TodoTask) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  const handleReload = () => {
    fetchTasks();
  };
  
  const handleSaveTask = async (task: CreateTodoTaskDto | UpdateTodoTaskDto) => {
    try {
      if ('id' in task) {
        const updatedTask = await updateTask(task.id, task);
        if (updatedTask) {
        } else {
          console.error("A tarefa não foi atualizada corretamente");
          alert("Erro ao atualizar tarefa. Verifique o console para mais detalhes.");
        }
      } else {
        const newTask = await addTask(task);
        if (newTask) {
        } else {
          console.error("A tarefa não foi criada corretamente");
          alert("Erro ao criar tarefa. Verifique o console para mais detalhes.");
        }
      }
      handleCloseModal();
      
      fetchTasks();
    } catch (error) {
      console.error("TaskList.handleSaveTask erro:", error);
      alert(`Falha ao salvar tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };
  
  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        const success = await deleteTask(id);
        if (success) {
        } else {
          console.error("A tarefa não foi excluída corretamente");
          alert("Erro ao excluir tarefa. Verifique o console para mais detalhes.");
        }
      } catch (error) {
        console.error("TaskList.handleDeleteTask erro:", error);
        alert(`Erro ao excluir tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
  };

  return (
    <TasksContainer>
      <TasksHeader>
        <Title>Minhas Tarefas</Title>
        <AddButton onClick={handleOpenModal}>
          <FaPlus /> Adicionar
        </AddButton>
      </TasksHeader>
      
      <FiltersRow>
        <FilterLabel>Status:</FilterLabel>
        <FilterSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="EmProgresso">Em Progresso</option>
          <option value="Concluída">Concluída</option>
        </FilterSelect>
        
        <ReloadButton onClick={handleReload}>
          <FaSync /> Atualizar Lista
        </ReloadButton>
      </FiltersRow>
      
      {error && (
        <ErrorMessage>
          <p>Erro ao carregar tarefas: {error}</p>
          <button onClick={handleReload}>Tentar novamente</button>
        </ErrorMessage>
      )}
      
      {loading ? (
        <LoadingIndicator>
          <span className="loader"></span>
        </LoadingIndicator>
      ) : filteredTasks.length > 0 ? (
        filteredTasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task} 
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))
      ) : (
        <EmptyState>
          <p>Nenhuma tarefa encontrada.</p>
        </EmptyState>
      )}
      
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveTask}
        task={currentTask}
      />
    </TasksContainer>
  );
};

export default TaskList;