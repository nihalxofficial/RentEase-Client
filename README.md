# RentEase — Property Rental & Booking Platform

RentEase is a full-stack property rental and booking platform where tenants can discover, favourite and book rental properties, owners can list and manage their properties and admins can moderate the entire platform. This repository contains the **frontend (client-side)** codebase built with Next.js.

🌐 **Live URL:** [https://rentease-flash.vercel.app](https://rentease-flash.vercel.app)

📁 **Server Repository:** [https://github.com/nihalxofficial/RentEase-Server](https://github.com/nihalxofficial/RentEase-Server)

🐳 **Docker Images:**
- Client: [hub.docker.com/r/nihalxofficial/rentease-client](https://hub.docker.com/r/nihalxofficial/rentease-client)
- Server: [hub.docker.com/r/nihalxofficial/rentease-server](https://hub.docker.com/r/nihalxofficial/rentease-server)

---

## Key Features

### Authentication & Authorization
- Email/password registration with name, photo and secure password
- Google Social Login (role auto-assigned as Tenant)
- JWT-based authentication on all protected routes
- Role-based route protection for Tenant, Owner and Admin
- Private routes stay accessible on page reload without redirecting to Login

### Public Pages
- **Home Page** — animated banner with search (Location, Property Type, Min/Max Price), featured properties (6 via DB limit), Why Choose Us, dynamic customer reviews and extra sections (Top Locations, Rental Stats, Recently Added)
- **All Properties Page** — 3-column grid of approved properties with search by location, filter by property type and price sorting (low→high / high→low) — all handled on the backend
- Framer Motion animations on banner, featured properties and review sections

### Property Details (Private)
- Add to Favourites (saved to DB, visible in Tenant Dashboard)
- Book Property modal — Move-in Date, Contact Number, additional notes
- Stripe payment integration — creates booking record and transaction on success
- Booking status flow: Pending → Approved / Rejected
- Review system — star rating + written review with name, email, date display

### Tenant Dashboard
- My Bookings — table with property name, booking date, amount paid, booking status, payment status
- Favourites — saved properties with Remove action
- Profile page

### Owner Dashboard
- Analytics cards — Total Earnings, Total Properties, Total Bookings
- Monthly Earnings chart (Recharts line chart, last 12 months)
- Add Property — full form with title, description, location, type, pricing (rent type: Monthly/Weekly/Daily), bedrooms, bathrooms, size, amenities, images
- My Properties — table with Update/Delete actions, status column (Pending/Approved/Rejected), rejection feedback viewable via status button
- Booking Requests — Approve or Reject incoming bookings

### Admin Dashboard
- All Users — full users table with Change Role action
- All Properties — Approve, Reject (with feedback modal), Update, Delete
- All Bookings — platform-wide booking activity monitor
- Transactions — Transaction ID, Property Name, Tenant Name, Owner Name, Amount, Date

### UI/UX
- Fully responsive — mobile, tablet and desktop
- Consistent colour theme and typography across all pages and dashboard
- Uniform card/grid layout with equal image sizes
- Dark / Light theme toggle via next-themes
- Loading page and custom Error page
- Framer Motion animations throughout
- Pagination on minimum 2 pages

---

## npm Packages Used

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

## Project Structure

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

## Environment Variables

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

## Getting Started (Without Docker)

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

## Running with Docker

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
