export interface CreateTaskInput {
  title: string;
  description?: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';
  scheduledTime: string;
  buildingId: string;
  categoryId: string;
  assignedUserIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  frequency?: string;
  scheduledTime?: string;
  isActive?: boolean;
  buildingId?: string;
  categoryId?: string;
  assignedUserIds?: string[];
}
