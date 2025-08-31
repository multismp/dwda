# Overview

This is a Minecraft player rankings website that displays player statistics and rankings across various PvP categories. The application allows viewing player leaderboards, with admin functionality to manage players (add, edit, delete). The design follows a gaming aesthetic with dark themes and golden accents, similar to popular Minecraft community sites.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management, React hooks for local state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming, dark mode support
- **Form Management**: React Hook Form with Zod validation

## Backend Architecture  
- **Server**: Express.js with TypeScript
- **API Design**: RESTful API endpoints for player and authentication operations
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Layer**: In-memory storage implementation with interface for future database integration
- **Authentication**: Simple password-based admin authentication with localStorage session management

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL dialect
- **Schema**: Players table with fields for name, points, region, title, and tier rankings stored as JSONB
- **Migrations**: Drizzle Kit for database schema migrations
- **Connection**: Neon Database serverless PostgreSQL via connection string

## Authentication and Authorization
- **Admin System**: Password-based authentication (hardcoded admin password: "admin123")
- **Session Management**: Client-side localStorage for admin session persistence
- **Authorization**: Simple role-based access where admin status enables CRUD operations

## External Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Framework**: Radix UI primitives for accessible components
- **Icons**: Font Awesome icons for gaming-themed iconography
- **Fonts**: Google Fonts (Inter for UI, additional gaming fonts)
- **Build Tools**: Vite for development server and build process, esbuild for server bundling
- **Development**: Replit-specific plugins for development environment integration