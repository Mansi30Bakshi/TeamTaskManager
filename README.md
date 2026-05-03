# Team Task Manager

A web app for teams to manage projects and tasks. Built with MERN stack.

## Live Demo

[https://teamtaskmanager-production-42bc.up.railway.app](https://teamtaskmanager-production-42bc.up.railway.app)

## What it does

- Signup / Login
- Create projects
- Add team members (Admin only)
- Create tasks with due date & priority
- Update task status (To Do / In Progress / Done)
- Dashboard shows total tasks, overdue tasks, status breakdown

## Tech Stack

- Backend: Node.js, Express, MongoDB, JWT
- Frontend: React (Vite), React Router, Axios, plain CSS

## Run locally

### Backend

```bash
cd backend
npm install
Create .env file:

text
MONGO_URI=mongodb+srv://MansiBakshi:021203@cluster0.wg3ulgb.mongodb.net/
JWT_SECRET=mansi_super_secret_key_2026
PORT=5001
Run:

bash
npm run dev
Frontend
bash
cd frontend
npm install
npm run dev
Open http://localhost:5173

API Endpoints
Auth
POST /api/auth/signup - register

POST /api/auth/login - login

GET /api/auth/me - get current user

Projects
POST /api/projects - create project

GET /api/projects - get my projects

POST /api/projects/:id/members - add member (admin only)

GET /api/projects/:id/members - list members

Tasks
POST /api/tasks - create task

GET /api/tasks/project/:id - get tasks of a project

PUT /api/tasks/:id - update task

DELETE /api/tasks/:id - delete task (admin only)

Dashboard
GET /api/dashboard - get stats

Role Based Access
Action	Admin	Member
Create project	✅	✅
Add members	✅	❌
Create task	✅	✅
Edit any task	✅	❌
Update own task status	✅	✅
Delete task	✅	❌
Deployment
Deployed on Railway. Backend and frontend are separate services.

Author
Mansi Bakshi

GitHub: @Mansi30Bakshi
