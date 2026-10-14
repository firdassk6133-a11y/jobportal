import { ShieldCheck, Sparkles } from 'lucide-react';
import { formatCurrencyINR } from '../../lib/utils';

interface ApplicationFeeBadgeProps {
  feeInInr: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ApplicationFeeBadge({
  feeInInr,
  size = 'md',
}: ApplicationFeeBadgeProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${
        feeInInr > 0
          ? 'bg-amber-50 text-amber-900 border-amber-200'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
      } ${
        isSm
          ? 'px-2 py-0.5 text-[11px]'
          : isLg
          ? 'px-3.5 py-1 text-sm'
          : 'px-2.5 py-0.5 text-xs'
      }`}
    >
      <ShieldCheck className={isSm ? 'h-3 w-3' : isLg ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      <span>
        {feeInInr > 0 ? (
          <>
            Processing Fee: <strong className="font-bold">{formatCurrencyINR(feeInInr)}</strong>
          </>
        ) : (
          'Free Application'
        )}
      </span>
    </div>
  );
}
