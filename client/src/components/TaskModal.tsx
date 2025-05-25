import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { TodoStatus, TodoTask, CreateTodoTaskDto, UpdateTodoTaskDto } from '../services/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  
  @media (max-width: 576px) {
    padding: 1.5rem;
    width: 95%;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  
  .separator {
    height: 2px;
    width: 30px;
    background-color: var(--primary);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-dark);
    font-weight: 500;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  outline: none;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  outline: none;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  > div {
    flex: 1;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormFooter = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-start;
  
  @media (max-width: 576px) {
    flex-direction: column;
    
    button {
      width: 100%;
      margin: 0 0 0.5rem 0 !important;
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &.primary {
    background-color: var(--primary);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: var(--text-light);
    margin-left: 1rem;
    
    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: CreateTodoTaskDto | UpdateTodoTaskDto) => Promise<void>;
  task: TodoTask | null;
}

const TaskModal = ({ isOpen, onClose, onSave, task }: TaskModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completedAt: '',
    status: TodoStatus.Pendente
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        completedAt: task.completedAt ? format(new Date(task.completedAt), 'yyyy-MM-dd') : '',
        status: task.status
      });
    } else {
      setFormData({
        title: '',
        description: '',
        completedAt: '',
        status: TodoStatus.Pendente
      });
    }
    
    setErrors({});
  }, [task, isOpen]);
  
  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'O título é obrigatório';
    } else if (formData.title.length > 100) {
      newErrors.title = 'O título deve ter no máximo 100 caracteres';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'A descrição deve ter no máximo 500 caracteres';
    }
    
    if (formData.completedAt) {
      if (task) {
        const creationDate = new Date(task.createdAt);
        const completionDate = new Date(formData.completedAt);
        
        if (completionDate < creationDate) {
          newErrors.completedAt = 'A data de conclusão não pode ser anterior à data de criação';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (validate()) {
      try {
        setIsSubmitting(true);
        
        if (task) {
          const updateData: UpdateTodoTaskDto = {
            id: task.id,
            title: formData.title,
            description: formData.description || null,
            completedAt: formData.completedAt ? new Date(formData.completedAt).toISOString() : null,
            status: formData.status as TodoStatus
          };
          await onSave(updateData);
        } else {
          const createData: CreateTodoTaskDto = {
            title: formData.title,
            description: formData.description || undefined,
            status: formData.status
          };
          await onSave(createData);
        }
        
        handleCloseModal();
      } catch (error) {
        console.error("Erro ao salvar tarefa:", error);
        if (error instanceof Error) {
          console.error("Mensagem:", error.message);
          console.error("Stack:", error.stack);
        }
        alert(`Erro ao salvar tarefa: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleCloseModal = () => {
    if (!isSubmitting) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={handleCloseModal}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>{task ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h2>
          <div className="separator" />
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="title">Título</label>
            <Input 
              type="text" 
              id="title" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título da tarefa"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>
          
          <FormRow>
            {task && (
              <FormGroup>
                <label htmlFor="completedAt">Data de Conclusão</label>
                <Input 
                  type="date" 
                  id="completedAt" 
                  name="completedAt" 
                  value={formData.completedAt}
                  onChange={handleChange}
                />
                {errors.completedAt && <ErrorMessage>{errors.completedAt}</ErrorMessage>}
              </FormGroup>
            )}
            
            <FormGroup>
              <label htmlFor="status">Status</label>
              <Select 
                id="status" 
                name="status" 
                value={formData.status}
                onChange={handleChange}
              >
                <option value={TodoStatus.Pendente}>Pendente</option>
                <option value={TodoStatus.EmProgresso}>Em Progresso</option>
                <option value={TodoStatus.Concluída}>Concluída</option>
              </Select>
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <label htmlFor="description">Descrição</label>
            <TextArea 
              id="description" 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva a tarefa..."
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>
          
          <FormFooter>
            <Button 
              type="submit" 
              className="primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </Button>
            <Button 
              type="button" 
              className="secondary" 
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </FormFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default TaskModal;