<div align="center">

# 🏠 RentEase

### *Find it. Book it. Rent it — with ease.*

**A full-stack property rental & booking platform for tenants, owners, and admins.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge)](https://rentease-flash.vercel.app)
[![Server Repo](https://img.shields.io/badge/Server-Repository-blue?style=for-the-badge)](https://github.com/nihalxofficial/RentEase-Server)
[![Docker](https://img.shields.io/badge/Docker-Images-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/nihalxofficial/rentease-client)

</div>

<!-- 📸 Add a banner screenshot or GIF of the app here -->
<p align="center">
  <img width="1366" height="953" alt="Banner" src="https://github.com/user-attachments/assets/8a486528-2568-4398-acd7-09f6e1200035" />

</p>

---

## 📑 Table of Contents

- [About](#-about)
- [Project Overview](#-project-overview)
  - [Objective](#objective)
  - [Target Audience](#target-audience)
  - [Platforms Used](#platforms-used)
  - [Deployments](#deployments)
- [Key Features](#-key-features)
- [Tech Stack / npm Packages](#-npm-packages-used)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started-without-docker)
- [Running with Docker](#-running-with-docker)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 📖 About

RentEase started as a **learning project** — a way to go beyond tutorial-following and actually build a full, production-shaped application end to end: real authentication, real payments, role-based dashboards, and a real deployment pipeline (including Docker).

Rather than another basic CRUD app, the goal was to simulate what a real rental marketplace needs to handle in practice: three distinct user roles with different permissions and dashboards, a property approval workflow so listings aren't published unchecked, real Stripe transactions tied to bookings, and analytics for owners to actually understand their earnings.

**What makes it different from a typical rental-listing clone:**
- **Three-sided marketplace, not just a listing site** — Tenant, Owner, and Admin each get a purpose-built dashboard, not a single generic "user panel."
- **Moderation-first listings** — properties don't go live the moment they're added; they pass through an Approve/Reject flow with feedback, so the "All Properties" page only ever shows vetted listings.
- **Real payment-to-booking pipeline** — Stripe payments are tied directly to booking records and transactions, not just a mock "Book Now" button.
- **Owner analytics, not just a property list** — a monthly earnings chart (last 12 months) and summary cards give owners actual insight instead of a bare table.
- **Built and shipped like a real product** — containerized with Docker (published images for both client and server) and deployed live, not just run locally.

---

## 🎯 Project Overview

### Objective
To design and build a complete, realistic rental marketplace — from public browsing and search, through authenticated booking and payment, to full administrative moderation — while practicing production-level concerns like role-based access control, containerized deployment, and clean separation between a Next.js client and a dedicated backend server.

### Target Audience
- **Tenants** looking to browse, compare, and book rental properties online.
- **Property Owners** who want a simple way to list properties, track bookings, and monitor earnings.
- **Admins/Platform Operators** who need to moderate listings, manage users, and oversee platform-wide activity.
- **Developers/Recruiters** reviewing this project as a demonstration of full-stack, role-based, payment-integrated application development.

### Platforms Used
- **Frontend:** Next.js (App Router), React, Tailwind CSS, HeroUI
- **Backend:** Node.js-based server (see [server repository](https://github.com/nihalxofficial/RentEase-Server))
- **Database:** MongoDB Atlas
- **Auth:** better-auth (JWT-based) with Google Social Login
- **Payments:** Stripe
- **Containerization:** Docker (client + server images published to Docker Hub)
- **Hosting:** Vercel (client)

### Deployments
| Component | Link |
|---|---|
| 🌐 Live App | [rentease-flash.vercel.app](https://rentease-flash.vercel.app) |
| 📁 Server Repo | [RentEase-Server](https://github.com/nihalxofficial/RentEase-Server) |
| 🐳 Client Docker Image | [nihalxofficial/rentease-client](https://hub.docker.com/r/nihalxofficial/rentease-client) |
| 🐳 Server Docker Image | [nihalxofficial/rentease-server](https://hub.docker.com/r/nihalxofficial/rentease-server) |

---

## ✨ Key Features

> Only the features that set RentEase apart are listed here — standard auth/CRUD basics are covered later in the docs.

- **Property moderation pipeline** — Admins Approve/Reject listings with a feedback modal; owners can view rejection reasons directly from their "My Properties" table.
- **Stripe-backed booking flow** — Booking a property triggers a real Stripe payment; on success, a booking record *and* a transaction record are created together, with status flowing Pending → Approved/Rejected.
- **Owner earnings analytics** — Recharts-powered line chart of monthly earnings over the last 12 months, plus at-a-glance cards for total earnings, properties, and bookings.
- **Platform-wide transaction ledger** — Admins get a dedicated Transactions view (Transaction ID, property, tenant, owner, amount, date) across the entire platform, not just per-user.
- **Backend-driven search & filtering** — Location, property type, and price sorting on the All Properties page are handled server-side rather than client-side filtering, keeping results accurate at scale.
- **Persistent private sessions** — JWT-protected routes remain accessible after a page reload without incorrectly bouncing users back to Login.
- **Dynamic, review-driven homepage** — Customer reviews, Top Locations, and Rental Stats sections pull real data rather than static placeholder content.
- **Fully animated UX layer** — Framer Motion woven through the banner, property cards, and section reveals for a cohesive, non-static feel across the whole app.

---


## 📦 npm Packages Used

| Package | Purpose |
|---|---|
| `next` | React framework with App Router, SSR, and API routes |
| `react` / `react-dom` | Core UI library |
| `@heroui/react` | Primary component library (HeroUI) |
| `tailwindcss` | Utility-first CSS framework |
| `framer-motion` | Animations — banner, cards, section reveals |
| `next-themes` | Dark / Light theme switcher |
| `better-auth` | Authentication (JWT, social login) |
| `@gravity-ui/icons` | Icon set (Gravity UI) |
| `react-icons` | Extended icon library |
| `lucide-react` | Additional icon set |
| `react-fast-marquee` | Marquee/ticker animations |
| `recharts` | Line charts for Owner analytics dashboard |
| `@stripe/stripe-js` | Stripe payment integration (client-side) |
| `react-toast` | Toast notifications |
| `docker` | Containerized deployment for consistent environments |

---

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages & layouts
│   ├── (public)/         # Home, All Properties, Property Details
│   ├── (auth)/           # Login, Register
│   └── dashboard/        # Tenant, Owner, Admin dashboards
├── components/           # Reusable UI components
│   ├── shared/           # Navbar, Footer, PropertyCard, etc.
│   └── ui/               # Buttons, Modals, Forms
├── lib/                  # Utility functions, auth config
└── styles/               # Global styles
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# Used server-side (API routes, server components, server actions)
API_URL=your_server_base_url

# Used in the browser (client components) — must be reachable from the user's machine
NEXT_PUBLIC_API_URL=your_server_base_url

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=your_app_url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
MONGO_URI=your_mongodb_atlas_connection_string
```

> Never commit `.env.local` to version control.
>
> ⚠️ `NEXT_PUBLIC_*` variables are baked into the JavaScript bundle at **build time**. If you change one, rebuild the app (or Docker image) rather than just restarting it.

---

## 🚀 Getting Started (Without Docker)

```bash
# Clone the repository
git clone https://github.com/nihalxofficial/RentEase-Client.git
cd RentEase-Client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Running with Docker

### Option A — Pull the pre-built image from Docker Hub

No need to clone the repo or install Node — just pull and run the published image directly.

```bash
# Pull the image
docker pull nihalxofficial/rentease-client:v1

# Run it, passing in your environment variables
docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  --name rentease-client \
  nihalxofficial/rentease-client:v1
```

Make sure you have a local `.env.local` file (same folder you run this command from) containing the variables listed above before running this. Since `NEXT_PUBLIC_*` values are baked in at build time, the published image already has whatever values were set when it was built — passing `--env-file` here only affects server-side variables read at runtime (like `API_URL`, `MONGO_URI`, `BETTER_AUTH_SECRET`), not the `NEXT_PUBLIC_*` ones.

The client will be available at [http://localhost:3000](http://localhost:3000).

**Useful commands:**
```bash
docker ps                       # confirm it's running
docker logs -f rentease-client  # view logs
docker stop rentease-client     # stop the container
docker rm rentease-client       # remove the container
```

### Option B — Build the image yourself from source

```bash
git clone https://github.com/nihalxofficial/RentEase-Client.git
cd RentEase-Client

docker build -t rentease-client .
docker run -d -p 3000:3000 --env-file .env.local --name rentease-client rentease-client
```

Building it yourself lets your own `.env.local` values (including `NEXT_PUBLIC_*` ones) get baked into the image at build time.

### Option C — Run client + server together with Docker Compose

Pull both pre-built images from Docker Hub and run them together with a single `docker-compose.yml`:

```yaml
version: "3.9"

services:
  client:
    image: nihalxofficial/rentease-client:v1
    ports:
      - "3000:3000"
    env_file:
      - ./client.env.local
    depends_on:
      - server

  server:
    image: nihalxofficial/rentease-server:v1
    ports:
      - "5000:5000"
    env_file:
      - ./server.env
```

Then run:
```bash
docker compose up -d
```

This starts both containers on the same internal Docker network, so the client can reach the server at `http://server:5000` for server-side calls, while the browser continues to use `http://localhost:5000` (or your deployed server URL) for client-side calls.

---

## 🗺️ Roadmap

<!-- Optional: list planned improvements, e.g. -->
- [ ] In-app messaging between tenants and owners
- [ ] Map-based property search
- [ ] Multi-currency support
- [ ] Automated email notifications for booking status changes

---

## 📄 License

<!-- Add your chosen license, e.g. MIT -->
This project is licensed under the MIT License.
