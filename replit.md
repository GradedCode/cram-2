# CramSmart - Study Session Management App

## Overview
CramSmart is a React-based study application that helps students create timeboxed study guides from their uploaded notes and materials. Students can upload their study materials and get AI-powered, personalized study sessions ranging from 15 minutes to 8 hours.

## Project Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Framework**: shadcn-ui components with Tailwind CSS
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS with custom theme

## Recent Changes (Sept 10, 2025)
- ✅ Configured for Replit environment
- ✅ Updated Vite config to use port 5000 with host 0.0.0.0
- ✅ Set allowedHosts: true to work with Replit's proxy
- ✅ Installed Node.js 20 and all dependencies
- ✅ Configured deployment for autoscale target
- ✅ Set up Frontend workflow

## Project Structure
```
src/
├── components/
│   ├── ui/           # shadcn-ui components
│   ├── CramGuidePreview.tsx
│   ├── TimeboxSelector.tsx
│   └── UploadInterface.tsx
├── pages/
│   ├── Index.tsx     # Main application page
│   └── NotFound.tsx
├── hooks/
├── lib/
└── assets/
```

## Development
- **Dev Server**: `npm run dev` (port 5000)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Deployment Configuration
- **Target**: Autoscale (for stateless frontend)
- **Build Command**: `npm run build`
- **Run Command**: `npm run preview -- --host 0.0.0.0 --port 5000`

## Features
- Upload study materials (notes, past papers)
- AI-powered study guide generation
- Timeboxed study sessions (15min - 8hrs)
- Responsive design with modern UI
- Progress tracking and adaptive timing

## Current State
✅ **WORKING** - Application is running successfully on port 5000 and accessible through Replit's web preview.