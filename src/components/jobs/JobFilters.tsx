import { Search, X, Filter } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface JobFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  department: string;
  onDepartmentChange: (val: string) => void;
  location: string;
  onLocationChange: (val: string) => void;
  onClear: () => void;
}

const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Cloud Architecture',
  'DevOps & SRE',
  'Product & Design',
  'Data & AI',
  'Security',
];

const LOCATIONS = [
  'All Locations',
  'Bangalore, India',
  'Hyderabad, India',
  'Pune, India',
  'Mumbai, India',
  'Delhi NCR, India',
  'Remote (India)',
];

export function JobFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  location,
  onLocationChange,
  onClear,
}: JobFiltersProps) {
  const hasActiveFilters =
    search.trim() !== '' ||
    department !== 'All Departments' ||
    location !== 'All Locations';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by role title, client name, or keywords (e.g., AWS, React)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white text-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Department select */}
        <div className="w-full md:w-56">
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            aria-label="Filter by department"
            className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Location select */}
        <div className="w-full md:w-56">
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            aria-label="Filter by location"
            className="w-full h-11 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-slate-500 hover:text-slate-800 shrink-0 h-11"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
