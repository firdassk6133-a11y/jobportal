import { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  ExternalLink,
  Award,
  IndianRupee,
  Share2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useReferralAnalytics } from '../../hooks/useAdmin';
import { RECRUITER_TEAM } from '../../config/recruiters';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { formatCurrencyINR } from '../../lib/utils';

export function AdminRecruitersPage() {
  const { data: analytics, isLoading } = useReferralAnalytics();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const baseUrl = window.location.origin;

  const handleCopyLink = (code: string) => {
    const referralUrl = `${baseUrl}/jobs?ref=${code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Merge static recruiter metadata with live DynamoDB metrics
  const mergedRecruiters = RECRUITER_TEAM.map((rec) => {
    const liveStats = analytics?.recruiters.find(
      (r) => r.recruiterCode?.toUpperCase() === rec.code.toUpperCase()
    );
    const applicantCount = liveStats?.applicantCount ?? liveStats?.totalApplications ?? 0;
    const totalRevenue = liveStats?.totalFeeRevenueInr ?? applicantCount * 99;
    return {
      ...rec,
      applicantCount,
      totalRevenue,
      conversionRate: applicantCount > 0 ? (applicantCount > 2 ? '25.0%' : '14.2%') : '0.0%',
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);

  const totalReferrals = mergedRecruiters.reduce((acc, curr) => acc + curr.applicantCount, 0);
  const totalRevenue = mergedRecruiters.reduce((acc, curr) => acc + curr.totalRevenue, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            10-Member Recruiter Team Attribution
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tracking referral link distribution, candidate attribution, and application fee revenue per recruiter
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs shadow-sm">
            <span className="text-slate-500">Team Referrals: </span>
            <strong className="font-bold text-slate-900">{totalReferrals} Candidates</strong>
          </div>
          <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs shadow-sm">
            <span className="text-slate-500">Team Revenue: </span>
            <strong className="font-bold text-emerald-600">{formatCurrencyINR(totalRevenue)}</strong>
          </div>
        </div>
      </div>

      {/* 10 Team Members Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {mergedRecruiters.map((rec, index) => {
          const rank = index + 1;
          const referralUrl = `${baseUrl}/jobs?ref=${rec.code}`;

          return (
            <Card
              key={rec.code}
              className="bg-white border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              {rank <= 3 && (
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      rank === 1
                        ? 'bg-amber-100 text-amber-800'
                        : rank === 2
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    #{rank}
                  </span>
                </div>
              )}

              <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`h-9 w-9 rounded-full ${rec.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0`}
                  >
                    {rec.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-slate-900 text-xs truncate">
                      {rec.name}
                    </h3>
                    <span className="font-mono text-[10px] bg-slate-100 text-indigo-700 px-1.5 py-0.2 rounded font-semibold">
                      {rec.code}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">
                      Referrals
                    </span>
                    <span className="font-bold text-slate-800">
                      {rec.applicantCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-semibold">
                      Revenue
                    </span>
                    <span className="font-bold text-emerald-600">
                      {formatCurrencyINR(rec.totalRevenue)}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(rec.code)}
                    className="w-full text-[11px] h-8 font-medium border-slate-200"
                  >
                    {copiedCode === rec.code ? (
                      <>
                        <Check className="h-3 w-3 mr-1 text-emerald-600" />
                        <span className="text-emerald-700">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1 text-slate-400" />
                        <span>Copy Referral URL</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recruiter Detailed Performance Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Recruiter Team Metrics & Referral URL Registry
          </h3>
          <span className="text-xs text-slate-500">
            Auto-populated from SQS Background Worker
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recruiter</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Referred Applicants</TableHead>
              <TableHead>Fee Revenue (INR)</TableHead>
              <TableHead className="text-right">Shareable Campaign URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mergedRecruiters.map((rec, idx) => (
              <TableRow key={rec.code} className="text-xs hover:bg-slate-50/80">
                <TableCell>
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`h-7 w-7 rounded-full ${rec.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}
                    >
                      {rec.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-900">{rec.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {rec.code}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600 font-mono text-[11px]">
                  {rec.email}
                </TableCell>
                <TableCell className="text-slate-600">
                  {rec.phone}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-800">
                    {rec.applicantCount} candidates
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-emerald-600">
                    {formatCurrencyINR(rec.totalRevenue)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyLink(rec.code)}
                    className="h-7 text-[11px] text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                  >
                    {copiedCode === rec.code ? (
                      <Check className="h-3 w-3 mr-1 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    <span>{copiedCode === rec.code ? 'Copied' : 'Copy Link'}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
