import { Badge } from '../ui/badge';
import type { ApplicationStatus, PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
}

export function ApplicationStatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'APPLIED':
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-800 border-slate-300">
          Applied
        </Badge>
      );
    case 'UNDER_REVIEW':
      return (
        <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-300">
          Under Review
        </Badge>
      );
    case 'SHORTLISTED':
      return (
        <Badge variant="info" className="bg-sky-50 text-sky-800 border-sky-300">
          Shortlisted
        </Badge>
      );
    case 'CLIENT_INTERVIEW':
      return (
        <Badge variant="purple" className="bg-purple-50 text-purple-800 border-purple-300">
          Client Interview
        </Badge>
      );
    case 'HIRED':
      return (
        <Badge variant="success" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-bold">
          Hired / Placed
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge variant="destructive" className="bg-rose-50 text-rose-800 border-rose-300">
          Not Selected
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  switch (status) {
    case 'COMPLETED':
      return (
        <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-300">
          Paid & Verified
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="warning" className="bg-amber-50 text-amber-800 border-amber-300">
          Payment Pending
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="destructive" className="bg-rose-50 text-rose-800 border-rose-300">
          Payment Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
