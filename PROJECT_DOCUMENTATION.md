# Health Hub Portal - Project Documentation

This document provides a comprehensive overview of the architecture, technologies, and file structure used in the Health Hub Portal full-stack application.

---

## 🏗️ Architecture Overview

The project is built as a unified full-stack mono-repository. 
- **Frontend:** A modern Single Page Application (SPA) built with React and Vite.
- **Backend:** A robust REST API built with Node.js, Express, and MongoDB.

The application uses a clear separation of concerns, communicating strictly via HTTP REST endpoints.

---

## 💻 Frontend (Client)

The frontend is designed for speed, accessibility, and a modern "glassmorphism" aesthetic.

### Core Technologies
- **Framework:** React 18 powered by Vite for lightning-fast HMR and building.
- **Language:** TypeScript for strict type-safety.
- **Routing:** `wouter` - A minimalist, hook-based routing library.
- **Data Fetching:** `@tanstack/react-query` handles caching, background updates, and state management for API calls.

### Styling & UI
- **CSS Framework:** Tailwind CSS for utility-first styling.
- **Component Library:** `shadcn/ui` (built on top of Radix UI primitives) provides accessible, unstyled components that are styled via Tailwind.
- **Animations:** `framer-motion` and `tailwindcss-animate` for smooth transitions and micro-interactions.
- **Icons:** `lucide-react` and `react-icons`.

### Forms & Validation
- **Forms:** `react-hook-form` for performant, uncontrolled form state management.
- **Validation:** `zod` for strict schema-based form validation (e.g., patient booking forms).

### Key Directories (`client/src/`)
- `/pages` - Top-level route components (`Home`, `BookTest`, `Reports`, `OwnerDashboard`, `Login`).
- `/components` - Reusable UI components (buttons, dialogs, form elements).
- `/hooks` - Custom React hooks (e.g., `use-lab.ts` for lab-specific business logic).
- `/lib` - Utility functions and API configurations.

---

## ⚙️ Backend (Server)

The backend is built to be stateless (mostly), scalable, and robust enough to handle file uploads and background tasks.

### Core Technologies
- **Framework:** Node.js with Express.js.
- **Language:** TypeScript (compiled to CommonJS for production).
- **Database:** MongoDB, managed via `mongoose` ODM. Includes `mongoose-sequence` for auto-incrementing booking IDs.
- **Authentication:** JWT (JSON Web Tokens) combined with `bcryptjs` for secure password hashing. Owner sessions are managed via `express-session`.

### Key Services
- **File Storage (Cloudinary):** 
  Because PaaS providers like Render use *ephemeral filesystems*, local uploads are deleted on server restarts. We use `cloudinary` and `multer-storage-cloudinary` to stream PDF report uploads directly to a permanent cloud bucket.
- **Email Service (EmailJS HTTP API):** 
  To bypass Render's strict blocking of outbound SMTP ports (465/587) on free tiers, we use the `EmailJS` REST API via Node `fetch()`. This allows the server to securely send booking confirmations and report links via port 443 (HTTPS) without exposing API keys to the frontend.
- **Cron Jobs:** 
  `node-cron` runs background tasks (like checking for upcoming appointments and flagging reminders).

### Key Directories (`server/`)
- `/models` - Mongoose database schemas (`Booking`, `Test`, `User`).
- `/controllers` - Business logic for handling API requests (`bookingController`, `authController`).
- `/middleware` - Express middlewares (e.g., `uploadMiddleware.ts` for Cloudinary PDF routing, and authentication guards).
- `/utils` - Helpers (e.g., `bookingHelper.ts` for generating custom `BKG-` IDs).
- `mailer.ts` - Centralized EmailJS HTTP wrapper.
- `index.ts` - The main Express application entry point, routing setup, and MongoDB connection.

---

## 🚀 Deployment & Environment

The application is configured to be deployed as two separate services or as a single unit depending on the platform.

### Environment Variables (.env)
The project relies on specific environment variables to function in production:
1. **Database:** `MONGO_URI`
2. **Security:** `JWT_SECRET`, `SESSION_SECRET`, `OWNER_USERNAME`, `OWNER_PASSWORD`
3. **Cloudinary (Storage):** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. **EmailJS (Notifications):** `EMAILJS_SERVICE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_TEMPLATE_BOOKING`, `EMAILJS_TEMPLATE_REPORT`
5. **CORS/Routing:** `FRONTEND_URL`

### Platform Notes
- **Frontend (Vercel):** The `/client` directory is built via `vite build` and served statically. A `sitemap.xml` is included in `/public` for SEO.
- **Backend (Render):** The Node API is deployed as a Web Service. It requires the `FRONTEND_URL` environment variable to ensure CORS accepts requests from the Vercel frontend, and to spoof the `Origin` header for the EmailJS API.
