import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Building2,
  Calendar,
  IndianRupee,
  Download,
  ExternalLink,
  Clock,
  Sparkles,
  Inbox,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useMyApplications } from '../../hooks/useApplications';
import { fileService } from '../../services/fileService';
import { ApplicationStepper } from '../../components/applications/ApplicationStepper';
import {
  ApplicationStatusBadge,
  PaymentStatusBadge,
} from '../../components/applications/ApplicationStatusBadge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { formatCurrencyINR, formatDate } from '../../lib/utils';

export function MyApplicationsPage() {
  const { applications, isLoading, isError, refetch } = useMyApplications();
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const handleDownloadResume = async (resumeKey: string) => {
    setDownloadingKey(resumeKey);
    try {
      const { downloadUrl } = await fileService.getPresignedDownload(resumeKey);
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      alert(`Could not generate secure download link: ${err.message || 'Unknown error'}`);
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Job Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track hiring pipeline updates, recruiter notes, and payment verification receipts
          </p>
        </div>
        <Link to="/jobs">
          <Button variant="outline" size="sm" className="text-xs">
            <span>Explore More Vacancies</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 rounded-xl border border-slate-200 p-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't submitted any job applications yet. Browse our curated tech openings,
            upload your resume directly to Amazon S3, and start interviewing!
          </p>
          <Link to="/jobs">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Browse Open Positions
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const hiringStatus = app.hiringStatus || app.status || 'APPLIED';

            return (
              <Card
                key={app.appId}
                className="overflow-hidden border-slate-200/90 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <CardHeader className="p-5 pb-4 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                          Application #{app.appId.slice(0, 8)}
                        </span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="text-xs text-slate-400">
                          Submitted on {formatDate(app.createdAt)}
                        </span>
                        {app.recruiterCode && (
                          <span className="text-[11px] font-mono font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.2 rounded border border-indigo-200">
                            Referred by: {app.recruiterCode}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {app.jobTitle || `Job ID: ${app.jobId}`}
                      </h3>
                      {app.client && (
                        <p className="text-xs font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{app.client}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <PaymentStatusBadge status={app.paymentStatus} />
                      <ApplicationStatusBadge status={hiringStatus} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 sm:p-6 space-y-6">
                  {/* Visual 5-Step Hiring Stepper */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Live Hiring Pipeline Status
                    </h4>
                    <ApplicationStepper
                      status={hiringStatus}
                      updatedAt={app.updatedAt}
                    />
                  </div>

                  {/* Recruiter Feedback / Notes */}
                  {app.recruiterNotes && (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs">
                      <span className="font-bold text-indigo-900 block mb-1">
                        Recruiter Feedback / Next Steps:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {app.recruiterNotes}
                      </p>
                    </div>
                  )}

                  {/* Transaction & Document Meta Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        Processing Fee:{' '}
                        <strong className="text-slate-800 font-bold">
                          {formatCurrencyINR(app.applicationFee || 99)}
                        </strong>
                      </span>
                      {app.gatewayOrderId && (
                        <span>
                          Order Ref: <strong className="font-mono text-slate-700">{app.gatewayOrderId}</strong>
                        </span>
                      )}
                      {app.gatewayPaymentId && (
                        <span>
                          Payment Ref: <strong className="font-mono text-slate-700">{app.gatewayPaymentId}</strong>
                        </span>
                      )}
                    </div>

                    {/* Resume download button */}
                    {app.resumeKey && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloadingKey === app.resumeKey}
                        onClick={() => handleDownloadResume(app.resumeKey)}
                        className="text-xs h-8"
                      >
                        {downloadingKey === app.resumeKey ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                        ) : (
                          <Download className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        )}
                        <span>Download CV (.pdf)</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
