import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Upload,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lock,
} from 'lucide-react';
import type { Job, PaymentOrder } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { fileService } from '../../services/fileService';
import { applicationService } from '../../services/applicationService';
import { getErrorMessage } from '../../services/apiClient';
import { RECRUITER_TEAM } from '../../config/recruiters';
import { formatCurrencyINR } from '../../lib/utils';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PaymentSuccessReceipt } from '../applications/PaymentSuccessReceipt';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationCompleted?: () => void;
}

export function ApplyModal({
  job,
  isOpen,
  onClose,
  onApplicationCompleted,
}: ApplyModalProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Wizard Steps: 1 = Candidate Profile & Resume, 2 = Payment Checkout, 3 = Success Receipt
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [currentCtc, setCurrentCtc] = useState('₹ 12,00,000');
  const [expectedCtc, setExpectedCtc] = useState('₹ 18,00,000');
  const [noticePeriodDays, setNoticePeriodDays] = useState('30');
  const [skills, setSkills] = useState('');
  const [candidateNotes, setCandidateNotes] = useState('');
  const [recruiterCode, setRecruiterCode] = useState('');

  // Resume Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedResumeKey, setUploadedResumeKey] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Payment State
  const [createdOrder, setCreatedOrder] = useState<PaymentOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('candidate@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [completedPaymentId, setCompletedPaymentId] = useState<string>('');

  // Detect referral code from URL ?ref=CODE
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref') || params.get('recruiter');
    if (refParam) {
      setRecruiterCode(refParam.toUpperCase());
    }
  }, [location.search]);

  // Pre-fill user profile if authenticated
  useEffect(() => {
    if (user) {
      setCandidateName(user.name || '');
      setCandidateEmail(user.email || '');
      setCandidatePhone(user.phone || '');
      if (user.referralCode && !recruiterCode) {
        setRecruiterCode(user.referralCode);
      }
    }
  }, [user]);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setPaymentError('');
      setUploadError('');
    }
  }, [isOpen]);

  if (!job) return null;

  // Handle Resume File Selection & Auto S3 Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting the same file fires onChange
    e.target.value = '';

    if (!isAuthenticated) {
      setUploadError('Please sign in or register before uploading your CV.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.');
      return;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase().replace(/^\./, '') || '';
    const validExtensions = ['pdf', 'doc', 'docx'];
    if (!validExtensions.includes(fileExt)) {
      setUploadError('Please select a valid PDF, DOC, or DOCX document.');
      return;
    }

    let resolvedType = file.type;
    if (!resolvedType || resolvedType === 'application/octet-stream') {
      if (fileExt === 'pdf') resolvedType = 'application/pdf';
      else if (fileExt === 'doc') resolvedType = 'application/msword';
      else if (fileExt === 'docx') {
        resolvedType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
    }

    const validMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (resolvedType && !validMimes.includes(resolvedType)) {
      setUploadError('Please select a valid PDF, DOC, or DOCX document.');
      return;
    }

    setSelectedFile(file);
    setUploadError('');
    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 1. Get presigned upload URL
      const { uploadUrl, fileKey } = await fileService.getPresignedUpload(
        file.name,
        resolvedType,
        file.size
      );

      // 2. Direct S3 Upload via PUT
      await fileService.uploadFileToS3(
        uploadUrl,
        file,
        (percent) => {
          setUploadProgress(percent);
        },
        resolvedType
      );

      setUploadedResumeKey(fileKey);
      setUploadProgress(100);
    } catch (err: any) {
      const errMsg = getErrorMessage(err);
      setUploadError(errMsg || 'Failed to upload resume to S3. Please retry.');
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Step 1: Submit Application & Create Payment Order
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (!uploadedResumeKey) {
      setUploadError('Please upload your resume (.pdf or .docx) before proceeding.');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const order = await applicationService.createOrder({
        jobId: job.jobId,
        resumeKey: uploadedResumeKey,
        recruiterCode: recruiterCode.trim() ? recruiterCode.trim().toUpperCase() : undefined,
        currentCtc,
        expectedCtc,
        noticePeriodDays: parseInt(noticePeriodDays, 10) || 30,
        skills: skillsArray.length > 0 ? skillsArray : job.requirements.slice(0, 4),
        candidateNotes,
      });

      setCreatedOrder(order);
      setCurrentStep(2);
    } catch (err: any) {
      setPaymentError(
        err.response?.data?.message || err.message || 'Failed to initialize payment order.'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Step 2: Simulate Gateway Payment & Trigger SQS Webhook
  const handleCompletePayment = async () => {
    if (!createdOrder) return;

    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      const mockPaymentId = `pay_razor_${Date.now()}`;

      // Simulate payment webhook call to backend (marks application COMPLETED and enqueues to SQS)
      await applicationService.simulatePaymentWebhook({
        gatewayOrderId: createdOrder.orderId,
        gatewayPaymentId: mockPaymentId,
      });

      setCompletedPaymentId(mockPaymentId);
      setCurrentStep(3);
      if (onApplicationCompleted) {
        onApplicationCompleted();
      }
    } catch (err: any) {
      setPaymentError(
        err.response?.data?.message || err.message || 'Payment verification failed. Please try again.'
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const upiQrData = `upi://pay?pa=recruitmenthub@upi&pn=TalentBridge&am=${job.applicationFeeInr}&cu=INR&tr=${createdOrder?.orderId || 'ORDER'}`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {currentStep === 1
                  ? 'Apply for Position'
                  : currentStep === 2
                  ? 'Secure Application Fee Checkout'
                  : 'Application Status'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                {job.title} &bull; <strong className="text-slate-700">{job.client}</strong>
              </DialogDescription>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Processing Fee</span>
              <div className="text-lg font-bold text-emerald-600">
                {formatCurrencyINR(job.applicationFeeInr)}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* STEP 1: Candidate Form & S3 Upload */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToPayment} className="space-y-5 pt-2">
            {!isAuthenticated && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-semibold">Authentication Required: </span>
                  Please{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-bold underline text-amber-900"
                  >
                    sign in
                  </button>{' '}
                  or{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="font-bold underline text-amber-900"
                  >
                    register
                  </button>{' '}
                  to submit your application.
                </div>
              </div>
            )}

            {/* Profile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="candidateName">Full Name</Label>
                <Input
                  id="candidateName"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Rohit Sharma"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="candidateEmail">Email Address</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="rohit@example.com"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="candidatePhone">Phone Number</Label>
                <Input
                  id="candidatePhone"
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                <Input
                  id="noticePeriod"
                  type="number"
                  value={noticePeriodDays}
                  onChange={(e) => setNoticePeriodDays(e.target.value)}
                  placeholder="30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="currentCtc">Current CTC</Label>
                <Input
                  id="currentCtc"
                  value={currentCtc}
                  onChange={(e) => setCurrentCtc(e.target.value)}
                  placeholder="e.g. ₹ 12 LPA"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expectedCtc">Expected CTC</Label>
                <Input
                  id="expectedCtc"
                  value={expectedCtc}
                  onChange={(e) => setExpectedCtc(e.target.value)}
                  placeholder="e.g. ₹ 18 LPA"
                  required
                />
              </div>
            </div>

            {/* Skills & Key Expertise */}
            <div className="space-y-1.5">
              <Label htmlFor="skills">Key Skills (Comma separated)</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, AWS Lambda, Node.js"
              />
            </div>

            {/* Recruiter Referral Code & 10-member Quick Suggestions */}
            <div className="space-y-2 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="recruiterCode" className="text-xs font-semibold text-slate-800">
                  Recruiter Referral Code (Optional)
                </Label>
                <span className="text-[11px] text-indigo-600 font-medium">
                  {recruiterCode ? `Attributed to ${recruiterCode}` : 'Tracks 10-member team attribution'}
                </span>
              </div>

              <Input
                id="recruiterCode"
                value={recruiterCode}
                onChange={(e) => setRecruiterCode(e.target.value.toUpperCase())}
                placeholder="e.g. ALICE01, BOB02, CHARLIE03"
                className="bg-white uppercase font-mono text-xs tracking-wider"
              />

              {/* Quick-fill chips */}
              <div className="pt-1">
                <p className="text-[11px] text-slate-500 mb-1.5 font-medium">
                  Quick-select team referral code:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {RECRUITER_TEAM.map((rec) => (
                    <button
                      key={rec.code}
                      type="button"
                      onClick={() => setRecruiterCode(rec.code)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer ${
                        recruiterCode === rec.code
                          ? 'bg-indigo-600 text-white font-bold shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {rec.code} ({rec.name.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* S3 Direct Resume Upload */}
            <div className="space-y-2">
              <Label>Resume Document (PDF or DOCX)</Label>
              <div
                className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${
                  uploadedResumeKey
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                }`}
              >
                {uploadedResumeKey ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileCheck className="h-8 w-8 text-emerald-600" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-emerald-900">
                        {selectedFile?.name || 'Resume Uploaded'}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Securely saved to private S3 bucket ({uploadedResumeKey.slice(0, 30)}...)
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadedResumeKey('');
                        setSelectedFile(null);
                        setUploadProgress(0);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800"
                    >
                      Replace
                    </Button>
                  </div>
                ) : isUploading ? (
                  <div className="space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                    <p className="text-xs text-slate-600 font-medium">
                      Uploading to Amazon S3... {uploadProgress}%
                    </p>
                    <div className="w-48 mx-auto bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-7 w-7 text-slate-400 mx-auto mb-1.5" />
                    <label className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">
                      Click to choose resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Max file size: 10MB (.pdf, .doc, .docx)
                    </p>
                  </div>
                )}
              </div>
              {uploadError && (
                <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{uploadError}</span>
                </p>
              )}
            </div>

            {/* Candidate Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes to Recruiter (Optional)</Label>
              <Textarea
                id="notes"
                value={candidateNotes}
                onChange={(e) => setCandidateNotes(e.target.value)}
                placeholder="Mention availability for interviews or relocation preferences..."
                rows={2}
                className="text-xs"
              />
            </div>

            {paymentError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {paymentError}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading || isProcessingPayment || !uploadedResumeKey}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Preparing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Fee Payment ({formatCurrencyINR(job.applicationFeeInr)})</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Simulated Payment Checkout Modal (Razorpay / Cashfree) */}
        {currentStep === 2 && createdOrder && (
          <div className="space-y-5 pt-1">
            {/* Payment Summary Header */}
            <div className="rounded-xl bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Secure Checkout
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  TalentBridge Application Gateway
                </h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Order ID: {createdOrder.orderId}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Due</span>
                <div className="text-xl font-extrabold text-emerald-400">
                  {formatCurrencyINR(createdOrder.amountInInr)}
                </div>
              </div>
            </div>

            {/* Payment Options Tabs */}
            <Tabs
              value={paymentMethod}
              onValueChange={(val) => setPaymentMethod(val as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full h-11 bg-slate-100">
                <TabsTrigger value="upi" className="flex items-center gap-1.5 text-xs">
                  <QrCode className="h-3.5 w-3.5" />
                  <span>UPI / QR</span>
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-1.5 text-xs">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Cards</span>
                </TabsTrigger>
                <TabsTrigger value="netbanking" className="flex items-center gap-1.5 text-xs">
                  <Building className="h-3.5 w-3.5" />
                  <span>NetBanking</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: UPI */}
              <TabsContent value="upi" className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm border border-slate-200 shrink-0">
                    <QRCodeSVG value={upiQrData} size={110} level="M" />
                  </div>
                  <div className="space-y-2 text-left">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      <Sparkles className="h-3 w-3" />
                      Instant Processing
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Scan QR with GPay, PhonePe, Paytm, or BHIM, or enter your VPA below:
                    </p>
                    <div className="space-y-1">
                      <Label htmlFor="upiId" className="text-[11px]">
                        UPI ID / VPA
                      </Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis"
                        className="h-9 text-xs font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: Debit/Credit Card */}
              <TabsContent value="card" className="space-y-3 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="cardNumber" className="text-xs">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8821"
                      className="bg-white font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="cardExpiry" className="text-xs">
                        Expiry (MM/YY)
                      </Label>
                      <Input
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="bg-white font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="cardCvv" className="text-xs">
                        CVV / CVC
                      </Label>
                      <Input
                        id="cardCvv"
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: NetBanking */}
              <TabsContent value="netbanking" className="space-y-3 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <Label className="text-xs">Select Your Bank</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Other Bank'].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            selectedBank === bank
                              ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-900'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {paymentError && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {paymentError}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setCurrentStep(1)}
                className="text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back
              </Button>
              <Button
                type="button"
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-md"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Verifying HMAC Webhook...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 mr-1.5" />
                    <span>Pay {formatCurrencyINR(createdOrder.amountInInr)} Securely</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Payment Success Receipt */}
        {currentStep === 3 && createdOrder && (
          <PaymentSuccessReceipt
            orderId={createdOrder.orderId}
            paymentId={completedPaymentId}
            jobTitle={job.title}
            client={job.client}
            amountInr={createdOrder.amountInInr}
            recruiterCode={recruiterCode}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
