import { Trophy, Award, TrendingUp, IndianRupee, Users } from 'lucide-react';
import type { Recruiter } from '../../types';
import { formatCurrencyINR } from '../../lib/utils';
import { RECRUITER_TEAM } from '../../config/recruiters';

interface LeaderboardProps {
  recruiters: Recruiter[];
  limit?: number;
}

export function RecruiterLeaderboard({ recruiters, limit }: LeaderboardProps) {
  // Merge static recruiter metadata with live stats from DynamoDB
  const mergedRecruiters = RECRUITER_TEAM.map((teamMember) => {
    const liveStats = recruiters.find(
      (r) => r.recruiterCode?.toUpperCase() === teamMember.code.toUpperCase()
    );
    const applicantCount = liveStats?.applicantCount ?? liveStats?.totalApplications ?? 0;
    const totalFeeRevenueInr = liveStats?.totalFeeRevenueInr ?? applicantCount * 99;
    const conversionRate = liveStats?.conversionRate ?? (applicantCount > 0 ? 18.5 : 0);

    return {
      ...teamMember,
      applicantCount,
      totalFeeRevenueInr,
      conversionRate,
    };
  }).sort((a, b) => b.totalFeeRevenueInr - a.totalFeeRevenueInr);

  const displayList = limit ? mergedRecruiters.slice(0, limit) : mergedRecruiters;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">
            Recruiter Referral Leaderboard (10 Team Members)
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Ranked by Fee Revenue</span>
      </div>

      <div className="divide-y divide-slate-100">
        {displayList.map((rec, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;

          return (
            <div
              key={rec.code}
              className="flex items-center justify-between p-3 sm:px-4 hover:bg-slate-50/80 transition-colors text-xs"
            >
              <div className="flex items-center space-x-3">
                {/* Rank Badge */}
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                    rank === 1
                      ? 'bg-amber-100 text-amber-800'
                      : rank === 2
                      ? 'bg-slate-200 text-slate-700'
                      : rank === 3
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-slate-400'
                  }`}
                >
                  {rank}
                </span>

                {/* Avatar & Name */}
                <div className={`h-8 w-8 rounded-full ${rec.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                  {rec.name.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{rec.name}</span>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                      {rec.code}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rec.email}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 sm:gap-6 text-right">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-semibold">
                    Referrals
                  </span>
                  <span className="font-semibold text-slate-800">
                    {rec.applicantCount} candidates
                  </span>
                </div>

                <div className="min-w-[90px]">
                  <span className="text-slate-400 text-[10px] block uppercase font-semibold">
                    Revenue
                  </span>
                  <span className="font-bold text-emerald-600">
                    {formatCurrencyINR(rec.totalFeeRevenueInr)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
