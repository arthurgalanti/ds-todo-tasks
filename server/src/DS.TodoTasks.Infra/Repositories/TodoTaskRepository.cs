using DS.TodoTasks.Domain.Entities;
using DS.TodoTasks.Domain.Enums;
using DS.TodoTasks.Domain.Interfaces;
using DS.TodoTasks.Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace DS.TodoTasks.Infra.Repositories
{
    public class TodoTaskRepository : ITodoTaskRepository
    {
        private readonly AppDbContext _context;

        public TodoTaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TodoTask?> GetByIdAsync(int id)
        {
            return await _context.TodoTasks
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<IEnumerable<TodoTask>> GetAllAsync()
        {
            return await _context.TodoTasks
                .AsNoTracking()
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(TodoTask task)
        {
            await _context.TodoTasks.AddAsync(task);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(TodoTask task)
        {
            _context.TodoTasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(TodoTask task)
        {
            _context.TodoTasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }
}
