import { CheckCircle2, Circle, Clock, Award, XCircle, Users } from 'lucide-react';
import type { ApplicationStatus } from '../../types';

interface ApplicationStepperProps {
  status: ApplicationStatus;
  updatedAt?: string;
}

interface StepDef {
  key: ApplicationStatus;
  label: string;
  description: string;
}

const STEPS: StepDef[] = [
  {
    key: 'APPLIED',
    label: 'Applied',
    description: 'Application & fee received',
  },
  {
    key: 'UNDER_REVIEW',
    label: 'Under Review',
    description: 'Recruiter resume screening',
  },
  {
    key: 'SHORTLISTED',
    label: 'Shortlisted',
    description: 'Profile forwarded to client',
  },
  {
    key: 'CLIENT_INTERVIEW',
    label: 'Client Interview',
    description: 'Technical/HR interview round',
  },
  {
    key: 'HIRED',
    label: 'Hired / Placed',
    description: 'Offer released & accepted',
  },
];

export function ApplicationStepper({ status }: ApplicationStepperProps) {
  const isRejected = status === 'REJECTED';

  // Find index of current status
  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  const activeIndex = isRejected ? 1 : currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="w-full py-4">
      {isRejected && (
        <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50/80 p-3.5 text-xs text-rose-800">
          <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <div>
            <span className="font-semibold">Application Closed: </span>
            The recruiting partner evaluated your profile and decided to move forward with other candidates at this time.
          </div>
        </div>
      )}

      {/* Stepper Bar */}
      <div className="relative">
        {/* Track Line behind steps (hidden on mobile, visible sm+) */}
        <div className="hidden sm:block absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0">
          <div
            className={`h-full transition-all duration-500 ${
              isRejected ? 'bg-rose-400' : 'bg-indigo-600'
            }`}
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = !isRejected && idx < activeIndex;
            const isCurrent = !isRejected && idx === activeIndex;
            const isPending = !isRejected && idx > activeIndex;

            return (
              <div
                key={step.key}
                className="flex sm:flex-col items-center sm:text-center text-left gap-3 sm:gap-2 group"
              >
                {/* Step Circle Icon */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all shrink-0 bg-white shadow-sm ${
                    isCompleted
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : isCurrent
                      ? 'border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 animate-pulse-slow'
                      : isRejected && idx === 1
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isCurrent ? (
                    idx === 4 ? (
                      <Award className="h-5 w-5" />
                    ) : idx === 3 ? (
                      <Users className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )
                  ) : isRejected && idx === 1 ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex flex-col">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-indigo-600'
                        : isCompleted
                        ? 'text-slate-900'
                        : isRejected && idx === 1
                        ? 'text-rose-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[11px] text-slate-500 leading-snug mt-0.5">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
