import { apiClient } from './apiClient';
import type { ApiResponse, Job, PaginatedJobsResponse } from '../types';

export interface CreateJobPayload {
  title: string;
  client: string;
  description: string;
  requirements: string[];
  location: string;
  department?: string;
  employmentType?: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  applicationFeeInr: number;
  status: 'open' | 'closed';
}

function normalizeJob(rawJob: Partial<Job> & { salaryMin?: number; salaryMax?: number; applicationFee?: number; currency?: string }): Job {
  const salaryMin = Number(rawJob.salaryRange?.min ?? rawJob.salaryMin ?? 0);
  const salaryMax = Number(rawJob.salaryRange?.max ?? rawJob.salaryMax ?? salaryMin);

  return {
    ...rawJob,
    jobId: rawJob.jobId ?? '',
    title: rawJob.title ?? '',
    client: rawJob.client ?? '',
    description: rawJob.description ?? '',
    requirements: Array.isArray(rawJob.requirements) ? rawJob.requirements : [],
    location: rawJob.location ?? '',
    department: rawJob.department ?? '',
    employmentType: rawJob.employmentType ?? '',
    salaryRange: {
      min: salaryMin,
      max: salaryMax,
      currency: rawJob.salaryRange?.currency ?? rawJob.currency ?? 'INR',
    },
    applicationFeeInr: Number(rawJob.applicationFeeInr ?? rawJob.applicationFee ?? 0),
    status: rawJob.status === 'closed' ? 'closed' : 'open',
    createdAt: rawJob.createdAt ?? new Date().toISOString(),
  };
}

export const jobService = {
  async listJobs(params?: {
    status?: 'open' | 'closed';
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedJobsResponse> {
    const res = await apiClient.get<ApiResponse<PaginatedJobsResponse>>('/jobs', {
      params,
    });

    return {
      ...res.data.data,
      jobs: (res.data.data.jobs ?? []).map((job) => normalizeJob(job as Partial<Job>)),
    };
  },

  async getJob(id: string): Promise<Job> {
    const res = await apiClient.get<ApiResponse<{ job: Job }>>(`/jobs/${id}`);
    const rawJob = res.data.data as Partial<Job>;
    return normalizeJob(rawJob);
  },

  async createJob(payload: CreateJobPayload): Promise<Job> {
    const res = await apiClient.post<ApiResponse<{ job: Job }>>('/admin/jobs', payload);
    const rawJob = res.data.data as Partial<Job>;
    return normalizeJob(rawJob);
  },

  async updateJob(id: string, payload: Partial<CreateJobPayload>): Promise<Job> {
    const res = await apiClient.put<ApiResponse<{ job: Job }>>(`/admin/jobs/${id}`, payload);
    const rawJob = res.data.data as Partial<Job>;
    return normalizeJob(rawJob);
  },

  async deleteJob(id: string): Promise<{ message: string; jobId: string }> {
    const res = await apiClient.delete<ApiResponse<{ message: string; jobId: string }>>(
      `/admin/jobs/${id}`
    );
    return res.data.data;
  },
};
