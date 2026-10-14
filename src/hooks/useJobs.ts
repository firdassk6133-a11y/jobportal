import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService, type CreateJobPayload } from '../services/jobService';
import type { Job } from '../types';

export function useJobs(params?: { status?: 'open' | 'closed'; limit?: number; cursor?: string }) {
  const queryClient = useQueryClient();

  const jobsQuery = useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobService.listJobs(params),
    staleTime: 60 * 1000,
  });

  const createJobMutation = useMutation({
    mutationFn: (payload: CreateJobPayload) => jobService.createJob(payload),
    onSuccess: (newJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['job', newJob.jobId], newJob);
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateJobPayload> }) =>
      jobService.updateJob(id, payload),
    onSuccess: (updatedJob) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.setQueryData(['job', updatedJob.jobId], updatedJob);
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  return {
    jobs: jobsQuery.data?.jobs ?? [],
    nextCursor: jobsQuery.data?.nextCursor,
    isLoading: jobsQuery.isLoading,
    isError: jobsQuery.isError,
    error: jobsQuery.error,
    refetch: jobsQuery.refetch,
    createJob: createJobMutation.mutateAsync,
    isCreating: createJobMutation.isPending,
    updateJob: updateJobMutation.mutateAsync,
    isUpdating: updateJobMutation.isPending,
    deleteJob: deleteJobMutation.mutateAsync,
    isDeleting: deleteJobMutation.isPending,
  };
}

export function useJobDetail(jobId?: string) {
  return useQuery<Job>({
    queryKey: ['job', jobId],
    queryFn: () => {
      if (!jobId) throw new Error('Job ID is required');
      return jobService.getJob(jobId);
    },
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000,
  });
}
