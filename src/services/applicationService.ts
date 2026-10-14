import { apiClient } from './apiClient';
import type { ApiResponse, Application, PaymentOrder } from '../types';

export interface CreateOrderPayload {
  jobId: string;
  resumeKey: string;
  recruiterCode?: string;
  candidateNotes?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriodDays?: number;
  skills?: string[];
}

export const applicationService = {
  async createOrder(payload: CreateOrderPayload): Promise<PaymentOrder> {
    const res = await apiClient.post<ApiResponse<PaymentOrder>>(
      '/applications/create-order',
      payload
    );
    return res.data.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await apiClient.get<ApiResponse<{ applications: Application[] }>>(
      '/applications/me'
    );
    return res.data.data.applications;
  },

  async simulatePaymentWebhook(payload: {
    gatewayOrderId: string;
    gatewayPaymentId?: string;
    signature?: string;
  }): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.post<ApiResponse<any>>('/payments/webhook', {
      orderId: payload.gatewayOrderId,
      paymentId: payload.gatewayPaymentId || `pay_sim_${Date.now()}`,
      gatewayOrderId: payload.gatewayOrderId,
      gatewayPaymentId: payload.gatewayPaymentId || `pay_sim_${Date.now()}`,
      status: 'captured',
    });
    return res.data;
  },
};
