# 📋 API de Gerenciamento de Tarefas

Este projeto é uma aplicação de gerenciamento de tarefas desenvolvida em **ASP.NET Core Web API**, com **React** para o frontend, utilizando **Docker** para orquestração do ambiente. O objetivo é permitir o CRUD (Criar, Ler, Atualizar e Deletar) de tarefas, com filtros e validações específicas.

---

## 🚀 Funcionalidades

✅ CRUD de tarefas  
✅ Filtro por título e descrição  
✅ Filtro por status (Pendente, EmProgresso, Concluída)  
✅ Validações de dados:
- Título obrigatório (máx. 100 caracteres)
- Data de conclusão não pode ser anterior à data de criação 

✅ API documentada com **Swagger**  
✅ Frontend React consumindo a API  
✅ Orquestração completa com **Docker**

---

## 📂 Estrutura do Projeto

- **Domain**: Entidades e regras de negócio  
- **Application**: Interfaces e serviços de lógica de aplicação  
- **Infra**: Persistência com SQL Server (ORM Entity Framework Core)  
- **API**: Controllers e endpoints HTTP

---

## 🐳 Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado  
- Opcional: [Git](https://git-scm.com/) para clonar o repositório

---

## ⚙️ Como Executar o Projeto

### 🔥 1. Clonar o Repositório

```bash
git clone https://github.com/arthurgalanti/ds-todo-tasks.git
cd ds-todo-tasks
```

### 🔥 2. Iniciar o Ambiente com Docker
* Certifique-se de que o Docker está em execução antes de iniciar o projeto.

Usando o script **```.bat```** (Windows)

Execute o arquivo  localizado na pasta raiz do projeto:

**```start-compose.bat```**

Ou manualmente (Windows/Linux/Mac)

**```docker compose -f docker-compose.yml up --build -d```**

## 🔗 Acessos da Aplicação

* O SQL, backend e frontend estão configurados para iniciar automaticamente com o Docker Compose nas portas:

    - SQL Server: ```localhost:1433```

    - Swagger (Documentação da API): ```http://localhost:8080/api/docs```

    - Frontend React (Gerenciamento de Tarefas): ```http://localhost:3000```

## 🧱 Requisitos Técnicos

* Validações:

    - Título obrigatório e até 100 caracteres

    - Data de conclusão ≥ Data de criação

* Tratamento de Erros: Respostas HTTP adequadas (**```400```**, **```404,```** ,**```500```**)