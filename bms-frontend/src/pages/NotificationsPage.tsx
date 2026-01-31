import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, ArrowLeft, Clock, Info } from 'lucide-react';
import apiService from '../lib/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  skip: number;
  take: number;
}

const NotificationCard = ({ notification, index, onRead, onDelete }: { 
  notification: Notification; 
  index: number;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`card-glass p-5 border-l-4 ${
        notification.isRead ? 'border-l-gray-300' : 'border-l-blue-500'
      } hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {notification.type === 'TASK_ASSIGNED' && <Bell className="text-blue-500" size={18} />}
            {notification.type === 'READING_SUBMITTED' && <Check className="text-green-500" size={18} />}
            {notification.type === 'READING_APPROVED' && <Check className="text-success" size={18} />}
            <h3 className="font-semibold text-gray-800">{notification.title}</h3>
            {!notification.isRead && <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
          </div>
          <p className="text-gray-600 text-sm mb-3">{notification.message}</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex gap-2">
          {!notification.isRead && (
            <button
              onClick={() => onRead(notification.id)}
              className="btn-icon-primary hover:scale-110 transition-transform"
              title="Mark as read"
            >
              <Check size={16} />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="btn-icon-danger hover:scale-110 transition-transform"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    skip: 0,
    take: 20,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getNotifications(page, 20);
      const data = response.data?.data || response.data;
      
      if (data?.notifications) {
        setNotifications(data.notifications);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        setNotifications([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await apiService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (pagination.total > 0) {
        setPagination({ ...pagination, total: pagination.total - 1 });
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(
        notifications.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'READING_APPROVED':
        return '✓';
      case 'READING_REJECTED':
        return '✕';
      case 'TASK_COMMENTED':
        return '💬';
      case 'TASK_ASSIGNED':
        return '📋';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'READING_APPROVED':
        return 'bg-green-50 border-green-200';
      case 'READING_REJECTED':
        return 'bg-red-50 border-red-200';
      case 'TASK_COMMENTED':
        return 'bg-blue-50 border-blue-200';
      case 'TASK_ASSIGNED':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-glass border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-200/50 rounded-lg transition hover:scale-110"
                title="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="gradient-text text-4xl font-bold">Notifications</h1>
              {pagination.total > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {pagination.total} {pagination.total === 1 ? 'notification' : 'notifications'}
                </motion.span>
              )}
            </div>
            {notifications.some(n => !n.isRead) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-700 font-medium transition bg-blue-50 px-4 py-2 rounded-lg"
              >
                Mark all as read
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-slideInDown"
          >
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 card-glass rounded-2xl"
          >
            <motion.div animate={{ y: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 3 }}>
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! No new notifications for now.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, idx) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                index={idx}
                onRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex justify-center items-center space-x-2"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition hover:scale-105"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105'
                        }`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition hover:scale-105"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
