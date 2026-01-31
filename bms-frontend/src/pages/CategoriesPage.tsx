import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import apiService from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Category {
  id: string;
  name: string;
  description?: string;
  buildingId: string;
  createdAt: string;
}

export const CategoriesPage: React.FC = () => {
  const { buildingId } = useParams<{ buildingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [building, setBuilding] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (!buildingId) {
      navigate('/buildings');
      return;
    }
    fetchBuildingAndCategories();
  }, [buildingId]);

  const fetchBuildingAndCategories = async () => {
    try {
      setLoading(true);
      // Fetch building
      const buildingResponse = await apiService.getBuildingById(buildingId!);
      setBuilding(buildingResponse.data?.data || buildingResponse.data);

      // Fetch categories
      const response = await apiService.getCategoriesByBuilding(buildingId!);
      const categoriesData = response.data?.categories || response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiService.updateCategory(buildingId!, editingId, formData);
      } else {
        await apiService.createCategory(buildingId!, formData);
      }
      setIsModalOpen(false);
      await fetchBuildingAndCategories();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiService.deleteCategory(buildingId!, id);
        await fetchBuildingAndCategories();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete category');
      }
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  if (loading) return <LoadingSpinner />;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/buildings')}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-secondary">
                {building?.name || 'Building'} - Categories
              </h1>
              <p className="text-gray-600">Manage equipment categories for this building</p>
            </div>
          </div>
          {isAdmin && (
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <Plus size={20} className="inline mr-2" />
              Add Category
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-secondary mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 text-sm mb-4">{category.description}</p>
              )}
              <p className="text-xs text-gray-500 mb-4">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/buildings/${buildingId}/categories/${category.id}/tasks`)}
                  className="flex-1"
                >
                  View Tasks
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenModal(category)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">No categories found for this building</p>
            {isAdmin && (
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Create First Category
              </Button>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g., Chillers, Lifts, HVAC"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Describe this category..."
              rows={3}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingId ? 'Update' : 'Create'} Category
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
