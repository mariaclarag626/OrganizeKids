# OrganizeKids - Family Organization Platform

A modern family organization platform built with Next.js 14, focusing on helping families manage tasks, rewards, and household activities through an engaging space-themed interface.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, TailwindCSS
- **Authentication**: NextAuth.js with Google/Facebook OAuth + email magic links
- **Database**: PostgreSQL with Drizzle ORM
- **UI/UX**: Pixel-perfect space-themed design with responsive layout
- **State Management**: TanStack Query + Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Internationalization**: Portuguese/English support with next-intl
- **Monitoring**: Sentry (errors) + PostHog (analytics)
- **Development**: ESLint, Prettier, Husky pre-commit hooks

## 🛠️ Getting Started

### Prerequisites

- Node.js 20 LTS or higher
- PostgreSQL database (Railway/Supabase/Neon recommended)
- Google OAuth credentials (optional)
- Facebook OAuth credentials (optional)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd OrganizeKids-2
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure environment variables in `.env.local`:**
   ```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/organizekids
   
   # Auth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_CLIENT_ID=your-facebook-client-id
   FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
   ```

4. **Database setup:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Reusable UI components
├── db/                   # Database layer
│   ├── index.ts          # Database connection
│   └── schema.ts         # Drizzle schemas
├── lib/                  # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── utils.ts          # Helper functions
│   └── validations.ts    # Zod schemas
└── stores/               # Zustand stores
```

## 🏗️ Architecture Decisions

### Frontend
- **Next.js 14** with App Router for modern React development
- **TailwindCSS** for utility-first styling with space theme
- **TypeScript** for type safety
- **Turbopack** for fast development builds

### Backend
- **Drizzle ORM** instead of Prisma for better performance
- **PostgreSQL** for reliable data storage
- **NextAuth.js** for authentication
- **API Routes** for serverless functions

### State Management
- **TanStack Query** for server state
- **Zustand** for client-side UI state
- **React Hook Form** + **Zod** for form handling

### Infrastructure
- **Vercel** for deployment
- **Railway/Supabase/Neon** for database hosting
- **Sentry** for error monitoring
- **PostHog** for product analytics

## 🎨 Design System

The platform features a space-themed design inspired by the provided Figma mockups:

- **Colors**: Deep space gradients with purple, blue, and cyan accents
- **Background**: Animated space elements with floating planets and stars
- **Components**: Glass morphism effects with backdrop blur
- **Typography**: Bold headings with gradient text effects
- **Animation**: Subtle floating animations and smooth transitions

## 🔒 Authentication Flow

1. **Sign In Page**: Space-themed with email input and OAuth buttons
2. **OAuth Providers**: Google and Facebook integration
3. **Magic Links**: Email-based passwordless authentication (planned)
4. **Session Management**: JWT-based sessions with middleware protection

## 📊 Database Schema

### Core Entities
- **Users**: Authentication and basic profile info
- **Households**: Family units with settings
- **Profiles**: Extended user information
- **Tasks**: Household chores and activities
- **Points**: Reward system tracking

### Relationships
- Users can belong to multiple households
- Households have multiple members with roles (parent/teenager/child)
- Tasks are assigned within households
- Points are tracked per user per household

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
```

### Code Quality

- **ESLint** with TypeScript and React rules
- **Prettier** with Tailwind CSS plugin
- **Husky** for pre-commit hooks
- **lint-staged** for staged file linting

## 🌍 Internationalization

The platform supports Portuguese (primary) and English:

- **next-intl** for translation management
- **messages/pt.json** for Portuguese translations  
- **messages/en.json** for English translations

## 📈 Monitoring & Analytics

### Error Tracking (Sentry)
```env
SENTRY_DSN=your-sentry-dsn
```

### Product Analytics (PostHog)
```env
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic CI/CD

### Database Deployment

Choose one of these managed PostgreSQL providers:
- **Railway**: Easy setup with built-in PostgreSQL
- **Supabase**: Full backend-as-a-service
- **Neon**: Serverless PostgreSQL

## 🗺️ Roadmap

### Cycle 1 (Current - 2-3 sprints)
- ✅ Technical foundation (Next.js 14, Auth, Database)
- ✅ Pixel-perfect sign-in page
- 🔄 Core domain implementation (Households, Profiles, Tasks, Points)
- 🔄 Simple dashboard

### Cycle 2 (Future)
- Task assignment and completion system
- Points and rewards management
- Family member role management
- Mobile responsiveness improvements
- Advanced household settings

### Cycle 3 (Future)
- Real-time notifications
- Mobile app (React Native)
- Advanced analytics dashboard
- Gamification features
- Third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For support and questions, please contact the development team.

---

Built with ❤️ for families who want to stay organized together.