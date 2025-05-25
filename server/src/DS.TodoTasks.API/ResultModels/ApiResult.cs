namespace DS.TodoTasks.API.ResultModels
{
    public class ApiResult
    {
        public bool Succeeded { get; set; }
        public object Data { get; set; }
        public IEnumerable<ApiError> Errors { get; set; }
    }
}
