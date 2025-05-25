using DS.TodoTasks.Application.DTOs;
using DS.TodoTasks.Domain.Enums;

namespace DS.TodoTasks.Application.Interfaces
{
    public interface ITodoTaskService
    {
        Task<TodoTaskDto?> GetByIdAsync(int id);
        Task<IEnumerable<TodoTaskDto>> GetAllAsync();
        Task<TodoTaskDto> CreateAsync(CreateTodoTaskDto dto);
        Task<TodoTaskDto?> UpdateAsync(UpdateTodoTaskDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
