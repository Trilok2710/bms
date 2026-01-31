import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, ArrowLeft, Calendar, Clock, Search } from 'lucide-react';
import apiService from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  scheduledTime: string;
  buildingId: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  assignments?: any[];
}

export const CategoryTasksPage: React.FC = () => {
  const { buildingId, categoryId } = useParams<{ buildingId: string; categoryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [building, setBuilding] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    if (!buildingId || !categoryId) {
      navigate('/buildings');
      return;
    }
    fetchData();
  }, [buildingId, categoryId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch building
      const buildingResponse = await apiService.getBuildingById(buildingId!);
      setBuilding(buildingResponse.data?.data || buildingResponse.data);

      // Fetch category
      const categoriesResponse = await apiService.getCategoriesByBuilding(buildingId!);
      const categoriesData = Array.isArray(categoriesResponse.data?.categories) 
        ? categoriesResponse.data.categories 
        : Array.isArray(categoriesResponse.data?.data)
        ? categoriesResponse.data.data
        : [];
      const cat = categoriesData.find((c: any) => c.id === categoryId);
      setCategory(cat);

      // Fetch all tasks and filter by category
      const tasksResponse = await apiService.getTasks(1, 100);
      const tasksData = tasksResponse.data?.data?.tasks || tasksResponse.data?.tasks || tasksResponse.data?.data || [];
      const categoryTasks = Array.isArray(tasksData) 
        ? tasksData.filter((t: Task) => t.categoryId === categoryId) 
        : [];
      setTasks(categoryTasks);

      // Fetch staff
      const staffResponse = await apiService.getStaff();
      const staffData = staffResponse.data?.data?.staff || staffResponse.data?.staff || staffResponse.data || [];
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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
        buildingId: buildingId || '',
        categoryId: categoryId || '',
        isActive: true,
      });
      setSelectedStaff([]);
    }
    setStaffSearchFilter('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save task');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.deleteTask(id);
        await fetchData();
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/buildings/${buildingId}/categories`)}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-secondary">
                {category?.name || 'Category'} - Tasks
              </h1>
              <p className="text-gray-600">{building?.name} / {category?.name}</p>
            </div>
          </div>
          {isAdmin && (
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Plus size={20} className="inline mr-2" />
              Add Task
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-secondary mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              )}
              
              <div className="space-y-2 mb-4 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock size={14} />
                  <span>{task.scheduledTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={14} />
                  <span>Frequency: {task.frequency}</span>
                </div>
                {task.assignments && task.assignments.length > 0 && (
                  <div className="bg-blue-50 p-2 rounded mt-2">
                    <p className="font-medium text-blue-900">Assigned to:</p>
                    <ul className="text-blue-800">
                      {task.assignments.map((a: any) => (
                        <li key={a.userId}>• {a.user?.firstName} {a.user?.lastName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {isAdmin && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(task)}
                      className="flex-1"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="flex-1"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">No tasks found for this category</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="ONE_TIME">One Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time *</label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assign To Staff *</label>
            {staff.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">No staff members available</p>
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

                <p className="text-xs text-gray-500 mt-2">Select at least one staff member (Required)</p>
                {selectedStaff.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">✓ {selectedStaff.length} staff member(s) selected</p>
                )}
              </>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {editingId ? 'Update Task' : 'Create Task'}
          </Button>
        </form>
      </Modal>
    </MainLayout>
  );
};
