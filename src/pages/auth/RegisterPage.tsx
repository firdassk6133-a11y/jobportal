import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, User, Phone, ArrowRight, Loader2, AlertCircle, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { RECRUITER_TEAM } from '../../config/recruiters';
import { getErrorMessage } from '../../services/apiClient';

export function RegisterPage() {
  const { register, isRegistering } = useAuth();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('CANDIDATE');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'RECRUITER' && !referralCode.trim()) {
      setError('Please select or specify your assigned Recruiter Referral Code.');
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        phone,
        role,
        referralCode: role === 'RECRUITER' ? referralCode.trim().toUpperCase() : undefined,
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create your Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join TalentBridge to apply for top tech roles or track recruitments
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-slate-200/70 p-1 text-xs font-semibold">
          <Link
            to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className="flex-1 py-2 text-slate-600 hover:text-slate-900 text-center"
          >
            Sign In
          </Link>
          <button className="flex-1 rounded-md bg-white py-2 text-indigo-700 shadow-sm">
            Create Account
          </button>
        </div>

        <Card className="border-slate-200/90 shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Register new account</CardTitle>
            <CardDescription className="text-xs">
              Select your role and enter your details below.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Role selection radio / tabs */}
              <div className="space-y-1.5">
                <Label>I am registering as:</Label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['CANDIDATE', 'RECRUITER', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                        role === r
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'CANDIDATE' ? 'Candidate' : r === 'RECRUITER' ? 'Recruiter' : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password (min 8 characters)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 text-xs"
                    minLength={8}
                    required
                  />
                </div>
              </div>

              {/* If Recruiter, select referral code from 10 team members */}
              {role === 'RECRUITER' && (
                <div className="space-y-2 rounded-xl bg-purple-50/60 border border-purple-200 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="recCode" className="text-purple-900 font-semibold flex items-center gap-1">
                      <Key className="h-3.5 w-3.5 text-purple-600" />
                      <span>Select Recruiter Code</span>
                    </Label>
                  </div>
                  <select
                    id="recCode"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full h-9 px-2.5 text-xs bg-white border border-purple-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">-- Choose Assigned Team Code --</option>
                    {RECRUITER_TEAM.map((rec) => (
                      <option key={rec.code} value={rec.code}>
                        {rec.code} &bull; {rec.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link
                  to={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
