import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MainLayout } from '../components/layout/MainLayout';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BarChart3, Users, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiService from '../lib/api';
import { useAuth } from '../context/AuthContext';

const AnimatedCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

export const DashboardPage: React.FC = () => {
  const { user, organizationName } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [trend, setTrend] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getOrgStats();
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="gradient-text text-4xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, {user?.firstName}!</p>
            {organizationName && (
              <p className="text-sm text-blue-600 font-medium mt-1">Organization: {organizationName}</p>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slideInDown"
          >
            {error}
          </motion.div>
        )}

        {stats && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedCard delay={0}>
                <div className="card-glass">
                  <StatCard
                    title="Total Readings"
                    value={stats.totalReadings || 0}
                    icon={<BarChart3 />}
                    color="blue"
                  />
                </div>
              </AnimatedCard>
              <AnimatedCard delay={0.1}>
                <div className="card-glass">
                  <StatCard
                    title="Approved"
                    value={stats.approvedReadings || 0}
                    icon={<CheckCircle />}
                    color="green"
                  />
                </div>
              </AnimatedCard>
              <AnimatedCard delay={0.2}>
                <div className="card-glass">
                  <StatCard
                    title="Pending"
                    value={stats.pendingReadings || 0}
                    icon={<AlertCircle />}
                    color="yellow"
                  />
                </div>
              </AnimatedCard>
              <AnimatedCard delay={0.3}>
                <div className="card-glass">
                  <StatCard
                    title="Buildings"
                    value={stats.buildingCount || 0}
                    icon={<Building2 />}
                    color="blue"
                  />
                </div>
              </AnimatedCard>
            </div>

            {/* Approval Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-secondary mb-4">Overview</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Approval Rate</p>
                  <p className="text-3xl font-bold text-success">{stats.approvalRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Tasks</p>
                  <p className="text-3xl font-bold text-primary">{stats.taskCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 mb-2">Rejected</p>
                  <p className="text-3xl font-bold text-danger">{stats.rejectedReadings || 0}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-secondary mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="primary" onClick={() => window.location.href = '/readings'}>
                  View Readings
                </Button>
                <Button variant="secondary" onClick={() => window.location.href = '/tasks'}>
                  View Tasks
                </Button>
                {(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR') && (
                  <>
                    <Button variant="success" onClick={() => window.location.href = '/buildings'}>
                      Manage Buildings
                    </Button>
                    <Button variant="warning" onClick={() => window.location.href = '/staff'}>
                      Manage Staff
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};
