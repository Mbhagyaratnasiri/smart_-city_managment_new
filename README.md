# Smart City Application

This repository contains a full-stack React and Express application for smart city management. It includes user pages (search cities, report issues), an AI-powered admin dashboard for managing cities and reports, and AI tools for analysis and assistance.

## Features
- **City Management**: View, add, edit, delete cities with population data.
- **Issue Reporting**: Users can submit reports about city issues.
- **Admin Dashboard**: Full CRUD for cities and reports, with AI analysis for reports.
- **AI Tools**: 
  - AI-powered report analysis (categorization, priority, suggestions).
  - Predictive analytics for potential issues.
  - Conversational AI chatbot for smart city queries.
- **Authentication**: Simple login for admin access (admin/admin).

## Tech Stack
- **Frontend**: React, React Router, CSS
- **Backend**: Express.js, JSON file storage
- **AI**: Mock AI responses (can be upgraded to real AI APIs)

## Run Locally
1. Ensure Node.js (16+) and npm are installed.
2. Install dependencies for both frontend and backend:

```powershell
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

3. Start the backend server:

```powershell
cd server
npm start
```

4. In a new terminal, start the frontend:

```powershell
npm start
```

The app will run on `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

## Usage
- Visit the home page to search cities and use the AI chatbot.
- Login as admin (username: admin, password: admin) to access the dashboard.
- In the dashboard, manage cities and reports, and use AI analysis for insights.

## Deploying
- **Backend**: Deploy the `server` folder as a Node.js app on Railway, Render, or Heroku.
- **Frontend**: Deploy the root React app to Vercel or Netlify.
- Set `REACT_APP_API_URL` to your deployed backend URL (for example `https://your-backend.example.com/api`).

## Notes
- Data is stored in JSON files for simplicity; for production, use a database.
- AI features are mocked; integrate with OpenAI or similar for real AI.
- `.env.example` shows the env var you need for the frontend to call your deployed backend.

