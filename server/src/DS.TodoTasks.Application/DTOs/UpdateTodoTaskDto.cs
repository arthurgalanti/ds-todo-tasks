using DS.TodoTasks.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace DS.TodoTasks.Application.DTOs
{
    public class UpdateTodoTaskDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public DateTime? CompletedAt { get; set; }

        [Required]
        public TodoStatus Status { get; set; }
    }
}
