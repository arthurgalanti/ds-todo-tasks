FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["DS.TodoTasks.Application/DS.TodoTasks.Application.csproj", "DS.TodoTasks.Application/"]
COPY ["DS.TodoTasks.Infra/DS.TodoTasks.Infra.csproj", "DS.TodoTasks.Infra/"]
COPY ["DS.TodoTasks.Domain/DS.TodoTasks.Domain.csproj", "DS.TodoTasks.Domain/"]
COPY ["DS.TodoTasks.API/DS.TodoTasks.API.csproj", "DS.TodoTasks.API/"]

RUN dotnet restore "DS.TodoTasks.API/DS.TodoTasks.API.csproj"

COPY . .
WORKDIR "/src/DS.TodoTasks.API"

FROM build AS publish
RUN dotnet publish "DS.TodoTasks.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "DS.TodoTasks.API.dll"]