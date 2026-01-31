import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Copy, Mail, Trash2, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN';
  createdAt: string;
}

export const StaffPage: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'SUPERVISOR' | 'TECHNICIAN'>('SUPERVISOR');

  useEffect(() => {
    fetchStaff();
    if (user?.role === 'ADMIN') {
      fetchInviteCode();
    }
  }, [user]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStaff();
      const staffData = response.data?.data?.staff || response.data?.staff || response.data || [];
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  const fetchInviteCode = async () => {
    try {
      const response = await apiService.getOrgInviteCode();
      setInviteCode(response.data?.inviteCode || '');
    } catch (err: any) {
      console.error('Failed to fetch invite code:', err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.sendStaffInvitation({
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      setShowInviteModal(false);
      alert('Invitation sent successfully!');
      await fetchStaff();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send invitation');
    }
  };

  const handleRemoveStaff = async (staffId: string) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await apiService.removeStaff(staffId);
        await fetchStaff();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to remove staff');
      }
    }
  };

  const getVisibleStaff = () => {
    if (user?.role === 'ADMIN') {
      return staff;
    } else if (user?.role === 'SUPERVISOR') {
      // Supervisors can see themselves and technicians
      return staff.filter(s => s.role === 'SUPERVISOR' || s.role === 'TECHNICIAN');
    }
    const currentUser = staff.find(s => s.id === user?.id);
    return currentUser ? [currentUser] : [];
  };

  const canManageStaff = user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';

  if (loading) return <LoadingSpinner />;

  const visibleStaff = getVisibleStaff();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-secondary">Staff Management</h1>
          {user?.role === 'ADMIN' && (
            <Button variant="primary" onClick={() => setShowInviteModal(true)}>
              <Mail size={20} className="inline mr-2" />
              Invite Staff
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Invite Code Section - Only for Admins */}
        {user?.role === 'ADMIN' && inviteCode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-secondary mb-4">Organization Invite Code</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Share this code with supervisors and technicians to join your organization:</p>
                <div className="bg-white border-2 border-blue-300 rounded-lg p-4 font-mono text-lg font-bold text-primary">
                  {inviteCode}
                </div>
              </div>
              <Button
                variant="primary"
                onClick={handleCopyCode}
              >
                <Copy size={20} className="inline mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              This code never expires. Anyone with this code can register as a Supervisor or Technician in your organization.
            </p>
          </div>
        )}

        {/* Staff List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                  {canManageStaff && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {visibleStaff.map(member => {
                  if (!member) return null;
                  return (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-secondary">{member.firstName} {member.lastName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          member.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' :
                          member.role === 'SUPERVISOR' ? 'bg-blue-50 text-blue-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      {canManageStaff && (
                        <td className="px-6 py-4">
                          {member.id !== user?.id && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRemoveStaff(member.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {visibleStaff.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No staff members found</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Staff Member"
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'SUPERVISOR' | 'TECHNICIAN')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            >
              <option value="SUPERVISOR">Supervisor</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-700">
              💡 Tip: You can also share the organization invite code for them to register themselves.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" className="flex-1">
              Send Invitation
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowInviteModal(false)}
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
