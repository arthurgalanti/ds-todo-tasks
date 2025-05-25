using DS.TodoTasks.Domain.Enums;

namespace DS.TodoTasks.Application.DTOs
{
    public class TodoTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public TodoStatus Status { get; set; }
    }
}
