# CramSmart - Study Panic-Proof

## Overview
CramSmart is a React-based web application that helps students create personalized, timeboxed study guides from uploaded notes and materials. Built with modern web technologies including React, TypeScript, Vite, and shadcn-ui components.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn-ui components with Tailwind CSS
- **State Management**: React hooks with TanStack Query
- **Routing**: React Router DOM
- **Build Tool**: Vite with SWC for fast compilation
- **Package Manager**: npm

## Key Features
- File upload interface for study materials
- Timeboxed study sessions (15 minutes to 8 hours)
- AI-powered study guide generation
- Responsive design with modern UI components
- Multi-step workflow for creating study plans

## Development Setup
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows proxy access)
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build`

## Recent Changes
- Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- Set up development workflow
- Configured deployment for autoscale hosting
- Installed Node.js 20 and project dependencies

## Deployment
- **Target**: Autoscale (stateless frontend)
- **Build**: npm run build
- **Run**: npm run preview with proper host/port configuration
- Ready for Replit deployment when needed