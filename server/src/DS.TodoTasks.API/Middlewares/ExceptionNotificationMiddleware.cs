using DS.TodoTasks.Domain.Notifications;
using DS.TodoTasks.API.ResultModels;
using System.Net;
using System.Text.Json;

namespace DS.TodoTasks.API.Middlewares
{
    public class ExceptionNotificationMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionNotificationMiddleware> _logger;

        public ExceptionNotificationMiddleware(RequestDelegate next, ILogger<ExceptionNotificationMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, INotificationHandler notifications)
        {
            try
            {
                await _next(context);

                if (notifications.HasNotifications() && context.Response.StatusCode == (int)HttpStatusCode.OK)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    context.Response.ContentType = "application/json";

                    var response = new ApiResult
                    {
                        Succeeded = false,
                        Errors = notifications.GetNotifications().Select(n => new ApiError { Key = n.Key, Message = n.Value }).ToArray()
                    };

                    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro inesperado");

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var response = new ApiResult
                {
                    Succeeded = false,
                    Errors = new[]
                    {
                        new ApiError { Key = "InternalServerError", Message = "Erro inesperado. Tente novamente mais tarde." }
                    }
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
            finally
            {
                notifications.Clear();
            }
        }
    }
}