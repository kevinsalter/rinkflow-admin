# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RinkFlow Admin is a Next.js 15.4.6 admin dashboard application for event management and ticketing, built with TypeScript, React 19, and Tailwind CSS v4. The UI is based on the Catalyst theme from Tailwind UI.

## Essential Commands

```bash
# Development
bun dev        # Start development server with Turbopack

# Build & Production
bun run build  # Create production build
bun start      # Run production server

# Code Quality
bun lint       # Run ESLint checks
```

Package manager: **Bun** (bun.lock present)

## Architecture

### Tech Stack
- **Next.js 15.4.6** with App Router
- **React 19.1.0** with TypeScript
- **Tailwind CSS v4.1.11** with custom theme
- **Headless UI 2.2.7** for accessible components
- **Framer Motion 12.23.12** for animations

### Project Structure
```
src/
├── app/
│   ├── (app)/          # Main application routes (events, orders, settings)
│   ├── (auth)/         # Authentication routes (login, register, forgot-password)
│   └── layout.tsx      # Root layout with Inter font
├── components/         # 26 reusable UI components
├── data.ts            # Mock data layer (to be replaced with API)
└── styles/
    └── tailwind.css   # Tailwind configuration
```

### Key Patterns

**Route Groups**: Uses `(app)` and `(auth)` groups for logical separation without affecting URLs.

**Component System**: All components in `src/components/` follow consistent patterns:
- TypeScript interfaces for props
- Headless UI for accessibility
- Tailwind classes with clsx for conditional styling
- Consistent use of Heroicons

**Data Flow**: Currently using mock data from `src/data.ts`. When implementing features:
1. Define TypeScript interfaces for data models
2. Update mock data for development
3. Plan for API integration

**Layout Architecture**: 
- Sidebar-based admin layout in `(app)/layout.tsx`
- Authentication layout in `(auth)/layout.tsx`
- Responsive design with mobile support

### Development Guidelines

**Path Imports**: Use `@/*` alias for imports from src directory (configured in tsconfig.json).

**Styling**: Use Tailwind CSS v4 utilities. Custom theme colors and styles are defined in the Tailwind configuration.

**Component Creation**: Follow existing patterns in `src/components/`:
- Export component and its props interface
- Use Headless UI primitives where applicable
- Implement dark mode support via Tailwind classes

**Form Handling**: Use the existing form components (Input, Select, Button, etc.) for consistency.

**Testing**: No test framework currently configured. Testing setup would require adding Jest/Vitest for unit tests or Playwright/Cypress for E2E.

## Documentation Workflow

The `docs/` directory contains documentation templates:
- `create-prd.mdc` - PRD creation guidelines
- `generate-tasks.mdc` - Task generation from PRDs
- `process-task-list.mdc` - Task completion workflow

Follow this workflow for feature development when applicable.