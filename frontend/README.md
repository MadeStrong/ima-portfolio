# IMA Portfolio CMS

A fully exportable, self-hostable portfolio website with a WordPress-like admin dashboard for creative professionals and agencies.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Ready for Vercel/Netlify (frontend) + Supabase (backend)

## Features

### Public Website
- **Home**: Hero section, services overview, featured portfolio
- **Portfolio**: Grid gallery with category filters (Graphics, Video, Social Media, AI Automation)
- **Services**: Detailed service pages with CTAs
- **About**: Agency story and values
- **Contact**: Contact form with database storage and newsletter signup

### Admin Dashboard
- **Dashboard**: Stats overview and quick actions
- **Portfolio Manager**: Create, edit, delete portfolio items with media embeds
- **Content Editor**: Edit all text content across the site
- **Navigation Manager**: Manage menu items
- **Social Links Manager**: Manage social media profile links
- **Messages**: View and manage contact form submissions
- **Settings**: Site branding, logo, colors

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn package manager
- Supabase account (free tier works)

### 1. Clone and Install

```bash
cd frontend
yarn install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your Project URL and anon public key
4. Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Setup Database

1. Go to your Supabase project → SQL Editor
2. Run the SQL from `supabase-schema.sql` to create all tables and policies

### 4. Run Development Server

```bash
yarn dev
```

Visit `http://localhost:3000`

### 5. Create Admin User

1. Go to `/admin/login`
2. Click "Don't have an account? Sign up"
3. Create your admin account
4. Verify your email if required

## Deployment

### Vercel (Recommended for Frontend)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Netlify

1. Build command: `yarn build`
2. Publish directory: `.next`
3. Add environment variables as above

## Brand Guidelines

- **Primary Color**: `#E10600` (Red)
- **Background**: `#0B0B0B` (Black)
- **Surface**: `#1F1F1F` (Dark Gray)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#B3B3B3` (Gray)
- **Fonts**: Space Grotesk (headings), Inter (body)

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── portfolio/      # Portfolio page
│   │   ├── services/       # Services page
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── PortfolioGrid.tsx
│   │   └── ContactForm.tsx
│   └── lib/                # Utilities
│       ├── supabase.ts     # Supabase client
│       ├── types.ts        # TypeScript types
│       ├── mock-data.ts    # Demo data
│       └── utils.ts        # Helper functions
├── supabase-schema.sql     # Database schema
├── .env.local              # Environment variables
└── package.json
```

## License

This project is fully exportable and self-hostable. No vendor lock-in.
