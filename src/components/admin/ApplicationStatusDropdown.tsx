import { useState } from 'react';
import { ChevronDown, Check, Loader2 } from 'lucide-react';
import type { ApplicationStatus } from '../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface StatusDropdownProps {
  currentStatus: ApplicationStatus | string;
  onSelectStatus: (status: ApplicationStatus) => Promise<void> | void;
  disabled?: boolean;
}

const STATUS_OPTIONS: { key: ApplicationStatus; label: string; color: string }[] = [
  { key: 'APPLIED', label: 'Applied', color: 'text-slate-600' },
  { key: 'UNDER_REVIEW', label: 'Under Review', color: 'text-amber-700' },
  { key: 'SHORTLISTED', label: 'Shortlisted', color: 'text-sky-700' },
  { key: 'CLIENT_INTERVIEW', label: 'Client Interview', color: 'text-purple-700' },
  { key: 'HIRED', label: 'Hired / Placed', color: 'text-emerald-700 font-bold' },
  { key: 'REJECTED', label: 'Rejected', color: 'text-rose-700' },
];

export function ApplicationStatusDropdown({
  currentStatus,
  onSelectStatus,
  disabled = false,
}: StatusDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const activeOption = STATUS_OPTIONS.find((s) => s.key === currentStatus) || {
    key: currentStatus as ApplicationStatus,
    label: currentStatus,
    color: 'text-slate-700',
  };

  const handleSelect = async (status: ApplicationStatus) => {
    if (status === currentStatus) return;
    setIsUpdating(true);
    try {
      await onSelectStatus(status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled || isUpdating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 animate-spin text-indigo-600" />
          ) : (
            <span className={`inline-block h-2 w-2 rounded-full ${
              activeOption.key === 'HIRED'
                ? 'bg-emerald-500'
                : activeOption.key === 'REJECTED'
                ? 'bg-rose-500'
                : activeOption.key === 'CLIENT_INTERVIEW'
                ? 'bg-purple-500'
                : activeOption.key === 'SHORTLISTED'
                ? 'bg-sky-500'
                : activeOption.key === 'UNDER_REVIEW'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`} />
          )}
          <span className={activeOption.color}>{activeOption.label}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Pipeline Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STATUS_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.key}
            onClick={() => handleSelect(opt.key)}
            className="flex items-center justify-between text-xs py-2 cursor-pointer"
          >
            <span className={opt.color}>{opt.label}</span>
            {opt.key === currentStatus && <Check className="h-3.5 w-3.5 text-indigo-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
