import styled from 'styled-components';
import { format, isValid } from 'date-fns';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle, FaHourglass } from 'react-icons/fa';
import { TodoStatus, TodoTask } from '../services/api';

const TaskCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  word-break: break-word;
`;

const TaskDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.4;
  word-break: break-word;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-light);
  flex-wrap: wrap;
  
  @media (max-width: 576px) {
    margin-bottom: 0.5rem;
  }
`;

const TaskDate = styled.span`
  margin-right: 1.5rem;
  margin-bottom: 0.25rem;
`;

const TaskStatus = styled.span<{ status: TodoStatus }>`
  display: flex;
  align-items: center;
  color: ${props => {
    switch(props.status) {
      case TodoStatus.Concluída: return 'green';
      case TodoStatus.EmProgresso: return 'orange';
      default: return 'var(--text-light)';
    }
  }};
  
  svg {
    margin-right: 0.25rem;
  }
`;

const TaskActions = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border);
  }
`;

const ActionButton = styled.button<{ delete?: boolean }>`
  background: none;
  border: none;
  color: var(--text-light);
  margin-left: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${props => props.delete ? 'red' : 'var(--primary)'};
  }
  
  @media (max-width: 576px) {
    width: 40px;
    height: 40px;
  }
`;

interface TaskItemProps {
  task: TodoTask;
  onEdit: (task: TodoTask) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const formatSafeDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Data inválida';
    } catch (error) {
      console.error(`Erro ao formatar data: ${dateString}`, error);
      return 'Erro na data';
    }
  };

  const formattedCreationDate = formatSafeDate(task.createdAt);
  
  const getStatusIcon = (status: TodoStatus) => {
    switch(status) {
      case TodoStatus.Concluída: return <FaCheckCircle />;
      case TodoStatus.EmProgresso: return <FaHourglass />;
      default: return <FaRegCircle />;
    }
  };
  
  const getStatusLabel = (status: TodoStatus) => {
    switch(status) {
      case TodoStatus.Pendente: return 'Pendente';
      case TodoStatus.EmProgresso: return 'Em Progresso';
      case TodoStatus.Concluída: return 'Concluída';
      default: return 'Desconhecido';
    }
  };
  
  return (
    <TaskCard>
      <TaskContent>
        <TaskTitle>{task.title}</TaskTitle>
        {task.description && (
          <TaskDescription>{task.description}</TaskDescription>
        )}
        <TaskMeta>
          <TaskDate>Criado em: {formattedCreationDate}</TaskDate>
          <TaskStatus status={task.status}>
            {getStatusIcon(task.status)}
            {getStatusLabel(task.status)}
          </TaskStatus>
        </TaskMeta>
      </TaskContent>
      
      <TaskActions>
        <ActionButton onClick={() => onEdit(task)}>
          <FaEdit />
        </ActionButton>
        <ActionButton delete onClick={() => onDelete(task.id)}>
          <FaTrash />
        </ActionButton>
      </TaskActions>
    </TaskCard>
  );
};

export default TaskItem;