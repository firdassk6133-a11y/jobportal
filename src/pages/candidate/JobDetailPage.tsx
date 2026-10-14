import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Share2,
} from 'lucide-react';
import { useJobDetail } from '../../hooks/useJobs';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ApplicationFeeBadge } from '../../components/jobs/ApplicationFeeBadge';
import { ApplyModal } from '../../components/modals/ApplyModal';
import { Skeleton } from '../../components/ui/skeleton';
import { formatCurrencyINR, formatDate } from '../../lib/utils';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useJobDetail(id);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Job requisition not found</h2>
        <p className="text-sm text-slate-500">
          The opening you are looking for may have expired or been fulfilled.
        </p>
        <Link to="/jobs">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Open Vacancies
          </Button>
        </Link>
      </div>
    );
  }

  const isClosed = job.status === 'closed';

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        <span>Back to all jobs</span>
      </Link>

      {/* Main Job Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                {job.department || 'Technology'}
              </span>
              {job.employmentType && (
                <span className="text-xs text-slate-500 font-medium">
                  &bull; {job.employmentType}
                </span>
              )}
              {isClosed ? (
                <Badge variant="destructive">Requisition Closed</Badge>
              ) : (
                <Badge variant="success">Active Vacancy</Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {job.title}
            </h1>

            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>{job.client}</span>
              <span className="text-slate-300">&bull;</span>
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{job.location}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <ApplicationFeeBadge feeInInr={job.applicationFeeInr} size="lg" />
            <span className="text-xs text-slate-400">
              Posted: {formatDate(job.createdAt)}
            </span>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Annual CTC Range
            </span>
            <span className="text-sm font-bold text-slate-900">
              {formatCurrencyINR(job.salaryRange.min)} - {formatCurrencyINR(job.salaryRange.max)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Location
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {job.location.split('(')[0]}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Employment Type
            </span>
            <span className="text-sm font-semibold text-slate-800">
              {job.employmentType || 'Full-time'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">
              Application Fee
            </span>
            <span className="text-sm font-bold text-emerald-600">
              {formatCurrencyINR(job.applicationFeeInr)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">Role Overview</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">
              Key Requirements & Eligibility Criteria
            </h2>
            <ul className="space-y-2.5">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={handleShare}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Share Opening'}</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {!isClosed && (
              <Button
                size="lg"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
              >
                Apply for Position ({formatCurrencyINR(job.applicationFeeInr)})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}
