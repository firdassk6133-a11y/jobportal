import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  applicationService,
  type CreateOrderPayload,
} from '../services/applicationService';
import type { Application, PaymentOrder } from '../types';

export function useMyApplications() {
  const queryClient = useQueryClient();

  const query = useQuery<Application[]>({
    queryKey: ['applications', 'me'],
    queryFn: () => applicationService.getMyApplications(),
    staleTime: 30 * 1000,
  });

  const createOrderMutation = useMutation<PaymentOrder, Error, CreateOrderPayload>({
    mutationFn: (payload: CreateOrderPayload) => applicationService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'me'] });
    },
  });

  const simulatePaymentMutation = useMutation<
    { success: boolean; message?: string },
    Error,
    { gatewayOrderId: string; gatewayPaymentId?: string }
  >({
    mutationFn: (payload) => applicationService.simulatePaymentWebhook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'referrals'] });
    },
  });

  return {
    applications: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    createOrder: createOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    simulatePayment: simulatePaymentMutation.mutateAsync,
    isSimulatingPayment: simulatePaymentMutation.isPending,
  };
}
