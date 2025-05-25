using DS.TodoTasks.Domain.Notifications;
using Microsoft.AspNetCore.Mvc;

namespace DS.TodoTasks.API.Controllers
{
    [ApiController]
    public abstract class BaseApiController : ControllerBase
    {
        protected readonly INotificationHandler _notifications;

        protected BaseApiController(INotificationHandler notifications)
        {
            _notifications = notifications;
        }

        protected IActionResult CustomResponse(object? result = null)
        {
            if (_notifications.HasNotifications())
            {
                var errors = _notifications.GetNotifications()
                                           .Select(n => new { Key = n.Key, Message = n.Value })
                                           .ToList();
                return BadRequest(new { Succeeded = false, Errors = errors });
            }

            if (result == null)
                return NoContent();

            return Ok(new { Succeeded = true, Data = result });
        }

        protected IActionResult NotFoundResponse()
        {
            var errors = _notifications.GetNotifications()
                                       .Select(n => new { Key = n.Key, Message = n.Value })
                                       .ToList();
            return NotFound(new { Succeeded = false, Errors = errors });
        }
    }
}
