# IMA Portfolio CMS - Product Requirements Document

## Original Problem Statement
Build a fully exportable, self-hostable portfolio website with a custom admin dashboard (WordPress-like CMS) for a creative professional and future agency called IMA.

## User Personas
1. **Creative Professional (IMA Owner)**: Needs to showcase graphic design, video editing, social media management, and AI automation services
2. **Potential Clients**: Looking for creative services, viewing portfolio and contact information
3. **Future Team Members**: Will need role-based access to manage content

## Core Requirements (Static)
- Next.js + Tailwind CSS frontend
- Supabase (PostgreSQL + Auth) backend
- Dark-mode first design with brand colors (Red #E10600 on Black #0B0B0B)
- Self-hostable, no vendor lock-in
- WordPress-like admin dashboard

## What's Been Implemented (Feb 2, 2026)

### Public Website
- [x] Homepage with hero, services, featured work, CTA sections
- [x] Portfolio page with category filters and embedded media support
- [x] Services page with all 4 service categories
- [x] About page with story and values
- [x] Contact page with form (saves to database when Supabase configured)
- [x] Responsive navigation with mobile menu
- [x] Footer with social links

### Admin Dashboard
- [x] Admin login with Supabase Auth integration
- [x] Dashboard overview with stats
- [x] Portfolio Manager (CRUD)
- [x] Content Editor
- [x] Navigation Manager
- [x] Social Links Manager
- [x] Messages viewer
- [x] Settings page

### Technical
- [x] Mock data system for demo when Supabase not configured
- [x] SQL schema file for Supabase setup
- [x] Environment variable configuration
- [x] Deployment-ready (Vercel/Netlify compatible)

## Prioritized Backlog

### P0 (Critical) - DONE
- Basic public pages ✓
- Admin dashboard structure ✓
- Supabase integration ready ✓

### P1 (High Priority) - Next
- Image upload to Supabase Storage
- SEO metadata editing per page
- Email notifications for contact form (when email service added)

### P2 (Medium Priority)
- Pages manager (create custom pages)
- Blog/News section
- Analytics dashboard
- Multi-language support

### P3 (Future/Agency Scale)
- Multiple staff accounts
- Role-based access control (Admin, Designer, Editor, Manager)
- Team member profiles
- Department/service sub-pages
- Client portal

## Next Tasks
1. User to configure Supabase credentials
2. Run SQL schema in Supabase
3. Create first admin account
4. Add real portfolio content via admin dashboard
