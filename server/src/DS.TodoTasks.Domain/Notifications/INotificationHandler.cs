namespace DS.TodoTasks.Domain.Notifications
{
    public interface INotificationHandler
    {
        void AddNotification(string key, string value);
        bool HasNotifications();
        IEnumerable<Notification> GetNotifications();
        void Clear();
    }
}
