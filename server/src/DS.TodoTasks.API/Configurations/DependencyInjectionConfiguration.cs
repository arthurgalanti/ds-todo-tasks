using DS.TodoTasks.Domain.Notifications;
using DS.TodoTasks.Application.Interfaces;
using DS.TodoTasks.Application.Services;

namespace DS.TodoTasks.API.Configurations
{
    public static class DependencyInjectionConfiguration
    {
        public static void ResolveDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            // Services
            services.AddScoped<ITodoTaskService, TodoTaskService>();

            // Notification
            services.AddScoped<INotificationHandler, NotificationHandler>();
        }
    }
}
