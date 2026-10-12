# Builder AI

Describe a website or app in plain English and Builder AI writes the React + Tailwind code, shows a live preview in the browser, and lets you refine it through chat. Finished projects can be published to a public link or downloaded as a ZIP.

**Live demo:** https://builder-ai-vmy5.onrender.com

## Features

- **Prompt to project** – the AI plans the file structure, then generates the files in parallel, with live progress.
- **Chat to revise** – ask for changes and the AI edits only the relevant files (create / update / delete operations).
- **Live preview** – runs the generated code in the browser with [Sandpack](https://sandpack.codesandbox.io/), including a file explorer and a full-page preview.
- **Publish & export** – share a public `/publish/:id` page or download the project as a ZIP.
- **Accounts** – email/password sign-up with JWT stored in an httpOnly cookie.

## Tech stack

| Part | Tech |
|------|------|
| Client | React 19, Vite, Tailwind CSS 4, React Router, Sandpack |
| Server | Node.js, Express 5, Mongoose (MongoDB) |
| AI | [Vercel AI SDK](https://sdk.vercel.ai/) with [OpenRouter](https://openrouter.ai/) |

## Project structure

```
builder-ai/
├── client/              # React frontend (Vite)
│   └── src/
│       ├── pages/       # Home, Builder, Preview, Publish, Auth
│       ├── components/  # Chat, preview, file explorer, progress UI
│       └── api/         # Axios instance
└── server/              # Express API
    ├── controllers/     # Auth, projects, chat
    ├── models/          # User, Project
    ├── routes/          # /api/auth, /api/projects
    └── services/        # AI generation, prompts, diffing, validation
```

## Getting started

### Prerequisites

- Node.js 20.19+ (22 recommended)
- A MongoDB database (e.g. a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- An [OpenRouter API key](https://openrouter.ai/keys)

### 1. Configure the server

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/builder-ai
OPENROUTER_API_KEY=sk-or-v1-...
JWT_SECRET=<any long random string>
ORIGINS=http://localhost:5173

# Optional
OPENROUTER_MODEL=openrouter/free
AI_MAX_CONCURRENCY=6
```

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `OPENROUTER_API_KEY` | Yes | OpenRouter API key |
| `JWT_SECRET` | Yes | Secret used to sign login tokens |
| `ORIGINS` | Dev only | Comma-separated list of allowed CORS origins (the Vite dev server) |
| `OPENROUTER_MODEL` | No | Model to use (default `openrouter/free`) |
| `AI_MAX_CONCURRENCY` | No | Max files generated in parallel (default `6`) |
| `PORT` | No | Server port (default `3000`) |

### 2. Configure the client

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

### 3. Install and run

```bash
# Terminal 1 – API
cd server
npm install
npm run dev

# Terminal 2 – frontend
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## API

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | – | Create an account |
| POST | `/api/auth/login` | – | Log in |
| POST | `/api/auth/logout` | – | Log out |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/projects` | ✓ | List your projects |
| POST | `/api/projects` | ✓ | Create a project from a prompt |
| GET | `/api/projects/:id` | ✓ | Get a project |
| DELETE | `/api/projects/:id` | ✓ | Delete a project |
| PUT | `/api/projects/:id/files` | ✓ | Save edited files |
| POST | `/api/projects/:id/chat` | ✓ | Send a revision request |
| POST | `/api/projects/:id/publish` | ✓ | Publish a project |
| GET | `/api/projects/public/:id` | – | Get a published project |
| GET | `/api/health` | – | Health check |

## Deployment

The app is deployed to [Render](https://render.com) as a single web service. In production, Express serves the built client from `client/dist`, so the frontend and API share one origin and `VITE_BASE_URL` / `ORIGINS` are not needed.

| Setting | Value |
|---------|-------|
| Build command | `cd client && npm ci --include=dev && npm run build && cd ../server && npm ci` |
| Start command | `cd server && npm start` |
| Environment | `NODE_ENV=production`, `MONGODB_URI`, `OPENROUTER_API_KEY`, `JWT_SECRET` |

If you use MongoDB Atlas, allow access from `0.0.0.0/0` under **Network Access**, because Render's outbound IPs aren't fixed. Every push to `main` redeploys automatically.
