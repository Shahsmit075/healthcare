# Healthcare Clock-In Application Development Guide

## Project Overview
This application allows healthcare workers to clock in and out of their shifts while enabling managers to monitor attendance and analyze work patterns. The system includes location-based verification, comprehensive reporting, and role-based access control.

## Core Requirements

### Manager Features
- Configure location perimeters (within specific radius of a target location)
- View real-time dashboard showing:
  - Currently clocked-in staff
  - Average daily hours per employee
  - Daily clock-in counts
  - Total hours per staff member (weekly)
- Access detailed records for each staff member:
  - Clock-in time and location
  - Clock-out time and location
  - Associated notes

### Care Worker Features
- Clock in functionality:
  - Only available within configured perimeter
  - Optional note entry
  - Location verification
- Clock out functionality:
  - Available when already clocked in
  - Optional note entry
- View personal clock-in history

### Authentication
- User registration with username/password
- Social login integration (Google)
- Email-based authentication
- Role-based access (Manager vs Care Worker)
- Auth0 integration

### UI/UX Requirements
- Responsive design (mobile and desktop)
- Clean user interface using Ant Design
- Intuitive navigation
- Visual data representations (charts/graphs)

## Development Roadmap

### Level 1: Foundation Setup (1-2 days)
#### 1.1 Environment Configuration
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest healthcare-clock-in --typescript

# Install core dependencies
npm install @auth0/nextjs-auth0 @prisma/client antd @ant-design/icons
npm install -D prisma typescript @types/node @types/react
```

#### 1.2 Auth0 Setup
- Create Auth0 account
- Configure application:
  - Type: "Regular Web Application"
  - Callback URLs: http://localhost:3000/api/auth/callback
  - Logout URLs: http://localhost:3000
- Configure environment variables in `.env.local`:
```
AUTH0_SECRET='[generate with: openssl rand -hex 32]'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='your-auth0-domain'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

#### 1.3 Database Configuration
- Create database (Supabase recommended)
- Configure Prisma:
```bash
npx prisma init
```
- Create schema in `prisma/schema.prisma`:
```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  name        String
  auth0Id     String    @unique
  role        String    @default("CARE_WORKER")
  clockIns    ClockIn[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model ClockIn {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  clockInTime   DateTime  @default(now())
  clockOutTime  DateTime?
  clockInLat    Float?
  clockInLong   Float?
  clockOutLat   Float?
  clockOutLong  Float?
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model LocationPerimeter {
  id          String    @id @default(cuid())
  name        String
  latitude    Float
  longitude   Float
  radiusKm    Float
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```
- Initialize database:
```bash
npx prisma db push
npx prisma generate
```

### Level 2: Authentication & Basic UI (2-3 days)
#### 2.1 Authentication Implementation
- Create API handler for Auth0
- Build role-based middleware
- Implement user creation on first login
- Design login/logout flow

#### 2.2 Core UI Development
- Create layout components
- Implement responsive navigation
- Design user profile pages
- Set up role management UI

### Level 3: Core Clock-In/Out Functionality (3-4 days)
#### 3.1 Geolocation Features
- Implement browser geolocation
- Create location verification service
- Build perimeter configuration UI for managers

#### 3.2 Worker Features
- Develop clock-in/out interface
- Add notes functionality
- Implement history view
- Create location validation

#### 3.3 Manager Dashboard
- Build staff overview component
- Implement real-time status updates
- Create filtering and sorting capabilities

### Level 4: Analytics & Advanced Features (4-5 days)
#### 4.1 Reporting System
- Implement data aggregation services
- Create visualization components using Chart.js or D3.js
- Build export functionality
- Develop customizable reports

#### 4.2 Notification System
- Implement geofence-based notifications
- Create reminder system
- Add alert functionality for managers

### Level 5: Security & Compliance (2-3 days)
- Implement rate limiting
- Add request validation
- Set up audit logging
- Create data retention policies
- Add HIPAA compliance measures

### Level 6: Testing & Optimization (3-4 days)
- Set up unit and integration tests
- Implement performance optimizations
- Create caching system
- Optimize database queries

### Level 7: Deployment & Documentation (2-3 days)
- Configure production environment
- Set up CI/CD pipeline
- Create comprehensive documentation
- Prepare user guides

## PWA Enhancements (Bonus)
- Implement service workers
- Configure offline functionality
- Create app manifest
- Enable push notifications
- Add "Add to Home Screen" functionality

## Technical Stack
- **Frontend**: Next.js with TypeScript
- **UI Library**: Ant Design
- **State Management**: React Context API
- **Backend**: Next.js API routes or GraphQL
- **Database**: Prisma ORM with database of choice
- **Authentication**: Auth0
- **Analytics**: Chart.js or D3.js
- **Deployment**: Vercel or Netlify

## Human Action Items
- Auth0 account creation and configuration
- Database setup and connection string acquisition
- API keys and secrets management
- Environment variables configuration
- Domain registration and SSL (production)
- User acceptance testing
- Security audit
