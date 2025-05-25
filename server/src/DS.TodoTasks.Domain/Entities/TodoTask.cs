using DS.TodoTasks.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace DS.TodoTasks.Domain.Entities
{
    public class TodoTask
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        [Required]
        public TodoStatus Status { get; set; } = TodoStatus.Pendente;
    }
}
