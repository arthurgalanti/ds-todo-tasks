using DS.TodoTasks.Domain.Notifications;
using DS.TodoTasks.Application.DTOs;
using DS.TodoTasks.Application.Interfaces;
using DS.TodoTasks.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace DS.TodoTasks.API.Controllers
{
    [ApiController]
    [Route("api")]
    public class TodoTasksController : BaseApiController
    {
        private readonly ITodoTaskService _todoTaskService;

        public TodoTasksController(ITodoTaskService todoTaskService, INotificationHandler notifications) : base(notifications)
        {
            _todoTaskService = todoTaskService;
        }

        [HttpGet("task/{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _todoTaskService.GetByIdAsync(id);
            if (task == null)
            {
                _notifications.AddNotification("TaskNotFound", $"Tarefa com ID {id} não encontrada.");
                return NotFoundResponse();
            }

            return CustomResponse(task);
        }

        [HttpGet("tasks")]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _todoTaskService.GetAllAsync();

            return CustomResponse(tasks);
        }

        [HttpPost("task")]
        public async Task<IActionResult> Create([FromBody] CreateTodoTaskDto dto)
        {
            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState)
                {
                    var key = error.Key;
                    var errorMessage = error.Value.Errors.FirstOrDefault()?.ErrorMessage;
                    if (errorMessage != null)
                        _notifications.AddNotification(key, errorMessage);
                }
                return CustomResponse();
            }

            var created = await _todoTaskService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, new { Succeeded = true, Data = created });
        }

        [HttpPut("task/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTodoTaskDto dto)
        {
            if (id != dto.Id)
            {
                _notifications.AddNotification("IdMismatch", "ID da rota e do corpo não conferem.");
                return CustomResponse();
            }

            var existingTask = await _todoTaskService.GetByIdAsync(id);
            if (existingTask == null)
            {
                _notifications.AddNotification("TaskNotFound", $"Tarefa com ID {id} não encontrada.");
                return NotFoundResponse();
            }

            var updated = await _todoTaskService.UpdateAsync(dto);

            return CustomResponse(updated);
        }

        [HttpDelete("task/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _todoTaskService.DeleteAsync(id);
            if (!result)
            {
                _notifications.AddNotification("TaskNotFound", $"Tarefa com ID {id} não encontrada.");
                return NotFoundResponse();
            }

            return NoContent();
        }
    }
}