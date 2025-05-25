namespace DS.TodoTasks.Domain.Notifications
{
    public class NotificationHandler : INotificationHandler
    {
        private readonly List<Notification> _notifications = new List<Notification>();

        public void AddNotification(string key, string value)
        {
            _notifications.Add(new Notification(key, value));
        }

        public bool HasNotifications() => _notifications.Any();

        public IEnumerable<Notification> GetNotifications() => _notifications;

        public void Clear() => _notifications.Clear();
    }
}
