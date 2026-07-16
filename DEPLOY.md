# Rising Star School — Live Deployment Guide

Deploy **free** using:
- **MongoDB Atlas** — database (cloud)
- **Render** — backend API (`Express`)
- **Vercel** — frontend website (`React`)

---

## Step 1 — MongoDB Atlas (5 min)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a **free M0** cluster
3. **Database Access** → Add user (username + password)
4. **Network Access** → Add IP → **Allow Access from Anywhere** (`0.0.0.0/0`) for Render
5. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/rising-star-school?retryWrites=true&w=majority
   ```

---

## Step 2 — GitHub pe code push karo

```powershell
cd "c:\Users\akibk\Downloads\rising_star (1)\rising-star-school"
git init
git add .
git commit -m "Rising Star School MERN app ready for deploy"
```

GitHub pe new repo banao → push karo (GitHub Desktop ya `git remote add origin ...`).

---

## Step 3 — Backend on Render (API live URL)

1. https://dashboard.render.com → **New +** → **Web Service**
2. Connect your GitHub repo
3. Settings:

| Field | Value |
|-------|--------|
| **Name** | `rising-star-api` |
| **Root Directory** | `Backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance** | Free |

4. **Environment Variables** (add all):

```
NODE_ENV=production
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster...
JWT_SECRET=use_a_long_random_string_min_32_chars
JWT_EXPIRES_IN=7d
COOKIE_EXPIRES_DAYS=7
CLIENT_URL=https://YOUR-APP.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=arkavyn.dev@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM_NAME=Rising Star Public School
ADMIN_NOTIFY_EMAIL=arkavyn.dev@gmail.com
SEED_ADMIN_EMAIL=admin@risingstarschool.edu.in
SEED_ADMIN_PASSWORD=ChangeThisPassword123!
```

5. **Deploy** → wait ~5 min → copy URL:
   `https://rising-star-api.onrender.com`

6. **Render Shell** (one time) — seed school data:
   ```bash
   npm run seed
   npm run seed:patch
   ```

7. Health check: `https://rising-star-api.onrender.com/api/health`

---

## Step 4 — Frontend on Vercel (website live URL)

1. https://vercel.com → login
2. **Add New Project** → import GitHub repo
3. Settings:

| Field | Value |
|-------|--------|
| **Root Directory** | `Frontend` |
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output** | `dist` |

4. **Environment Variable**:

```
VITE_API_URL=https://rising-star-api.onrender.com/api
```

(Apna Render URL lagao — `/api` end me zaroori hai)

5. **Deploy** → copy URL:
   `https://rising-star-school.vercel.app`

---

## Step 5 — Backend me frontend URL update

Render dashboard → **Environment** → update:

```
CLIENT_URL=https://rising-star-school.vercel.app
```

(Apna Vercel URL — no trailing slash)

→ **Manual Deploy** / redeploy backend.

---

## Live URLs (after deploy)

| What | URL |
|------|-----|
| **Website** | `https://YOUR-APP.vercel.app` |
| **Admin login** | `https://YOUR-APP.vercel.app/admin/login` |
| **API** | `https://rising-star-api.onrender.com/api` |

**Admin:** `admin@risingstarschool.edu.in` / `ChangeThisPassword123!`

---

## Notes

- **Render free tier** sleeps after 15 min idle — pehli request ~30 sec slow ho sakti hai
- **Gmail** production me same App Password use karo
- **WhatsApp** optional — email kaafi hai
- Production me **JWT_SECRET** aur admin password change karna

---

## Quick CLI (optional)

```powershell
# Vercel login (browser)
vercel login

cd Frontend
$env:VITE_API_URL="https://rising-star-api.onrender.com/api"
vercel --prod
```
