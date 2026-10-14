import { Info, Mail, Phone, Calendar, IndianRupee, Sparkles, FileText } from 'lucide-react';
import type { Application } from '../../types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';

interface CandidatePopoverProps {
  application: Application;
}

export function CandidatePopover({ application }: CandidatePopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="View candidate details"
          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-84 p-4 text-xs space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h4 className="font-bold text-slate-900 text-sm">
            {application.candidateName || 'Candidate Profile'}
          </h4>
          <div className="flex flex-col gap-1 text-slate-500 mt-1">
            {application.candidateEmail && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-slate-400" />
                <span>{application.candidateEmail}</span>
              </span>
            )}
            {application.candidatePhone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-slate-400" />
                <span>{application.candidatePhone}</span>
              </span>
            )}
          </div>
        </div>

        {/* Compensation & Notice Period */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Current CTC</span>
            <p className="font-semibold text-slate-800">
              {application.currentCtc || 'Not specified'}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Expected CTC</span>
            <p className="font-semibold text-emerald-700">
              {application.expectedCtc || 'Not specified'}
            </p>
          </div>
          <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Notice Period</span>
            <span className="font-medium text-slate-800">
              {application.noticePeriodDays != null ? `${application.noticePeriodDays} Days` : '30 Days'}
            </span>
          </div>
        </div>

        {/* Candidate Skills */}
        {application.skills && application.skills.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-slate-400 font-semibold">Skills</span>
            <div className="flex flex-wrap gap-1">
              {application.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {application.candidateNotes && (
          <div className="space-y-1 border-t border-slate-100 pt-2">
            <span className="text-[10px] uppercase text-slate-400 font-semibold flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Candidate Note</span>
            </span>
            <p className="text-slate-600 italic bg-amber-50/50 p-2 rounded border border-amber-100">
              "{application.candidateNotes}"
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
