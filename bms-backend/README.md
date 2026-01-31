# Building Management System (BMS) - Backend

A production-ready Node.js/Express backend for managing building operations, maintenance tasks, and automated readings.

## Features

### 🏢 Multi-Tenancy
- Isolated organizations with their own data
- Multi-building support per organization
- Organization-specific invite codes for staff onboarding

### 👥 Role-Based Access Control
- **Admin**: Full control over organization, buildings, categories, tasks, and staff
- **Supervisor**: Can create/assign tasks, approve/reject readings, view analytics
- **Technician**: Can submit readings, view assigned tasks, access building data

### 📊 Reading Management
- Submit readings with validation (min/max values)
- Approval workflow (Pending → Approved/Rejected)
- Comment system for feedback on readings
- Reading history and trends

### 📈 Analytics & Reports
- Organization-wide statistics
- Category-specific analytics with trends
- Building statistics
- Staff performance metrics
- 30-day reading trends with charts

### 🔐 Security
- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled
- Helmet for HTTP headers
- Input validation with Zod

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: bcrypt, Helmet, CORS

## Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Docker & Docker Compose (optional)

### Local Setup

1. **Clone and install dependencies**
```bash
cd bms-backend
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database**
```bash
# Run migrations
npm run prisma:migrate

# (Optional) Seed sample data
npm run prisma:seed
```

4. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Docker Setup

1. **Setup docker-compose from root directory**
```bash
docker-compose up -d
```

2. **Run migrations** (if needed)
```bash
docker-compose exec bms-backend npm run prisma:migrate:prod
```

## API Documentation

### Authentication Endpoints

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "secure_password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ADMIN"
}
```

Response: `{ token, user }`

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "secure_password123"
}
```

**Get Current User**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Building Endpoints

**Create Building** (Admin only)
```http
POST /api/buildings
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Building A",
  "location": "Floor 1",
  "description": "Main office building"
}
```

**List Buildings**
```http
GET /api/buildings?page=1&limit=10
Authorization: Bearer <token>
```

**Get Building Details**
```http
GET /api/buildings/:id
Authorization: Bearer <token>
```

### Category Endpoints

**Create Category** (Admin only)
```http
POST /api/categories/buildings/:buildingId/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Chillers",
  "unit": "°C",
  "minValue": 10,
  "maxValue": 25,
  "description": "Chiller temperature monitoring"
}
```

**Get Categories by Building**
```http
GET /api/categories/buildings/:buildingId/categories
Authorization: Bearer <token>
```

### Task Endpoints

**Create Task** (Admin/Supervisor)
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Daily Chiller Reading",
  "description": "Monitor chiller temperature",
  "frequency": "DAILY",
  "scheduledTime": "09:00",
  "buildingId": "building_id",
  "categoryId": "category_id",
  "assignedUserIds": ["tech_user_id"]
}
```

**Get My Tasks** (Technician)
```http
GET /api/tasks/my-tasks
Authorization: Bearer <token>
```

**Assign Task** (Admin/Supervisor)
```http
POST /api/tasks/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedUserIds": ["user1_id", "user2_id"]
}
```

### Reading Endpoints

**Submit Reading** (Technician)
```http
POST /api/readings
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "task_id",
  "value": 22.5,
  "notes": "Temperature normal"
}
```

**Get Pending Readings** (Admin/Supervisor)
```http
GET /api/readings/pending
Authorization: Bearer <token>
```

**Approve Reading** (Admin/Supervisor)
```http
POST /api/readings/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Approved - values within range"
}
```

**Reject Reading** (Admin/Supervisor)
```http
POST /api/readings/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Value exceeds maximum threshold"
}
```

**Add Comment**
```http
POST /api/readings/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "Please check valve pressure"
}
```

**Get Reading History**
```http
GET /api/readings/my-history
Authorization: Bearer <token>
```

**Get Readings by Category**
```http
GET /api/readings/category/:buildingId/:categoryId
Authorization: Bearer <token>
```

### Staff Endpoints

**Invite Staff** (Admin only)
```http
POST /api/staff/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "technician@company.com",
  "password": "secure_password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "TECHNICIAN"
}
```

**Get Staff by Role**
```http
GET /api/staff/role/:role
Authorization: Bearer <token>
```

**Get Staff Details**
```http
GET /api/staff/:id
Authorization: Bearer <token>
```

**Update Staff Role** (Admin only)
```http
PATCH /api/staff/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "SUPERVISOR"
}
```

### Analytics Endpoints

**Organization Statistics**
```http
GET /api/analytics/org/stats
Authorization: Bearer <token>
```

Response:
```json
{
  "totalReadings": 150,
  "approvedReadings": 145,
  "pendingReadings": 3,
  "rejectedReadings": 2,
  "approvalRate": "96.67"
}
```

**Category Analytics**
```http
GET /api/analytics/category/:categoryId
Authorization: Bearer <token>
```

**Building Analytics**
```http
GET /api/analytics/building/:buildingId
Authorization: Bearer <token>
```

**Reading Trends**
```http
GET /api/analytics/trend/:categoryId?days=30
Authorization: Bearer <token>
```

**Staff Performance**
```http
GET /api/analytics/staff/performance
Authorization: Bearer <token>
```

## Database Schema

Key models:
- **Organization**: Tenant organizations
- **User**: Users with roles (Admin/Supervisor/Technician)
- **Building**: Buildings in an organization
- **Category**: Categories (Chillers, Lifts, AC, etc.)
- **Task**: Scheduled reading tasks
- **TaskAssignment**: Links tasks to technicians
- **Reading**: Submitted readings with approval workflow
- **ReadingComment**: Comments on readings

## Environment Variables

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/bms_db
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=10
```

## Development

### Run Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Database Commands
```bash
# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed
```

## Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Run migrations**
```bash
npm run prisma:migrate:prod
```

3. **Start server**
```bash
npm start
```

Or use Docker:
```bash
docker-compose -f docker-compose.yml up -d
```

## Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Setup proper CORS origins
- [ ] Use environment-specific configs
- [ ] Implement rate limiting
- [ ] Setup logging/monitoring
- [ ] Regular security updates

## License

ISC
