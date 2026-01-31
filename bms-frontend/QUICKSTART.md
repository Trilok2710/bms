# BMS Frontend - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd /Users/trilok27/Projects/BMS/bms-frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will run on **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```

## Running Frontend + Backend

### Terminal 1: Backend
```bash
cd /Users/trilok27/Projects/BMS/bms-backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd /Users/trilok27/Projects/BMS/bms-frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## Demo Credentials

All accounts use password: **password123**

### Admin Account
- Email: **admin@example.com**
- Role: ADMIN (Create & manage everything)

### Supervisor Account
- Email: **supervisor@example.com**
- Role: SUPERVISOR (Approve readings, manage staff)

### Technician Account
- Email: **technician@example.com**
- Role: TECHNICIAN (Submit readings, view tasks)

## Key Features

### Landing Page (/)
- Public landing page with feature overview
- Links to login and registration

### Login Page (/login)
- Email/password authentication
- Demo credentials shown
- Redirects to dashboard on success

### Registration Page (/register)
- Create new account
- Select role (Admin, Supervisor, Technician)
- Invite code required for non-admin roles
- Get invite code from admin

### Dashboard (/dashboard)
- Organization statistics
- Total readings, approved, pending, rejected
- Quick action buttons
- Role-based quick actions

### Buildings (/buildings) - Admin/Supervisor Only
- List all buildings
- Add new building
- Edit building details
- Delete buildings

### Tasks (/tasks)
- View all tasks
- Submit readings for assigned tasks
- Create tasks (Admin/Supervisor only)
- Set task frequency (Daily, Weekly, Monthly, One-time)

### Readings (/readings)
- Submit new reading values
- View pending readings (requires approval)
- Approve/reject readings (Admin/Supervisor only)
- Add comments to readings
- Filter by status (Pending, Approved, Rejected)

## Project Structure

```
bms-frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   └── ProtectedRoute.tsx
│   ├── context/             # Context providers (Auth)
│   ├── lib/                 # API service
│   ├── pages/               # Page components
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx              # Router setup
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── vite.config.ts           # Build configuration
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
├── package.json             # Dependencies
└── index.html               # HTML template
```

## API Endpoints

All requests are made to `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Buildings
- `GET /buildings` - List buildings
- `POST /buildings` - Create building (Admin only)
- `PATCH /buildings/:id` - Update building (Admin only)
- `DELETE /buildings/:id` - Delete building (Admin only)

### Tasks
- `GET /tasks` - List all tasks
- `GET /tasks/my-tasks` - User's assigned tasks
- `POST /tasks` - Create task (Admin/Supervisor)
- `PATCH /tasks/:id` - Update task (Admin/Supervisor)
- `POST /tasks/:id/assign` - Assign task to users

### Readings
- `POST /readings` - Submit reading
- `GET /readings/pending` - Pending readings (Admin/Supervisor)
- `POST /readings/:id/approve` - Approve reading
- `POST /readings/:id/reject` - Reject reading
- `POST /readings/:id/comments` - Add comment

### Analytics
- `GET /analytics/org/stats` - Organization statistics
- `GET /analytics/building/:buildingId` - Building stats
- `GET /analytics/staff/performance` - Staff performance

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or specify different port
npm run dev -- --port 3000
```

### CORS Error
Ensure backend is running on `http://localhost:5000`
Check `.env` or `vite.config.ts` proxy configuration

### Token Expired
Clear localStorage and login again:
```bash
localStorage.clear()
```

### TypeScript Errors
```bash
npm run type-check
```

## Development Tips

### Add New Page
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Use `MainLayout` for navigation
4. Import `useAuth` for user info

### Add New API Endpoint
1. Add method to `src/lib/api.ts`
2. Use `apiService.api` for requests
3. Define types in `src/types/index.ts`
4. Handle errors with try/catch

### Style Components
- Use Tailwind CSS classes
- Color variables in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles in Tailwind

## Environment Variables

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run type-check   # TypeScript type checking
npm run preview      # Preview production build
npm run lint         # Lint code
```

## Browser DevTools

### Redux DevTools (Optional)
Can be added for state management debugging

### React DevTools
Recommended extension for debugging React components

## Performance Tips

1. Use `React.lazy()` for page splitting
2. Minimize re-renders with `useCallback`
3. Cache API results with `useMemo`
4. Lazy load images

## Security Best Practices

1. ✅ Never store sensitive data in localStorage (only JWT)
2. ✅ Always use HTTPS in production
3. ✅ Validate input on frontend and backend
4. ✅ Implement CSRF protection
5. ✅ Use secure HTTP-only cookies if possible

## Next Steps

1. Install dependencies: `npm install`
2. Start backend: `npm run dev` (in bms-backend/)
3. Start frontend: `npm run dev` (in bms-frontend/)
4. Open http://localhost:5173 in browser
5. Login with demo credentials
6. Explore the application

## Support

For issues or questions:
1. Check the README.md in each folder
2. Review API documentation in backend README
3. Check TypeScript types for function signatures
4. Review error messages in browser console
