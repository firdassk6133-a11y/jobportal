import { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  X,
  Building2,
  Calendar,
  IndianRupee,
  Loader2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useAdminApplications } from '../../hooks/useAdmin';
import { useJobs } from '../../hooks/useJobs';
import { fileService } from '../../services/fileService';
import { RECRUITER_TEAM } from '../../config/recruiters';
import type { ApplicationStatus } from '../../types';
import { ApplicationStatusDropdown } from '../../components/admin/ApplicationStatusDropdown';
import { CandidatePopover } from '../../components/admin/CandidatePopover';
import { PaymentStatusBadge } from '../../components/applications/ApplicationStatusBadge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { formatCurrencyINR, formatDate } from '../../lib/utils';

export function AdminApplicationsPage() {
  const { applications, isLoading, updateStatus, isUpdatingStatus } = useAdminApplications();
  const { jobs } = useJobs();

  // Multi-filters
  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRecruiter, setSelectedRecruiter] = useState('ALL');
  const [downloadingResumeKey, setDownloadingResumeKey] = useState<string | null>(null);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const hiringStatus = app.hiringStatus || app.status || 'APPLIED';

      // Search match: candidate name, email, phone, job title
      const matchesSearch =
        !search.trim() ||
        app.candidateName?.toLowerCase().includes(search.toLowerCase()) ||
        app.candidateEmail?.toLowerCase().includes(search.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        app.appId.toLowerCase().includes(search.toLowerCase());

      // Job match
      const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;

      // Status match
      const matchesStatus = selectedStatus === 'ALL' || hiringStatus === selectedStatus;

      // Recruiter match
      const matchesRecruiter =
        selectedRecruiter === 'ALL' ||
        (selectedRecruiter === 'DIRECT' && !app.recruiterCode) ||
        app.recruiterCode?.toUpperCase() === selectedRecruiter.toUpperCase();

      return matchesSearch && matchesJob && matchesStatus && matchesRecruiter;
    });
  }, [applications, search, selectedJobId, selectedStatus, selectedRecruiter]);

  const handleDownloadCV = async (fileKey: string) => {
    setDownloadingResumeKey(fileKey);
    try {
      const { downloadUrl } = await fileService.getPresignedDownload(fileKey);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(`Could not download CV: ${err.message || 'Presigned URL generation failed'}`);
    } finally {
      setDownloadingResumeKey(null);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedJobId('ALL');
    setSelectedStatus('ALL');
    setSelectedRecruiter('ALL');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedJobId !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedRecruiter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Candidate Applications Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master applicant registry with one-click pipeline stage updates, CV downloads, and 10-member recruiter attribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
            Total Matches: <strong className="text-indigo-600">{filteredApplications.length}</strong>
          </span>
        </div>
      </div>

      {/* Multi-Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name, email..."
              className="pl-9 h-10 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          {/* Job Filter */}
          <div>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Requisitions ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job.jobId} value={job.jobId}>
                  {job.title.slice(0, 32)} ({job.client})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Hiring Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="CLIENT_INTERVIEW">Client Interview</option>
              <option value="HIRED">Hired / Placed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Recruiter Attribution Filter */}
          <div>
            <select
              value={selectedRecruiter}
              onChange={(e) => setSelectedRecruiter(e.target.value)}
              className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-semibold"
            >
              <option value="ALL">All Recruiter Codes (10)</option>
              <option value="DIRECT">Direct (No Referral)</option>
              {RECRUITER_TEAM.map((rec) => (
                <option key={rec.code} value={rec.code}>
                  {rec.code} &bull; {rec.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-500">Filtered view active</span>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Applications Master Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Position & Client</TableHead>
              <TableHead>Attribution</TableHead>
              <TableHead>Fee Payment</TableHead>
              <TableHead>Pipeline Status (Update)</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Applied On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-400">
                  Loading applicant pipeline...
                </TableCell>
              </TableRow>
            ) : filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-slate-400">
                  No candidate applications match the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => {
                const hiringStatus = app.hiringStatus || app.status || 'APPLIED';

                return (
                  <TableRow key={app.appId} className="text-xs hover:bg-slate-50/80">
                    {/* Candidate Name + Info Popover */}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs shrink-0">
                          {(app.candidateName || 'C').charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900">
                              {app.candidateName || 'Anonymous Candidate'}
                            </span>
                            <CandidatePopover application={app} />
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                            {app.candidateEmail || 'No email provided'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Position & Client */}
                    <TableCell>
                      <div className="space-y-0.5 max-w-[200px]">
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {app.jobTitle || `Job #${app.jobId.slice(0, 8)}`}
                        </span>
                        {app.client && (
                          <span className="text-[11px] text-slate-500 block">
                            {app.client}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Recruiter Attribution */}
                    <TableCell>
                      {app.recruiterCode ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {app.recruiterCode}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Direct</span>
                      )}
                    </TableCell>

                    {/* Fee Payment */}
                    <TableCell>
                      <div className="space-y-1">
                        <PaymentStatusBadge status={app.paymentStatus} />
                        <span className="text-[11px] text-slate-500 font-semibold block">
                          {formatCurrencyINR(app.applicationFee || 99)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Pipeline Status Dropdown (Optimistic update) */}
                    <TableCell>
                      <ApplicationStatusDropdown
                        currentStatus={hiringStatus}
                        onSelectStatus={async (newStatus: ApplicationStatus) => {
                          await updateStatus({
                            id: app.appId,
                            status: newStatus,
                            notes: `Status shifted to ${newStatus} on ${new Date().toLocaleDateString()}`,
                          });
                        }}
                      />
                    </TableCell>

                    {/* S3 Presigned Resume Download */}
                    <TableCell>
                      {app.resumeKey ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={downloadingResumeKey === app.resumeKey}
                          onClick={() => handleDownloadCV(app.resumeKey)}
                          className="h-8 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                          title="Generate Presigned S3 Download"
                        >
                          {downloadingResumeKey === app.resumeKey ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3.5 w-3.5 mr-1" />
                          )}
                          <span>Resume</span>
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No file</span>
                      )}
                    </TableCell>

                    {/* Applied Date */}
                    <TableCell className="text-slate-400 text-[11px]">
                      {formatDate(app.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
