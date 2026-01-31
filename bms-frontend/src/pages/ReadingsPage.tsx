import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Plus, Check, X, MessageCircle, AlertCircle } from 'lucide-react';
import apiService from '../lib/api';
import { Reading, ReadingComment } from '../types/index';
import { useAuth } from '../context/AuthContext';

export const ReadingsPage: React.FC = () => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('PENDING');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [comments, setComments] = useState<ReadingComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    taskId: '',
    value: '',
    notes: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const buildingsResponse = await apiService.getBuildings(1, 50);
        const buildingsData = buildingsResponse.data?.buildings || buildingsResponse.data?.data || buildingsResponse.data || [];
        setBuildings(Array.isArray(buildingsData) ? buildingsData : []);

        // Get available tasks for reading (only those within 10-minute window)
        let tasksResponse;
        if (user?.role === 'TECHNICIAN') {
          tasksResponse = await apiService.getAvailableTasksForReading();
        } else {
          // Admins/supervisors can see all tasks for assigning readings
          tasksResponse = await apiService.getTasks(1, 50);
        }
        const tasksData = tasksResponse.data?.tasks || tasksResponse.data?.data || tasksResponse.data || [];
        setTasks(Array.isArray(tasksData) ? tasksData : []);

        // Load readings based on user role
        let readingsResponse;
        if (user?.role === 'TECHNICIAN') {
          // Technicians see their own reading history
          readingsResponse = await apiService.getMyReadingHistory(1, 50);
        } else {
          // Admins and supervisors see pending readings for approval
          readingsResponse = await apiService.getPendingReadings(1, 50);
        }
        const readingsData = readingsResponse.data?.readings || readingsResponse.data?.data || readingsResponse.data || [];
        setReadings(Array.isArray(readingsData) ? readingsData : []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load readings');
        setBuildings([]);
        setTasks([]);
        setReadings([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.role]);

  const handleSubmitReading = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.submitReading({
        taskId: formData.taskId,
        value: parseFloat(formData.value),
        notes: formData.notes,
      });
      setIsSubmitModalOpen(false);
      setFormData({ taskId: '', value: '', notes: '' });
      
      // Refresh based on user role
      let response;
      if (user?.role === 'TECHNICIAN') {
        response = await apiService.getMyReadingHistory(1, 50);
      } else {
        response = await apiService.getPendingReadings(1, 50);
      }
      const readingsData = response.data?.readings || response.data?.data || response.data || [];
      setReadings(Array.isArray(readingsData) ? readingsData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit reading');
    }
  };

  const handleApprove = async (readingId: string) => {
    try {
      await apiService.approveReading(readingId);
      const response = await apiService.getPendingReadings(1, 50);
      const readingsData = response.data?.readings || response.data?.data || response.data || [];
      setReadings(Array.isArray(readingsData) ? readingsData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to approve reading');
    }
  };

  const handleReject = async (readingId: string) => {
    try {
      await apiService.rejectReading(readingId);
      const response = await apiService.getPendingReadings(1, 50);
      const readingsData = response.data?.readings || response.data?.data || response.data || [];
      setReadings(Array.isArray(readingsData) ? readingsData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject reading');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReading || !newComment.trim()) return;

    try {
      await apiService.addReadingComment(selectedReading.id, newComment);
      setNewComment('');
      // Reload comments
      const response = await apiService.getPendingReadings(1, 50);
      const readingsData = response.data?.readings || response.data?.data || response.data || [];
      const updated = Array.isArray(readingsData) ? readingsData.find((r: Reading) => r.id === selectedReading.id) : undefined;
      if (updated) {
        setSelectedReading(updated);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';
  
  // For technicians, show pending tasks (tasks without readings)
  const pendingTasks = user?.role === 'TECHNICIAN' ? tasks.filter(task => {
    // Check if this task has a reading submitted
    const hasReading = readings.some(r => r.taskId === task.id);
    return !hasReading;
  }) : [];

  if (loading) return <LoadingSpinner />;

  const filteredReadings = readings.filter(r => !filter || r.status === filter);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-secondary">Readings</h1>
          <Button variant="primary" onClick={() => setIsSubmitModalOpen(true)}>
            <Plus size={20} className="inline mr-2" />
            Submit Reading
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Pending Tasks for Technicians */}
        {user?.role === 'TECHNICIAN' && pendingTasks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">Pending Tasks (Need Readings)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
                  <h3 className="font-semibold text-secondary mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <p>Building: {buildings.find(b => b.id === task.buildingId)?.name}</p>
                    <p>Category: {task.categoryId}</p>
                    {task.scheduledTime && (
                      <p className="text-blue-600 font-medium">
                        Scheduled: {new Date(task.scheduledTime).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setFormData({ ...formData, taskId: task.id });
                      setIsSubmitModalOpen(true);
                    }}
                  >
                    Submit Reading
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 bg-white rounded-lg shadow p-4">
          {['PENDING', 'APPROVED', 'REJECTED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Building</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredReadings.map(reading => (
                <tr key={reading.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {buildings.find(b => b.id === reading.buildingId)?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {categories.find(c => c.id === reading.categoryId)?.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-secondary">
                    {reading.value}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      reading.status === 'APPROVED' ? 'bg-green-50 text-success' :
                      reading.status === 'REJECTED' ? 'bg-red-50 text-danger' :
                      'bg-yellow-50 text-warning'
                    }`}>
                      {reading.status === 'APPROVED' && <Check size={14} />}
                      {reading.status === 'REJECTED' && <X size={14} />}
                      {reading.status === 'PENDING' && <AlertCircle size={14} />}
                      <span>{reading.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(reading.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedReading(reading);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        <MessageCircle size={16} />
                      </Button>
                      {isAdmin && reading.status === 'PENDING' && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(reading.id)}
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(reading.id)}
                          >
                            <X size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReadings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No {filter.toLowerCase()} readings found</p>
          </div>
        )}
      </div>

      {/* Submit Reading Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Reading"
      >
        <form onSubmit={handleSubmitReading} className="space-y-4">
          <div>
            <label className="label-base">Task *</label>
            <select
              value={formData.taskId}
              onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
              className="select-base"
              required
            >
              <option value="">Select Task</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-base">Value *</label>
            <input
              type="number"
              step="0.01"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="label-base">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-base"
              rows={3}
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full">
            Submit Reading
          </Button>
        </form>
      </Modal>

      {/* Reading Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Reading Details"
        size="lg"
      >
        {selectedReading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Value</p>
                <p className="text-2xl font-bold text-secondary">{selectedReading.value}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedReading.status === 'APPROVED' ? 'bg-green-50 text-success' :
                  selectedReading.status === 'REJECTED' ? 'bg-red-50 text-danger' :
                  'bg-yellow-50 text-warning'
                }`}>
                  {selectedReading.status}
                </span>
              </div>
            </div>

            {selectedReading.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="bg-gray-50 p-3 rounded-lg text-gray-700">{selectedReading.notes}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold text-secondary mb-4">Comments</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
                  </div>
                ))}
              </div>

              {isAdmin && selectedReading.status === 'PENDING' && (
                <form onSubmit={handleAddComment} className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <Button variant="primary" size="sm" type="submit">
                    Add
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
};
