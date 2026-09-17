# Logic Tech - Enterprise IT Solutions & Engineering

A modern, responsive platform for Enterprise IT Solutions, Custom Software Development, and Cloud Engineering built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4
- React Router v7
- Framer Motion
- React Icons

## Getting Started

```bash
cd logic-tech-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Navbar, Footer, Sidebar, Dashboard layout
│   ├── landing/      # Landing page sections
│   └── shared/       # Charts, page elements
├── pages/
│   ├── auth/         # Login, Register, Forgot/Reset Password
│   ├── client/       # Client dashboard pages
│   ├── admin/        # Admin dashboard pages
│   └── errors/       # 403, 404, 500 pages
├── contexts/         # Theme, Toast providers
├── hooks/            # Custom hooks
├── lib/              # API client, utilities
├── data/             # Mock data
└── types/            # TypeScript types
```

## Features

- Landing page with hero, services, how-it-works, stats, testimonials, FAQ, contact, newsletter
- Authentication pages with glassmorphism design
- Client and Admin dashboards
- Service request form
- Project details with timeline and task checklist
- Real-time messaging interface
- Payment and invoice management
- Settings with theme toggle and 2FA
- Dark/Light mode
- Responsive mobile-first design

## API Integration

The `src/lib/api.ts` file contains a ready-to-use API client. Replace mock data with API calls when connecting to your FastAPI backend.
