# Library Management System

A full-stack web app to manage a library's books, members and loans, with login and role-based access. It's deployed on Azure.
**Live demo:** https://happy-forest-0a52c2b00.1.azurestaticapps.net

## Features
- Books: create, edit, delete, list (Admin edits; Librarian views)
- Members: create, edit, list (Admin can delete)
- Loans: borrow and return with automatic copy counts, due dates, and overdue status
- JWT authentication with **Admin** and **Librarian** roles
- Admin-only user management: Create and delete users
- Server-side validation and clear error messages

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, axios, Context API |
| Backend | ASP.NET Core Web API (.NET 10), C# |
| Data | Entity Framework Core, SQL Server , Azure SQL|
| Auth | JWT bearer tokens, role-based authorization, hashed passwords |
| Hosting | Azure Static web Apps(frontend), Azure App Service(API) |
| CI/CD | GitHub Actions deploys the frontend on every push |


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

## Next steps
- Unit and integration tests
- Pagination and search
- Logging and monitoring with Application Insights
