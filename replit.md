# Volleyball Simulation Game

## Overview

This is a volleyball simulation game built as a full-stack web application. The system manages teams, players, coaches, games, trades, training, and seasons in a comprehensive volleyball league management system. The application features a modern dark-themed UI with real-time game simulation capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful API with JSON responses

### Key Components

#### Data Models
The application manages several core entities:
- **Players**: Individual athletes with stats, ratings, and contract information
- **Teams**: Organizations with rosters, salary caps, and win/loss records
- **Coaches**: Team leadership with coaching ratings and contracts
- **Games**: Match records with scores, stats, and simulation results
- **Trades**: Player transfer transactions between teams
- **Training**: Player development programs with skill improvements
- **Seasons**: League organization with scheduling and standings
- **Drafts**: Player recruitment system

#### Core Features
- **Team Management**: Full roster control with salary cap management
- **Player Development**: Training systems to improve player attributes
- **Game Simulation**: Automated match results based on team and player ratings
- **Free Agency**: Player signing and contract negotiations
- **Trade System**: Player exchanges between teams
- **Statistics Tracking**: Comprehensive performance metrics

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validation
3. **Business Logic**: Server-side services process game simulation and player management
4. **Database**: Drizzle ORM manages PostgreSQL interactions
5. **Real-time Updates**: Query invalidation ensures UI reflects latest data

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive Radix UI component library
- **Styling**: Tailwind CSS with PostCSS processing
- **Form Validation**: Zod schema validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React icon library

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Utilities**: nanoid for ID generation

## Deployment Strategy

### Development
- **Frontend**: Vite development server with hot module replacement
- **Backend**: tsx for TypeScript execution with nodemon-like behavior
- **Database**: Drizzle migrations with push command for schema updates

### Production
- **Build Process**: 
  - Frontend: Vite builds optimized static assets
  - Backend: esbuild bundles server code for Node.js
- **Deployment**: Single-server deployment with static file serving
- **Database**: PostgreSQL with connection pooling via Neon

### Environment Configuration
- **Development**: NODE_ENV=development with development-specific middleware
- **Production**: NODE_ENV=production with optimized asset serving
- **Database**: DATABASE_URL environment variable for connection string

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Performance optimization completed:
  - Eliminated 7-second lag in data loading
  - Fixed roster page to display Lakers players properly
  - Implemented immediate data fetching with React Query fallbacks
  - Team selection and dashboard now load within 1-2 seconds
- July 04, 2025. Roster functionality working:
  - 15 Lakers players loading and displaying correctly
  - Starters and bench organization functional
  - Team navigation between dashboard and roster working
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```