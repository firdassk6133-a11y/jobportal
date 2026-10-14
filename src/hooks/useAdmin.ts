import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, type ApplicationFilterParams } from '../services/adminService';
import type { Application, ApplicationStatus, ReferralAnalytics } from '../types';

export function useAdminApplications(filters?: ApplicationFilterParams) {
  const queryClient = useQueryClient();

  const query = useQuery<Application[]>({
    queryKey: ['admin', 'applications', filters],
    queryFn: () => adminService.listApplications(filters),
    staleTime: 30 * 1000,
  });

  // Optimistic UI updates for hiring status transitions
  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      notes,
    }: {
      id: string;
      status: ApplicationStatus;
      notes?: string;
    }) => adminService.updateApplicationStatus(id, status, notes),

    onMutate: async ({ id, status, notes }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['admin', 'applications'] });

      // Snapshot previous value across queries
      const previousApplications = queryClient.getQueryData<Application[]>([
        'admin',
        'applications',
        filters,
      ]);

      // Optimistically update cache
      if (previousApplications) {
        queryClient.setQueryData<Application[]>(
          ['admin', 'applications', filters],
          previousApplications.map((app) =>
            app.appId === id
              ? {
                  ...app,
                  hiringStatus: status,
                  status,
                  recruiterNotes: notes ?? app.recruiterNotes,
                  updatedAt: new Date().toISOString(),
                }
              : app
          )
        );
      }

      return { previousApplications };
    },

    onError: (_err, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousApplications) {
        queryClient.setQueryData(
          ['admin', 'applications', filters],
          context.previousApplications
        );
      }
    },

    onSettled: () => {
      // Invalidate both admin and candidate queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'referrals'] });
    },
  });

  return {
    applications: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}

export function useReferralAnalytics() {
  return useQuery<ReferralAnalytics>({
    queryKey: ['admin', 'referrals'],
    queryFn: () => adminService.getReferralAnalytics(),
    staleTime: 60 * 1000,
  });
}
