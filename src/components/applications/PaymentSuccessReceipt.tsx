import { CheckCircle2, Download, ExternalLink, Calendar, Hash, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { formatCurrencyINR, formatDateTime } from '../../lib/utils';

interface PaymentSuccessReceiptProps {
  orderId: string;
  paymentId: string;
  jobTitle: string;
  client: string;
  amountInr: number;
  recruiterCode?: string;
  onClose: () => void;
}

export function PaymentSuccessReceipt({
  orderId,
  paymentId,
  jobTitle,
  client,
  amountInr,
  recruiterCode,
  onClose,
}: PaymentSuccessReceiptProps) {
  const now = new Date().toISOString();

  return (
    <div className="space-y-6 text-center py-2">
      {/* Animated Checkmark */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-10 w-10 animate-in zoom-in-75 duration-300" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900">Application Submitted!</h3>
        <p className="text-sm text-slate-500 mt-1">
          Your payment of{' '}
          <strong className="text-slate-900 font-bold">{formatCurrencyINR(amountInr)}</strong> was
          successfully processed.
        </p>
      </div>

      {/* Receipt Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-left text-xs space-y-2.5">
        <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
          <span className="text-slate-500">Position Applied:</span>
          <span className="font-semibold text-slate-900 truncate max-w-[200px]">
            {jobTitle}
          </span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
          <span className="text-slate-500">Hiring Partner:</span>
          <span className="font-medium text-slate-900">{client}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
          <span className="text-slate-500">Order ID:</span>
          <span className="font-mono text-slate-700">{orderId}</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
          <span className="text-slate-500">Payment Reference:</span>
          <span className="font-mono text-slate-700">{paymentId}</span>
        </div>
        {recruiterCode && (
          <div className="flex justify-between items-center py-1 border-b border-slate-200/80">
            <span className="text-slate-500">Recruiter Attribution:</span>
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {recruiterCode}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500">Date & Time:</span>
          <span className="text-slate-700">{formatDateTime(now)}</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Our recruitment team has received your resume and application. You can track your hiring
        progress in real-time from the <strong>My Applications</strong> portal.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link to="/applications/me" onClick={onClose} className="w-full sm:w-auto">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <span>Track in My Applications</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
        <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
          Done
        </Button>
      </div>
    </div>
  );
}
