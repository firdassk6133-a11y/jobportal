import { apiClient } from './apiClient';
import type { ApiResponse, Application, ApplicationStatus, ReferralAnalytics } from '../types';

export interface ApplicationFilterParams {
  jobId?: string;
  status?: string;
  recruiterCode?: string;
}

export const adminService = {
  async listApplications(params?: ApplicationFilterParams): Promise<Application[]> {
    const res = await apiClient.get<ApiResponse<{ applications: Application[] }>>(
      '/admin/applications',
      { params }
    );
    return res.data.data.applications;
  },

  async updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<Application> {
    const res = await apiClient.patch<ApiResponse<{ application: Application }>>(
      `/admin/applications/${id}/status`,
      { status, notes }
    );
    return res.data.data.application;
  },

  async getReferralAnalytics(): Promise<ReferralAnalytics> {
    const res = await apiClient.get<ApiResponse<any>>(
      '/admin/analytics/referrals'
    );
    const raw = res.data.data;
    const summary = raw?.summary;
    const totals = raw?.totals || {
      totalApplicants: summary?.totalApplications ?? 0,
      totalRevenueInr: summary?.totalRevenueInr ?? 0,
      activeRecruiters: summary?.totalRecruiters ?? 0,
    };

    const recruiters = (raw?.recruiters || []).map((r: any) => ({
      ...r,
      applicantCount: r.applicantCount ?? r.totalApplications ?? 0,
      totalApplications: r.totalApplications ?? r.applicantCount ?? 0,
      name: r.name ?? r.recruiterName ?? '',
      recruiterName: r.recruiterName ?? r.name ?? '',
      totalFeeRevenueInr: r.totalFeeRevenueInr ?? 0,
      conversionRate: r.conversionRate ?? 0,
    }));

    return {
      ...raw,
      summary: summary || {
        totalRecruiters: totals.activeRecruiters,
        totalApplications: totals.totalApplicants,
        totalPaidApplications: totals.totalApplicants,
        totalRevenueInr: totals.totalRevenueInr,
      },
      totals,
      recruiters,
    };
  },
};
