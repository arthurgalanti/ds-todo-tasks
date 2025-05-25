using DS.TodoTasks.Domain.Interfaces;
using DS.TodoTasks.Infra.Data;
using DS.TodoTasks.Infra.Repositories;
using Microsoft.EntityFrameworkCore;

namespace DS.TodoTasks.API.Configurations
{
    public static class DataConfiguration
    {
        public static void AddDataConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), sql =>
                {
                    sql.MigrationsHistoryTable("__EFMigrationsHistory", "todo");
                    sql.EnableRetryOnFailure();
                });
            });


            // repositories
            services.AddScoped<ITodoTaskRepository, TodoTaskRepository>();
        }

        public static IApplicationBuilder ApplyMigrations(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
            }

            return app;
        }
    }
}
