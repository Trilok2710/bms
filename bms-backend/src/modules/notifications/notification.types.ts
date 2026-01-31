export interface Notification {
  id: string;
  userId: string;
  organizationId: string;
  type: 'READING_APPROVED' | 'READING_REJECTED' | 'TASK_COMMENTED' | 'TASK_ASSIGNED';
  title: string;
  message: string;
  taskId?: string;
  readingId?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationInput {
  userId: string;
  organizationId: string;
  type: Notification['type'];
  title: string;
  message: string;
  taskId?: string;
  readingId?: string;
}
