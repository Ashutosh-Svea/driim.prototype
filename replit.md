# Driim - Dream Journal Mobile App

## Overview

Driim is a mobile dream journal application built with React Native (Expo) and TypeScript. The app enables users to capture, organize, and reflect on their dreams immediately upon waking. It follows an offline-first architecture with local storage via AsyncStorage, featuring a dark twilight-inspired aesthetic with smooth animations. The app includes dream logging with metadata (lucidity, clarity, emotions, tags), search and filtering, calendar visualization, and AI-powered reflection generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54, using TypeScript
- **Navigation**: React Navigation v7 with a hybrid approach:
  - `@react-navigation/native-stack` for the root stack (modals and detail screens)
  - `@react-navigation/bottom-tabs` for the main 5-tab interface (Journal, Search, Insights, Calendar, Settings)
- **State Management**: React Context API (`DreamContext`) for dream data management, with TanStack React Query configured for future API integration
- **UI Components**: Custom themed components with `react-native-reanimated` for animations and `expo-linear-gradient` for gradient effects
- **Styling**: StyleSheet-based with a centralized theme system (`@/constants/theme.ts`) supporting light/dark modes

### Data Layer
- **Local Storage**: AsyncStorage for dream persistence (offline-first approach)
- **Data Models**: TypeScript interfaces in `@/types/dream.ts` defining Dream, DreamInput, DreamFilter types
- **Backend Schema**: Drizzle ORM with PostgreSQL schema defined in `shared/schema.ts` (currently only users table, prepared for future sync)

### Path Aliases
- `@/` → `./client/` (frontend code)
- `@shared/` → `./shared/` (shared types and schemas)

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL via Drizzle ORM (schema defined but not actively used for dreams yet)
- **Storage**: In-memory storage implementation (`MemStorage`) with interface for future database integration
- **CORS**: Configured for Replit domains and localhost development

### Key Design Patterns
- **Repository Pattern**: Storage interface (`IStorage`) in `server/storage.ts` for data access abstraction
- **Context Provider Pattern**: `DreamProvider` wraps the app providing dream CRUD operations
- **Component Composition**: Reusable themed components (ThemedText, ThemedView, Button, Card)
- **Offline-First**: All dream data stored locally; backend sync prepared but not implemented

## External Dependencies

### Core Framework
- **Expo SDK 54**: Managed workflow with new architecture enabled
- **React 19.1.0**: Latest React version
- **React Native 0.81.5**: Latest RN version

### Navigation & UI
- **@react-navigation/native, bottom-tabs, native-stack**: Navigation framework
- **expo-linear-gradient**: Gradient backgrounds and effects
- **expo-blur, expo-glass-effect**: Blur and glass morphism effects
- **react-native-reanimated**: Smooth animations
- **react-native-gesture-handler**: Gesture support
- **expo-haptics**: Haptic feedback

### Data & Storage
- **@react-native-async-storage/async-storage**: Local dream storage
- **@tanstack/react-query**: Data fetching and caching (configured for future API use)
- **drizzle-orm, drizzle-zod**: Database ORM and validation (PostgreSQL)
- **pg**: PostgreSQL client

### Utilities
- **uuid**: Unique ID generation for dreams
- **expo-file-system, expo-sharing**: Export and share functionality
- **@expo-google-fonts/nunito**: Custom typography

### Backend
- **express**: HTTP server
- **http-proxy-middleware**: Development proxy
- **drizzle-kit**: Database migrations