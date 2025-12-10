# Flipr Placement - Fullstack Task (Completed)

This repository implements the Flipr full-stack task:
- Landing page with Projects, Clients, Contact form, Newsletter subscription.
- Admin panel to manage Projects/Clients and view Contact/Subscribers.
- Backend: Node.js + Express + MongoDB Atlas (Mongoose), image upload & cropping with Multer + Sharp.
- Frontend: React + Vite (single-page with hash routing).

## Quick setup (local development)

### Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas cluster (free tier) and connection string (URI)

### Backend
1. Copy `.env.example` to `.env` in the `backend/` folder and fill values:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   ```
2. Start backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend runs on port 4000 by default.

3. Create an admin user (one-time) using the API (or use MongoDB directly):
   ```bash
   curl -X POST http://localhost:4000/api/setup-admin -H "Content-Type: application/json" -d '{"username":"admin","password":"password"}'
   ```

### Frontend
1. Start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on port 3000 and proxies `/api` to backend.

### Usage
- Visit `http://localhost:3000` for the landing page.
- Visit `http://localhost:3000/#admin` for admin login and panel.
- Admin login requires token obtained from `/api/login` (created via `/api/setup-admin`).

## API Endpoints (summary)
- `POST /api/setup-admin` - create admin (username, password)
- `POST /api/login` - login -> returns JWT token
- `GET /api/projects` - list projects
- `POST /api/projects` - create project (auth, form-data: name, description, image)
- `DELETE /api/projects/:id` - delete project (auth)
- `GET /api/clients` - list clients
- `POST /api/clients` - create client (auth, form-data: name, designation, description, image)
- `DELETE /api/clients/:id` - delete client (auth)
- `POST /api/contact` - submit contact form (json)
- `GET /api/contacts` - list contact responses (auth)
- `POST /api/subscribe` - add newsletter subscriber (json)
- `GET /api/subscribers` - list subscribers (auth)
- Static files: `GET /uploads/<file>`

## Notes
- Images uploaded via admin are cropped to 450x350 and served from `/uploads`.
- For deployment: set `MONGO_URI` and `JWT_SECRET` environment variables on the hosting platform.

Good luck with your submission!
