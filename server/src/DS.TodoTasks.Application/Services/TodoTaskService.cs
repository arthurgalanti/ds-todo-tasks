using DS.TodoTasks.Application.DTOs;
using DS.TodoTasks.Application.Interfaces;
using DS.TodoTasks.Domain.Entities;
using DS.TodoTasks.Domain.Enums;
using DS.TodoTasks.Domain.Interfaces;
using DS.TodoTasks.Domain.Notifications;
using DS.TodoTasks.Domain.Validation;

namespace DS.TodoTasks.Application.Services
{
    public class TodoTaskService : ITodoTaskService
    {
        private readonly ITodoTaskRepository _repository;
        private readonly INotificationHandler _notifications;

        public TodoTaskService(ITodoTaskRepository repository, INotificationHandler notifications)
        {
            _repository = repository;
            _notifications = notifications;
        }

        public async Task<TodoTaskDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity is null ? null : MapToDto(entity);
        }

        public async Task<IEnumerable<TodoTaskDto>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            return list.Select(MapToDto);
        }

        public async Task<TodoTaskDto> CreateAsync(CreateTodoTaskDto dto)
        {
            var entity = new TodoTask
            {
                Title = dto.Title,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
                Status = dto.Status
            };

            await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task<TodoTaskDto?> UpdateAsync(UpdateTodoTaskDto dto)
        {
            var entity = await _repository.GetByIdAsync(dto.Id);
            if (entity is null)
                return null;

            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.Status = dto.Status;
            entity.CompletedAt = dto.CompletedAt;

            if (!TodoTaskValidation.IsValidCompletionDate(entity))
            {
                _notifications.AddNotification("InvalidCompletionDate", "A data de conclusão não pode ser anterior à data de criação.");
                return null;
            }

            await _repository.UpdateAsync(entity);
            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity is null)
                return false;

            await _repository.DeleteAsync(entity);
            return true;
        }

        private static TodoTaskDto MapToDto(TodoTask entity)
        {
            return new TodoTaskDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Description = entity.Description,
                CreatedAt = entity.CreatedAt,
                CompletedAt = entity.CompletedAt,
                Status = entity.Status
            };
        }
    }
}