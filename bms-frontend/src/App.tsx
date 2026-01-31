import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { BuildingsPage } from './pages/BuildingsPage';
import { TasksPage } from './pages/TasksPage';
import { ReadingsPage } from './pages/ReadingsPage';
import { ReadingsAnalyticsPage } from './pages/ReadingsAnalyticsPage';
import { StaffPage } from './pages/StaffPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryTasksPage } from './pages/CategoryTasksPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buildings"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'SUPERVISOR']}>
                  <BuildingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TasksPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/readings"
              element={
                <ProtectedRoute>
                  <ReadingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/readings/analytics"
              element={
                <ProtectedRoute>
                  <ReadingsAnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/staff"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'SUPERVISOR']}>
                  <StaffPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buildings/:buildingId/categories"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'SUPERVISOR']}>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/buildings/:buildingId/categories/:categoryId/tasks"
              element={
                <ProtectedRoute requiredRoles={['ADMIN', 'SUPERVISOR']}>
                  <CategoryTasksPage />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
