# BMS Frontend

Production-ready React frontend for the Building Management System.

## Features

- **Multi-role Authentication** - Admin, Supervisor, Technician login and registration
- **Responsive UI** - Mobile-first design with Tailwind CSS
- **Real-time Dashboard** - Organization statistics and analytics
- **Building Management** - Create, edit, and manage buildings (Admin/Supervisor only)
- **Task Management** - Create and track maintenance tasks with frequency scheduling
- **Reading Submission & Approval** - Technicians submit readings, supervisors approve them
- **Comments & Feedback** - Add comments to readings for communication
- **Type-Safe** - Full TypeScript with strict mode
- **API Integration** - Axios service layer with token management

## Tech Stack

- **Framework**: React 18.2.0
- **Language**: TypeScript 5.0
- **Routing**: React Router DOM 6.11.0
- **Styling**: Tailwind CSS 3.3.2
- **Build Tool**: Vite 4.3.9
- **HTTP Client**: Axios 1.4.0
- **Charts**: Recharts 2.7.2
- **Icons**: Lucide React 0.263.1

## Project Structure

```
src/
├── components/
│   ├── common/               # Reusable components (Button, Modal, etc.)
│   ├── dashboard/            # Dashboard specific components
│   ├── layout/               # Layout components (Navbar, Sidebar)
│   └── ProtectedRoute.tsx    # Route protection wrapper
├── context/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   └── api.ts                # API service layer
├── pages/                    # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── BuildingsPage.tsx
│   ├── TasksPage.tsx
│   ├── ReadingsPage.tsx
│   └── NotFoundPage.tsx
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main app component with routing
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL
VITE_API_URL=http://localhost:5000/api
```

## Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Preview production build
npm run preview
```

## Demo Credentials

**Admin Account:**
- Email: admin@example.com
- Password: password123

**Supervisor Account:**
- Email: supervisor@example.com
- Password: password123

**Technician Account:**
- Email: technician@example.com
- Password: password123

## API Integration

The frontend communicates with the backend via REST API at `http://localhost:5000/api`.

### Authentication Flow

1. User registers or logs in
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token automatically included in all API requests via interceptor
5. Token validated for protected routes

### Key Features

- **Authentication**: Login/Register with JWT tokens
- **Buildings**: CRUD operations (Admin/Supervisor)
- **Categories**: Nested under buildings for organizing readings
- **Tasks**: Create recurring tasks with frequency scheduling
- **Readings**: Submit readings, track approval status, add comments
- **Analytics**: Real-time statistics and trends

## Component Architecture

### Protected Routes

```typescript
<ProtectedRoute requiredRoles={['ADMIN', 'SUPERVISOR']}>
  <BuildingsPage />
</ProtectedRoute>
```

### Context API

The `AuthContext` provides:
- `user` - Current authenticated user
- `loading` - Authentication loading state
- `error` - Authentication error messages
- `login()` - Login function
- `register()` - Registration function
- `logout()` - Logout function

### API Service

The `apiService` provides methods for all backend endpoints:
- Authentication (login, register, getMe)
- Buildings (CRUD operations)
- Categories (nested under buildings)
- Tasks (create, assign, list)
- Readings (submit, approve, reject, comment)
- Analytics (stats, trends, performance)

## Error Handling

- Centralized error boundary component
- API error interception with automatic token refresh
- User-friendly error messages
- 404 page for invalid routes

## Security

- JWT token storage in localStorage
- Automatic token inclusion in all requests
- Protected routes with role-based access control
- Axios interceptors for token validation
- HTTPS recommended for production

## Deployment

### Production Build

```bash
npm run build
```

Outputs optimized bundle to `dist/` folder.

### Environment Variables

```env
VITE_API_URL=https://api.example.com/api
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

## Performance Optimization

- Code splitting with React Router
- Lazy component loading
- Tailwind CSS purging
- Asset minification via Vite
- Responsive images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript strict mode
2. Use functional components with hooks
3. Implement proper error handling
4. Add loading states
5. Test across devices

## License

MIT
