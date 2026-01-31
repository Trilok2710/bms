import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../lib/api';
import { Building } from '../types/index';

export const BuildingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBuildings(1, 50);
      const buildingsData = response.data?.buildings || response.data?.data || response.data || [];
      setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load buildings');
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (building?: Building) => {
    if (building) {
      setEditingId(building.id);
      setFormData({
        name: building.name,
        description: building.description || '',
        location: building.location || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', location: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiService.updateBuilding(editingId, formData);
      } else {
        await apiService.createBuilding(formData);
      }
      setIsModalOpen(false);
      fetchBuildings();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save building');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await apiService.deleteBuilding(id);
        fetchBuildings();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete building');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-secondary">Buildings</h1>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            <Plus size={20} className="inline mr-2" />
            Add Building
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map(building => (
            <div key={building.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold text-secondary mb-2">{building.name}</h3>
              {building.description && (
                <p className="text-gray-600 text-sm mb-2">{building.description}</p>
              )}
              {building.location && (
                <p className="text-gray-500 text-sm mb-4">📍 {building.location}</p>
              )}
              <div className="flex flex-col space-y-2 mb-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/buildings/${building.id}/categories`)}
                  className="w-full"
                >
                  <Folder size={16} className="inline mr-2" />
                  View Categories
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenModal(building)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(building.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {buildings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No buildings found</p>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Create First Building
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Building' : 'Add Building'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Building address"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            {editingId ? 'Update Building' : 'Create Building'}
          </Button>
        </form>
      </Modal>
    </MainLayout>
  );
};
