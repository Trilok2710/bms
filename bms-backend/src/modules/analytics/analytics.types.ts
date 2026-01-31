export interface AnalyticsData {
  totalReadings: number;
  approvedReadings: number;
  pendingReadings: number;
  rejectedReadings: number;
  averageValue?: number;
  latestReadings: any[];
}

export interface ReadingTrendData {
  date: string;
  value: number;
  status: string;
}
