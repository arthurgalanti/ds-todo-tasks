namespace DS.TodoTasks.Domain.Notifications
{
    public class Notification
    {
        public string Key { get; }
        public string Value { get; }

        public Notification(string key, string value)
        {
            Key = key;
            Value = value;
        }
    }
}