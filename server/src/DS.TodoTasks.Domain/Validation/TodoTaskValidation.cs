using DS.TodoTasks.Domain.Entities;

namespace DS.TodoTasks.Domain.Validation
{
    public static class TodoTaskValidation
    {
        public static bool IsValidCompletionDate(TodoTask task)
        {
            if (task.CompletedAt.HasValue)
                return task.CompletedAt.Value >= task.CreatedAt;

            return true;
        }
    }
}
