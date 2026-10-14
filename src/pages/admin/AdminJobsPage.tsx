import { useState } from 'react';
import {
  Plus,
  Search,
  Building2,
  MapPin,
  IndianRupee,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import type { Job } from '../../types';
import { JobFormDialog } from '../../components/admin/JobFormDialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { formatCurrencyINR, formatDate } from '../../lib/utils';

export function AdminJobsPage() {
  const { jobs, isLoading, createJob, updateJob, deleteJob } = useJobs();

  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.client.toLowerCase().includes(search.toLowerCase()) ||
      job.department?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingJob(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (job: Job) => {
    const nextStatus = job.status === 'open' ? 'closed' : 'open';
    await updateJob({
      id: job.jobId,
      payload: { status: nextStatus },
    });
  };

  const handleDelete = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job requisition?')) {
      await deleteJob(jobId);
    }
  };

  const handleFormSubmit = async (jobData: any) => {
    if (editingJob) {
      await updateJob({ id: editingJob.jobId, payload: jobData });
    } else {
      await createJob(jobData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Job Requisitions Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and manage job openings and application fee configurations
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm self-start sm:self-center"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>New Requisition</span>
        </Button>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requisitions by title, client, or department..."
            className="pl-10 h-10 text-xs bg-slate-50 border-slate-200"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total Openings: {filteredJobs.length}
        </span>
      </div>

      {/* Jobs CRUD Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role & Partner</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Salary Range (Annual)</TableHead>
              <TableHead>App Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                  Loading requisitions from DynamoDB...
                </TableCell>
              </TableRow>
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                  No job requisitions found. Click "New Requisition" to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.jobId} className="text-xs">
                  <TableCell>
                    <div className="space-y-0.5">
                      <Link
                        to={`/jobs/${job.jobId}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1 group"
                      >
                        <span>{job.title}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <p className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Building2 className="h-3 w-3 text-slate-400" />
                        <span>{job.client}</span>
                        <span>&bull;</span>
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{job.location}</span>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {job.department || 'Technology'}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-700">
                    {formatCurrencyINR(job.salaryRange.min)} - {formatCurrencyINR(job.salaryRange.max)}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-600">
                      {formatCurrencyINR(job.applicationFeeInr)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job)}
                      className="cursor-pointer"
                    >
                      <Badge variant={job.status === 'open' ? 'success' : 'secondary'}>
                        {job.status === 'open' ? 'Open' : 'Closed'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {formatDate(job.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                        title="Edit Job"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.jobId)}
                        className="p-1.5 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <JobFormDialog
        job={editingJob}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
