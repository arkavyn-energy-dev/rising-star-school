# Rising Star Public School — Website (MERN Stack)

Production-grade school website rebuilt on the MERN stack (MongoDB, Express,
React, Node.js), replacing the original Next.js version. All school content
(faculty, events, fees, admissions info, etc.) is preserved — only the
technology stack and architecture have changed.

## Project Structure

```
rising-star-school/
├── Backend/     # Express REST API + MongoDB (see Backend/README.md)
└── Frontend/    # React (Vite) client — coming next
```

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Framer Motion, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT (httpOnly cookie) + bcrypt
- **Security:** helmet, cors, express-rate-limit, express-mongo-sanitize, express-validator
- **Media:** Cloudinary (image hosting)
- **Email:** Nodemailer (admission/contact form notifications)

## Getting Started

See `Backend/README.md` for backend setup instructions. Frontend setup
instructions will be added once the `Frontend/` folder is scaffolded.
