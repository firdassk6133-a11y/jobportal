import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Briefcase, Sparkles, Building2, ShieldCheck, SearchX } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';
import type { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { ApplyModal } from '../../components/modals/ApplyModal';
import { Skeleton } from '../../components/ui/skeleton';

export function JobsCatalogPage() {
  const { jobs, isLoading, isError, refetch } = useJobs({ status: 'open' });
  const location = useLocation();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // Selected job for ApplyModal
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);

  // Check if referral code is in URL
  const queryParams = new URLSearchParams(location.search);
  const referralParam = queryParams.get('ref') || queryParams.get('recruiter');

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search text matches title, client, or requirements
      const matchesSearch =
        !search.trim() ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.client.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.requirements?.some((req) => req.toLowerCase().includes(search.toLowerCase()));

      // Department matches
      const matchesDepartment =
        department === 'All Departments' ||
        job.department?.toLowerCase() === department.toLowerCase();

      // Location matches
      const matchesLocation =
        locationFilter === 'All Locations' ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase().replace(', india', ''));

      return matchesSearch && matchesDepartment && matchesLocation;
    });
  }, [jobs, search, department, locationFilter]);

  const handleClearFilters = () => {
    setSearch('');
    setDepartment('All Departments');
    setLocationFilter('All Locations');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Referral Banner if ?ref=CODE */}
      {referralParam && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-4 flex items-center justify-between text-xs text-indigo-900 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>
              You were referred by Recruiter Code: <strong className="font-bold">{referralParam.toUpperCase()}</strong>.
              Your applications will be directly attributed to their recruiting team.
            </span>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Premium Tech Staffing & Direct Placements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Find Your Next High-Impact Engineering Role
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            TalentBridge connects top tech talent with leading enterprises and high-growth startups.
            Verified openings with transparent salaries and active recruiter tracking.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Nominal Application Fee Guarantee</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span>Top Enterprise Clients</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <JobFilters
        search={search}
        onSearchChange={setSearch}
        department={department}
        onDepartmentChange={setDepartment}
        location={locationFilter}
        onLocationChange={setLocationFilter}
        onClear={handleClearFilters}
      />

      {/* Job Listings Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Active Job Openings ({filteredJobs.length})
          </h2>
          <span className="text-xs text-slate-500">
            Showing verified vacancies in India & Remote
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-xl border border-slate-200 p-6 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
            <SearchX className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">No vacancies found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No active job openings match your current search and filter criteria. Try clearing
              your filters or searching with different keywords.
            </p>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-indigo-600 hover:underline pt-2"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.jobId}
                job={job}
                onApply={(jobToApply) => setSelectedJobForApply(jobToApply)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <ApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        onApplicationCompleted={() => refetch()}
      />
    </div>
  );
}
