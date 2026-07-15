# Rising Star Public School — Backend (Express + MongoDB)

Secure REST API powering the Rising Star Public School website. Replaces the old
static Next.js `content.ts` file with a real MongoDB-backed, admin-manageable
data layer.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (httpOnly cookie) + bcryptjs for admin authentication
- Cloudinary for image storage
- Nodemailer for email notifications
- helmet, cors, express-rate-limit, express-mongo-sanitize, express-validator for security

## Setup

```bash
cd Backend
npm install
cp .env.example .env   # then fill in real values (Mongo URI, JWT secret, Cloudinary, email)
npm run seed           # loads existing school content + creates the first admin account
npm run dev            # starts the API on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## Environment Variables

See `.env.example` for the full list. At minimum for local development you need:

- `MONGO_URI` — MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — your frontend's URL (for CORS)
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — used once by `npm run seed` to create your first admin login

Cloudinary and Email variables are optional for local testing — image uploads and
email notifications will simply be skipped (with a console warning) until configured.

### Email & WhatsApp notifications

When `EMAIL_USER` and `EMAIL_PASS` are set (Gmail App Password recommended), the system sends:

- **Admin alerts** to `ADMIN_NOTIFY_EMAIL` on every new admission enquiry, teacher application, online test submission, and contact message
- **User confirmations** when forms are submitted
- **Status updates** when admin marks admission as contacted/resolved, teacher app as shortlisted/rejected/hired, or test attempt as selected/rejected

When Twilio keys are set, SMS and WhatsApp messages are sent alongside email for the same events.

```bash
# After editing Backend/.env, restart the backend:
npm run dev
```

## Folder Structure

```
Backend/
├── config/        # DB + Cloudinary connections
├── models/        # Mongoose schemas
├── controllers/    # Request handlers (business logic)
├── routes/         # Express route definitions
├── middleware/      # auth, error handling, rate limiting, file upload
├── validators/       # express-validator rule sets
├── utils/            # helpers (JWT, email, async wrapper, Cloudinary upload)
├── seed/              # one-time data seeding script
└── server.js           # app entry point
```

## API Overview

| Resource | Public | Admin-only |
|---|---|---|
| `/api/auth` | `POST /login` | `POST /logout`, `GET /me` |
| `/api/faculty` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/events` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/gallery` | `GET /` | `POST /`, `DELETE /:id` |
| `/api/testimonials` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/announcements` | `GET /` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/settings` | `GET /` | `PUT /` |
| `/api/admissions` | `POST /` | `GET /`, `PATCH /:id`, `DELETE /:id` |
| `/api/careers` | `POST /` (teacher applications) | `GET /`, `PATCH /:id`, `DELETE /:id` |
| `/api/tests` | `GET /`, `POST /:id/attempts` | `POST /`, `PUT /:id`, `DELETE /:id` |
| `/api/test-attempts` | — | `GET /`, `PATCH /:id`, `DELETE /:id` |
| `/api/contact` | `POST /` | `GET /`, `PATCH /:id`, `DELETE /:id` |
| `/api/newsletter` | `POST /` | `GET /` |

All admin-only routes require a valid JWT (set automatically as an httpOnly cookie after `/api/auth/login`).

## Security Measures Implemented

- Passwords hashed with bcrypt (12 salt rounds), never returned in API responses
- JWT stored in an httpOnly, sameSite cookie (not accessible to JS — mitigates XSS token theft)
- Role-based access control (`admin`, `superadmin`)
- Rate limiting: strict on `/api/auth/login`, moderate on public form submissions, baseline on all `/api` routes
- `express-mongo-sanitize` strips NoSQL injection operators from input
- `express-validator` validates and normalizes every public/admin input
- `helmet` sets secure HTTP headers; `cors` restricted to the configured frontend origin only
- Centralized error handler never leaks stack traces outside development mode
