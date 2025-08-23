# Overview

This is a mobile-first learning application built with Nothing™ design principles. The app provides an AI-powered learning experience with personalized study packs, progress tracking, and interactive chat functionality. It features a modern, minimalist design optimized for mobile devices with a focus on clean aesthetics and intuitive user interactions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management with optimistic updates
- **UI Library**: Radix UI primitives with shadcn/ui components for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom Nothing™ design system variables and mobile-first responsive design
- **Mobile Detection**: Custom hooks for device detection and touch gesture handling

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for scalable cloud database hosting
- **Session Management**: Express sessions with PostgreSQL store for persistent user sessions
- **Development**: Vite for fast development server and hot module replacement

## Authentication System
- **Provider**: Replit OIDC (OpenID Connect) for seamless authentication integration
- **Strategy**: Passport.js with OpenID Connect strategy for secure user authentication
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL and secure cookie settings

## AI Integration
- **Provider**: OpenAI GPT-4o for intelligent chat responses and learning recommendations
- **Features**: Personalized learning suggestions, contextual chat assistance, and content analysis
- **Implementation**: Server-side API integration with structured response formatting for mobile UI

## Mobile-First Design
- **Responsive Strategy**: Mobile-first approach with progressive enhancement for larger screens
- **Gesture Support**: Touch gestures for navigation including swipe controls for tab switching
- **Animation System**: Respect for user motion preferences with conditional animations
- **Layout**: Bottom navigation with glassmorphism effects and Nothing™ aesthetic principles

## File Management
- **Storage**: Google Cloud Storage integration through Replit's sidecar service
- **Upload System**: Uppy.js for robust file upload with progress tracking and error handling
- **ACL System**: Custom object access control with group-based permissions

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and automatic scaling
- **Drizzle Kit**: Database migration and schema management tools

## Authentication Services
- **Replit OIDC**: OpenID Connect provider for user authentication and session management

## AI Services  
- **OpenAI API**: GPT-4o model for chat responses, learning recommendations, and content processing

## Cloud Storage
- **Google Cloud Storage**: Object storage through Replit's sidecar service with custom ACL implementation

## UI/UX Libraries
- **Radix UI**: Unstyled, accessible UI primitives for complex interactive components
- **Uppy**: File upload library with dashboard interface and cloud storage integration
- **Tailwind CSS**: Utility-first CSS framework with custom design system integration

## Development Tools
- **Vite**: Build tool and development server with React plugin and runtime error handling
- **TypeScript**: Static type checking for improved code quality and developer experience