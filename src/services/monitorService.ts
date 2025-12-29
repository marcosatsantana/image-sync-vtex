import api from './api';

export interface HistoryItem {
  id: number;
  product_id: string;
  status: string;
  details: string;
  created_at: string;
}

export interface ErrorItem {
  id: number;
  error_code: string;
  message: string;
  stack_trace: string;
  context: any;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HistoryResponse {
  data: HistoryItem[];
  pagination: Pagination;
}

export const getHistory = async (page: number = 1, limit: number = 10, sku: string = '', startDate: string = '', endDate: string = '', status: string = ''): Promise<HistoryResponse> => {
  const params: any = { page, limit };
  if (sku) params.sku = sku;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (status && status !== 'All') params.status = status;

  const response = await api.get('/api/monitor/history', {
    params
  });
  return response.data;
};

export const getErrors = async (): Promise<ErrorItem[]> => {
  const response = await api.get('/api/monitor/errors');
  return response.data;
};

