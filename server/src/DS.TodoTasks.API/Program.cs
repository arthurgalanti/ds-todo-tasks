using DS.TodoTasks.API.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiConfig(builder.Configuration);
builder.Services.ResolveDependencies(builder.Configuration);
builder.Services.AddDataConfigurations(builder.Configuration);

var app = builder.Build();

app.UseApiConfiguration(app.Environment);
app.UseSwaggerConfig();
app.ApplyMigrations();

var configuration = app.Services.GetRequiredService<IConfiguration>();
Console.WriteLine("Current environment: " + configuration["CurrentEnvironment"]);

app.Run();
