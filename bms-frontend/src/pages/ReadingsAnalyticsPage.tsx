import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Filter } from 'lucide-react';
import apiService from '../lib/api';

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

interface Reading {
  id: string;
  value: number;
  taskId: string;
  taskTitle: string;
  category: string;
  createdAt: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  buildingId?: string;
}

interface ChartData {
  date: string;
  [key: string]: string | number;
}

export const ReadingsAnalyticsPage: React.FC = () => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        
        // Fetch all tasks
        const tasksResponse = await apiService.getTasks(1, 100);
        let tasksData = tasksResponse.data?.data?.tasks || [];
        
        // Ensure we're working with valid task objects
        const validTasks: Task[] = [];
        if (Array.isArray(tasksData)) {
          for (const task of tasksData) {
            if (task && typeof task === 'object' && task.id && task.title) {
              // Extract category name properly from nested object
              const categoryName = task.category?.name || task.category || '';
              validTasks.push({
                id: task.id,
                title: task.title,
                category: categoryName,
                categoryId: task.categoryId || task.category?.id || '',
                buildingId: task.buildingId || task.building?.id || '',
              });
            }
          }
        }
        
        setTasks(validTasks);

        // Fetch categories
        if (validTasks.length > 0 && validTasks[0].buildingId) {
          const categoriesResponse = await apiService.getCategoriesByBuilding(validTasks[0].buildingId);
          setCategories(categoriesResponse.data || []);
        }

        // Fetch readings
        const readingsResponse = await apiService.getReadings(1, 100);
        let readingsData = readingsResponse.data?.data?.readings || readingsResponse.data?.readings || [];
        
        const validReadings = Array.isArray(readingsData) ? readingsData : [];
        setReadings(validReadings);

        // Set default task
        if (validTasks.length > 0) {
          setSelectedTaskId(validTasks[0].id);
          setSelectedCategoryId(validTasks[0].categoryId || '');
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  // Process data for chart
  useEffect(() => {
    if (selectedTaskId && readings.length > 0) {
      const taskReadings = readings.filter(r => r.taskId === selectedTaskId);
      
      // Group by date and create chart data
      const grouped: { [key: string]: Reading[] } = {};
      taskReadings.forEach(reading => {
        const date = new Date(reading.createdAt).toLocaleDateString();
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(reading);
      });

      const data: ChartData[] = Object.entries(grouped)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, dayReadings]) => {
          const avg = dayReadings.reduce((sum, r) => sum + r.value, 0) / dayReadings.length;
          const max = Math.max(...dayReadings.map(r => r.value));
          const min = Math.min(...dayReadings.map(r => r.value));
          return {
            date,
            'Average': parseFloat(avg.toFixed(2)),
            'Max': max,
            'Min': min,
            'Count': dayReadings.length,
          };
        });

      setChartData(data);
    }
  }, [selectedTaskId, readings]);

  const currentTask = tasks.find(t => t.id === selectedTaskId);
  const currentReadings = readings.filter(r => r.taskId === selectedTaskId);
  const approvedReadings = currentReadings.filter(r => r.status === 'APPROVED');
  const avgValue = currentReadings.length > 0 
    ? (currentReadings.reduce((sum, r) => sum + r.value, 0) / currentReadings.length).toFixed(2)
    : '0';
  const maxValue = currentReadings.length > 0
    ? Math.max(...currentReadings.map(r => r.value))
    : 0;
  const minValue = currentReadings.length > 0
    ? Math.min(...currentReadings.map(r => r.value))
    : 0;

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="gradient-text text-4xl font-bold mb-2">Readings Analytics</h1>
          <p className="text-gray-600">Visualize and analyze readings data over time</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slideInDown"
          >
            {error}
          </motion.div>
        )}

        {/* Filters */}
        <AnimatedSection>
          <div className="card-glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Select Task</h2>
            </div>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="select-base"
            >
              <option value="">-- Select a task --</option>
              {tasks && Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map(task => {
                  // Ensure task is a valid object with required fields
                  if (!task || typeof task !== 'object' || !task.id || !task.title) {
                    return null;
                  }
                  const displayText = task.category ? `${task.title} (${task.category})` : task.title;
                  return (
                    <option key={task.id} value={task.id}>
                      {displayText}
                    </option>
                  );
                })
              ) : null}
            </select>
          </div>
        </AnimatedSection>

        {selectedTaskId && (
          <>
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <AnimatedSection delay={0}>
                <div className="card-glass p-6 text-center">
                  <p className="text-gray-600 mb-2 text-sm">Total Readings</p>
                  <p className="text-4xl font-bold gradient-text">{currentReadings.length}</p>
                  <p className="text-xs text-gray-500 mt-2">All submissions</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="card-glass p-6 text-center">
                  <p className="text-gray-600 mb-2 text-sm">Approved</p>
                  <p className="text-4xl font-bold text-green-600">{approvedReadings.length}</p>
                  <p className="text-xs text-gray-500 mt-2">{((approvedReadings.length / currentReadings.length) * 100).toFixed(0)}% rate</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div className="card-glass p-6 text-center">
                  <p className="text-gray-600 mb-2 text-sm">Average Value</p>
                  <p className="text-4xl font-bold text-blue-600">{avgValue}</p>
                  <p className="text-xs text-gray-500 mt-2">Mean of all readings</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.3}>
                <div className="card-glass p-6 text-center">
                  <p className="text-gray-600 mb-2 text-sm">Range</p>
                  <p className="text-lg font-bold text-purple-600">{minValue} - {maxValue}</p>
                  <p className="text-xs text-gray-500 mt-2">Min to Max values</p>
                </div>
              </AnimatedSection>
            </div>

            {/* Main Chart */}
            <AnimatedSection delay={0.4}>
              <div className="card-glass p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Readings Over Time - {currentTask?.title}</h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#999"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(31, 41, 55, 0.9)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="Average" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Max" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        opacity={0.7}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Min" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        dot={{ fill: '#f59e0b', r: 4 }}
                        opacity={0.7}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No data available for this task</p>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Reading Count Chart */}
            <AnimatedSection delay={0.5}>
              <div className="card-glass p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Reading Count</h2>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#999"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(31, 41, 55, 0.9)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="Count" 
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No data available</p>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Data Table */}
            <AnimatedSection delay={0.6}>
              <div className="card-glass p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Readings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Value</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentReadings.slice().reverse().slice(0, 10).map((reading, idx) => (
                        <motion.tr
                          key={reading.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-blue-500/10 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {new Date(reading.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                            {reading.value}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reading.status === 'APPROVED' 
                                ? 'bg-green-100 text-green-800'
                                : reading.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {reading.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(reading.createdAt).toLocaleTimeString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedSection>
          </>
        )}
      </div>
    </MainLayout>
  );
};
