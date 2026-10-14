import { Building2, MapPin, Briefcase, ArrowRight, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Job } from '../../types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ApplicationFeeBadge } from './ApplicationFeeBadge';
import { formatCurrencyINR, formatDate } from '../../lib/utils';

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const isClosed = job.status === 'closed';

  return (
    <Card className="hover:shadow-lg transition-all border-slate-200/90 flex flex-col justify-between group overflow-hidden bg-white">
      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {job.department || 'Technology'}
                </span>
                {job.employmentType && (
                  <span className="text-xs text-slate-500 font-medium">
                    &bull; {job.employmentType}
                  </span>
                )}
                {isClosed && (
                  <Badge variant="destructive" className="ml-auto">
                    Closed
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{job.client}</span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 pb-3 space-y-3">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-slate-700">
              <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {formatCurrencyINR(job.salaryRange?.min||0)} -{' '}
                {formatCurrencyINR(job.salaryRange?.max||0)} / yr
              </span>
            </div>
          </div>

          {/* Requirements Badges */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.requirements.slice(0, 3).map((req, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                >
                  {req.length > 25 ? `${req.slice(0, 25)}...` : req}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
        <ApplicationFeeBadge feeInInr={job.applicationFeeInr} size="sm" />

        <div className="flex items-center space-x-2">
          <Link to={`/jobs/${job.jobId}`}>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </Link>
          {!isClosed && onApply && (
            <Button
              size="sm"
              onClick={() => onApply(job)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
            >
              <span>Apply</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
