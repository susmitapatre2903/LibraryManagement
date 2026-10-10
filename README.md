# Library Management System

A full-stack library management app: staff log in, manage books and members, and track loans.

## Features
- JWT authentication with **Admin** and **Librarian** roles
- Books: create, edit, delete, list (Admin edits; Librarian views)
- Members: create, edit, list (Admin can delete)
- Loans: borrow and return with automatic copy counts, due dates, and overdue status
- User management (Admin only)
- Server-side validation and clear error messages

## Tech stack
| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Web API (.NET 10), C# |
| Data | Entity Framework Core, SQL Server |
| Auth | JWT bearer tokens, role-based authorization, hashed passwords |
| Frontend | React (Vite), React Router, axios |

## Run locally
**Requirements:** .NET 10 SDK, Node.js 22+, SQL Server LocalDB

1. **Backend**
   - Set a JWT key in user secrets (at least 32 characters):
     `dotnet user-secrets set "Jwt:Key" "<your-long-random-key>" --project LibraryManagement.Api`
   - Apply migrations: `dotnet ef database update --project LibraryManagement.Api`
   - Start the API: `dotnet run --project LibraryManagement.Api`
2. **Frontend**
   - `cd library-client`
   - `npm install`
   - `npm run dev`
   - Open http://localhost:5173

## Project structure
```
LibraryManagement.Api/   Controllers, Models, Data (DbContext, Migrations), Services
library-client/          React app (pages, auth context, axios setup)
```

## Roadmap
- Unit and integration tests
- Service layer
- Deployment to Azure (App Service, Azure SQL, Static Web Apps)
