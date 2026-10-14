import { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Loader2 } from 'lucide-react';
import type { Job } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface JobFormDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: any) => Promise<void>;
}

export function JobFormDialog({
  job,
  isOpen,
  onClose,
  onSubmit,
}: JobFormDialogProps) {
  const isEditing = !!job;

  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [location, setLocation] = useState('Bangalore, India (Hybrid)');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salaryMin, setSalaryMin] = useState('2400000');
  const [salaryMax, setSalaryMax] = useState('3600000');
  const [applicationFeeInr, setApplicationFeeInr] = useState('99');
  const [status, setStatus] = useState<'open' | 'closed'>('open');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setClient(job.client);
      setDepartment(job.department || 'Engineering');
      setLocation(job.location);
      setEmploymentType(job.employmentType || 'Full-time');
      setSalaryMin(String(job.salaryRange.min));
      setSalaryMax(String(job.salaryRange.max));
      setApplicationFeeInr(String(job.applicationFeeInr));
      setStatus(job.status);
      setDescription(job.description);
      setRequirements(job.requirements || []);
    } else {
      setTitle('');
      setClient('');
      setDepartment('Engineering');
      setLocation('Bangalore, India (Hybrid)');
      setEmploymentType('Full-time');
      setSalaryMin('2400000');
      setSalaryMax('3600000');
      setApplicationFeeInr('99');
      setStatus('open');
      setDescription('');
      setRequirements([
        '3+ years professional software development experience',
        'Strong proficiency in TypeScript, React, and Node.js',
        'Understanding of AWS Serverless or cloud architectures',
      ]);
    }
    setError('');
  }, [job, isOpen]);

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || !description) {
      setError('Title, client partner, and job description are required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title,
        client,
        department,
        location,
        employmentType,
        description,
        requirements: requirements.length > 0 ? requirements : ['Strong problem solving skills'],
        salaryRange: {
          min: parseInt(salaryMin, 10) || 1000000,
          max: parseInt(salaryMax, 10) || 2000000,
          currency: 'INR',
        },
        applicationFeeInr: parseInt(applicationFeeInr, 10) || 99,
        status,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save job requisition.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditing ? 'Edit Job Requisition' : 'Create New Job Requisition'}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Post an opening for partner clients with nominal application fee configuration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Principal Cloud Architect (AWS Serverless)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client">Client Partner</Label>
              <Input
                id="client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Global FinTech Solutions"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Engineering / DevOps"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bangalore, India (Hybrid)"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="employmentType">Employment Type</Label>
              <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salaryMin">Minimum Salary (INR / yr)</Label>
              <Input
                id="salaryMin"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="2400000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salaryMax">Maximum Salary (INR / yr)</Label>
              <Input
                id="salaryMax"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="3600000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="applicationFee">Application Processing Fee (INR)</Label>
              <Input
                id="applicationFee"
                type="number"
                value={applicationFeeInr}
                onChange={(e) => setApplicationFeeInr(e.target.value)}
                placeholder="99"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Listing Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 px-3 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              >
                <option value="open">Open (Publicly Visible)</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline responsibilities, team context, and expected impact..."
              rows={3}
              required
            />
          </div>

          {/* Requirements builder */}
          <div className="space-y-2">
            <Label>Requirements & Criteria</Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add candidate requirement (press Enter or Click Add)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddRequirement}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-1.5 pt-1">
              {requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-700"
                >
                  <span>&bull; {req}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Saving Requisition...</span>
                </>
              ) : (
                <span>{isEditing ? 'Update Vacancy' : 'Publish Requisition'}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
