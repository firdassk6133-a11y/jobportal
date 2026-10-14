export type UserRole = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';

export interface User {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  referralCode?: string;
  createdAt?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export type JobStatus = 'open' | 'closed';

export interface Job {
  jobId: string;
  title: string;
  client: string;
  description: string;
  requirements: string[];
  location: string;
  department?: string;
  employmentType?: string;
  salaryRange: SalaryRange;
  applicationFeeInr: number;
  status: JobStatus;
  createdAt: string;
  updatedAt?: string;
  // Backward-compatible raw API fields returned by the backend.
  salaryMin?: number;
  salaryMax?: number;
  applicationFee?: number;
  currency?: string;
}

export type ApplicationStatus =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'CLIENT_INTERVIEW'
  | 'HIRED'
  | 'REJECTED';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Application {
  appId: string;
  jobId: string;
  candidateId: string;
  resumeKey: string;
  recruiterCode?: string;
  recruiterId?: string;
  paymentStatus: PaymentStatus;
  hiringStatus: ApplicationStatus;
  status?: ApplicationStatus; // backward compatibility
  applicationFee: number;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateNotes?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriodDays?: number;
  skills?: string[];
  recruiterNotes?: string;
  createdAt: string;
  updatedAt?: string;
  // Enriched fields
  jobTitle?: string;
  client?: string;
}

export interface PaymentOrder {
  appId: string;
  orderId: string;
  amountInInr: number;
  amountInPaise: number;
  currency: string;
  keyId?: string;
  status: PaymentStatus;
}

export interface Recruiter {
  recruiterCode: string;
  name?: string;
  recruiterName?: string;
  email?: string;
  phone?: string;
  applicantCount?: number;
  totalApplications?: number;
  totalPaidApplications?: number;
  totalFeeRevenueInr: number;
  conversionRate?: number;
}

export interface ReferralAnalytics {
  recruiters: Recruiter[];
  totals?: {
    totalApplicants: number;
    totalRevenueInr: number;
    activeRecruiters: number;
  };
  summary?: {
    totalRecruiters: number;
    totalApplications: number;
    totalPaidApplications: number;
    totalRevenueInr: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedJobsResponse {
  jobs: Job[];
  nextCursor?: string;
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string;
  expiresInSeconds: number;
}

export interface PresignedDownloadResponse {
  downloadUrl: string;
  fileKey: string;
  expiresInSeconds: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
