import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import apiService from '../lib/api';
import { Task } from '../types/index';
import { useAuth } from '../context/AuthContext';

const AnimatedRow = ({ children, index = 0 }: { children: React.ReactNode; index?: number }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {children}
    </motion.tr>
  );
};

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [staffSearchFilter, setStaffSearchFilter] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'DAILY',
    scheduledTime: '08:00',
    buildingId: '',
    categoryId: '',
    isActive: true,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const tasksResponse = await apiService.getTasks(1, 50);
        const tasksData = tasksResponse.data?.data?.tasks || tasksResponse.data?.tasks || tasksResponse.data?.data || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);

        const buildingsResponse = await apiService.getBuildings(1, 50);
        const buildingsData = buildingsResponse.data?.buildings || buildingsResponse.data?.data || buildingsResponse.data || [];
        setBuildings(Array.isArray(buildingsData) ? buildingsData : []);

        const staffResponse = await apiService.getStaff();
        const staffData = staffResponse.data?.data?.staff || staffResponse.data?.staff || staffResponse.data || [];
        setStaff(Array.isArray(staffData) ? staffData : []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load tasks');
        setTasks([]);
        setBuildings([]);
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedBuildingId || formData.buildingId) {
        const buildingId = selectedBuildingId || formData.buildingId;
        try {
          const response = await apiService.getCategoriesByBuilding(buildingId);
          setCategories(response.data);
        } catch (err) {
          setCategories([]);
        }
      }
    };
    fetchCategories();
  }, [selectedBuildingId, formData.buildingId]);

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        title: task.title,
        description: task.description || '',
        frequency: task.frequency,
        scheduledTime: task.scheduledTime,
        buildingId: task.buildingId,
        categoryId: task.categoryId,
        isActive: task.isActive,
      });
      setSelectedBuildingId(task.buildingId);
      // Pre-fill assigned staff
      if (task.assignments && Array.isArray(task.assignments)) {
        setSelectedStaff(task.assignments.map((a: any) => a.userId));
      }
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        frequency: 'DAILY',
        scheduledTime: '08:00',
        buildingId: '',
        categoryId: '',
        isActive: true,
      });
      setSelectedBuildingId('');
      setSelectedStaff([]);
    }
    setStaffSearchFilter('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate staff assignment
    if (selectedStaff.length === 0) {
      setError('Please assign this task to at least one staff member');
      return;
    }
    
    try {
      const taskData = { ...formData, assignedUserIds: selectedStaff };
      if (editingId) {
        await apiService.updateTask(editingId, taskData);
      } else {
        await apiService.createTask(taskData);
      }
      setIsModalOpen(false);
      setSelectedStaff([]);
      setError('');
      const response = await apiService.getTasks(1, 50);
      const tasksData = response.data?.tasks || response.data?.data || response.data || [];
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save task');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.deleteTask(id);
        const response = await apiService.getTasks(1, 50);
        const tasksData = response.data?.data?.tasks || response.data?.tasks || response.data?.data || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete task');
      }
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';

  // Filter staff based on search query
  const filteredStaff = useMemo(() => {
    if (!staffSearchFilter.trim()) return staff;
    const searchLower = staffSearchFilter.toLowerCase();
    return staff.filter(member => 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower)
    );
  }, [staff, staffSearchFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <h1 className="gradient-text text-4xl font-bold">Tasks</h1>
          {isAdmin && (
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Plus size={20} className="inline mr-2" />
              Add Task
            </Button>
          )}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-glass overflow-x-auto"
        >
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-white/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Frequency</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                {isAdmin && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tasks.map((task, idx) => (
                <AnimatedRow key={task.id} index={idx}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-secondary">{task.title}</p>
                      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{task.frequency}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{task.scheduledTime}</td>
                  <td className="px-6 py-4">
                    {task.isActive ? (
                      <span className="inline-flex items-center space-x-1 bg-green-50 text-success px-3 py-1 rounded-full text-xs font-semibold">
                        <CheckCircle size={14} />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-red-50 text-danger px-3 py-1 rounded-full text-xs font-semibold">
                        <XCircle size={14} />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenModal(task)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  )}
                </AnimatedRow>
              ))}
            </tbody>
          </table>
        </motion.div>

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">No tasks found</p>
            {isAdmin && (
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Create First Task
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Task' : 'Add Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-base">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="label-base">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-base"
              rows={3}
            />
          </div>

          <div>
            <label className="label-base">Building *</label>
            <select
              value={formData.buildingId}
              onChange={(e) => {
                setFormData({ ...formData, buildingId: e.target.value, categoryId: '' });
                setSelectedBuildingId(e.target.value);
              }}
              className="select-base"
              required
            >
              <option value="">Select Building</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {formData.buildingId && (
            <div>
              <label className="label-base">Category *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="select-base"
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label-base">Frequency *</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="select-base"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ONE_TIME">One Time</option>
            </select>
          </div>

          <div>
            <label className="label-base">Scheduled Time *</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Staff *</label>
            {staff.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">No staff members available in your organization</p>
            ) : (
              <>
                {/* Search Box */}
                <div className="mb-3 relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={staffSearchFilter}
                    onChange={(e) => setStaffSearchFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
                  />
                </div>

                {/* Staff List */}
                <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-56 overflow-y-auto">
                  {filteredStaff.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2 text-center">No staff members match your search</p>
                  ) : (
                    filteredStaff.map(member => (
                      <label key={member.id} className="flex items-start space-x-3 cursor-pointer hover:bg-blue-50 p-3 rounded border border-transparent hover:border-gray-200 transition">
                        <input
                          type="checkbox"
                          checked={selectedStaff.includes(member.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaff([...selectedStaff, member.id]);
                            } else {
                              setSelectedStaff(selectedStaff.filter(id => id !== member.id));
                            }
                          }}
                          className="w-4 h-4 mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-gray-600">{member.email}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="inline-block bg-gray-100 px-2 py-1 rounded">{member.role}</span>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">Select at least one staff member to assign this task to (Required)</p>
                {selectedStaff.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ {selectedStaff.length} staff member(s) selected</p>
                )}
              </>
            )}
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full">
            {editingId ? 'Update Task' : 'Create Task'}
          </Button>
        </form>
      </Modal>
    </MainLayout>
  );
};
