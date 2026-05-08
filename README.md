# SaaS Starter 🚀

A production-ready, full-stack SaaS boilerplate built as a **Turborepo monorepo**. It ships with authentication, team management, billing, and a polished React frontend — everything you need to launch a SaaS product fast.

---

## ✨ Features

- **Authentication** — Email/password registration & login, email verification, password reset, JWT refresh tokens, and **Google OAuth 2.0**
- **Team Management** — Create teams, invite members by email, role-based access control (`Admin` / `Member`), member removal
- **Billing** — Stripe integration with webhook support for subscription lifecycle events
- **Security** — Helmet headers, CORS, global & per-route rate limiting, HTTP-only cookies
- **Shared Types** — Zod schemas for users, teams, and invites shared between frontend and backend via a local package
- **Developer Experience** — TypeScript everywhere, Turborepo parallel builds, Prettier, hot-reloading in development

---

## 🗂️ Project Structure

```
saas-starter/
├── apps/
│   ├── client/          # React + Vite frontend (TypeScript)
│   └── server/          # Express + Node.js backend (TypeScript)
├── packages/
│   └── shared/          # Shared Zod schemas (user, team, invite)
├── docker-compose.yml   # MongoDB & Redis services
├── turbo.json           # Turborepo pipeline config
└── package.json         # Root workspace & scripts
```

---

## 🛠️ Tech Stack

### Frontend (`apps/client`)
| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework & dev server |
| TypeScript | Type safety |
| React Router v6 | Client-side routing |
| TanStack Query v5 | Server state & data fetching |
| Zustand | Global client state |
| React Hook Form + Zod | Form validation |
| Framer Motion | Animations |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| Axios | HTTP client |

### Backend (`apps/server`)
| Tool | Purpose |
|---|---|
| Express.js | HTTP server & routing |
| TypeScript | Type safety |
| Mongoose | MongoDB ODM |
| Passport.js | Authentication strategies (Local + Google OAuth) |
| JSON Web Tokens | Access & refresh token auth |
| bcrypt | Password hashing |
| ioredis | Redis client (session/cache) |
| Nodemailer | Transactional email |
| Stripe | Payment processing & webhooks |
| Helmet / CORS / Rate Limit | Security middleware |
| Morgan | HTTP request logging |

### Infrastructure
| Tool | Purpose |
|---|---|
| MongoDB | Primary database |
| Redis | Caching / session store |
| Docker Compose | Local database services |
| Turborepo | Monorepo build orchestration |

---

## 📐 API Routes

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Register a new user |
| `POST` | `/verify-email` | Public | Verify email with token |
| `POST` | `/login` | Public | Login and receive tokens |
| `POST` | `/forgot-password` | Public | Request password reset email |
| `POST` | `/reset-password` | Public | Reset password with token |
| `POST` | `/refresh` | Public | Refresh access token |
| `POST` | `/logout` | JWT | Invalidate session |
| `GET` | `/me` | JWT | Get current user profile |
| `GET` | `/google` | Public | Initiate Google OAuth flow |
| `GET` | `/google/callback` | Public | Google OAuth callback |

### Teams — `/api/teams`
| Method | Endpoint | Role | Description |
|---|---|---|---|
| `POST` | `/` | JWT | Create a new team |
| `GET` | `/:id` | Member | Get team details |
| `POST` | `/:id/invite` | Admin | Invite a member by email |
| `DELETE` | `/:id/members/:uid` | Admin | Remove a team member |

### Billing — `/api/billing`
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/webhook` | Stripe webhook receiver (raw body) |

### Health — `/api/health`
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |

---

## 🖥️ Frontend Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Marketing / splash page |
| `/login` | Login | Email/password & Google OAuth login |
| `/register` | Register | New account creation |
| `/app` | Dashboard | Main app dashboard |
| `/app/billing` | Billing | Subscription management |
| `/app/team` | Team Settings | Invite & manage team members |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9
- **Docker** (for MongoDB & Redis)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd saas-starter
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- **MongoDB** on `localhost:27017`
- **Redis** on `localhost:6379`

### 3. Configure Environment Variables

Create `apps/server/.env`:

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/saas-starter

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Run in Development

```bash
npm run dev
```

Turborepo starts both apps in parallel:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🏗️ Building for Production

```bash
npm run build
```

Turborepo builds the server (`tsc`) and client (`tsc && vite build`) respecting dependency order.

---

## 🔧 Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format all `.ts`, `.tsx`, `.md` files with Prettier |

---

## 📦 Shared Package

The `packages/shared` workspace exports Zod validation schemas used by **both** the client and server:

- `user.schema` — User registration & profile validation
- `team.schema` — Team creation & management validation
- `invite.schema` — Member invitation validation

This ensures a single source of truth for data shapes across the stack.

---

## 🔒 Security Highlights

- **Helmet** sets secure HTTP headers
- **Rate limiting** — 100 req/15 min globally; 10 req/15 min on auth endpoints
- **HTTP-only cookies** for refresh tokens (not accessible to JavaScript)
- **bcrypt** password hashing
- **JWT** short-lived access tokens + long-lived refresh tokens
- **Stripe webhook** signature verification with raw body parsing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a Pull Request

---

## 📄 License

MIT
