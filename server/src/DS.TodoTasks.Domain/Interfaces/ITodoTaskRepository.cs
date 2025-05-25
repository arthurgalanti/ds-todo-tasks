using DS.TodoTasks.Domain.Entities;
using DS.TodoTasks.Domain.Enums;

namespace DS.TodoTasks.Domain.Interfaces
{
    public interface ITodoTaskRepository
    {
        Task<TodoTask?> GetByIdAsync(int id);
        Task<IEnumerable<TodoTask>> GetAllAsync();
        Task AddAsync(TodoTask task);
        Task UpdateAsync(TodoTask task);
        Task DeleteAsync(TodoTask task);
    }
}
