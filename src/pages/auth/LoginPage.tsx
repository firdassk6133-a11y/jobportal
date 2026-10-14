import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { getErrorMessage } from '../../services/apiClient';

export function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('candidate.demo@recruitmenthub.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(getErrorMessage(err));
    }
  };

  // Quick fill demo credentials
  const setDemoRole = (role: 'candidate' | 'recruiter' | 'admin') => {
    if (role === 'candidate') {
      setEmail('candidate.demo@recruitmenthub.com');
      setPassword('SecurePass123!');
    } else if (role === 'recruiter') {
      setEmail('alice.sharma@recruitmenthub.com');
      setPassword('SecurePass123!');
    } else {
      setEmail('admin@recruitmenthub.com');
      setPassword('AdminPass123!');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Intro */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Welcome to TalentBridge
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to manage your applications or recruiter portfolio
          </p>
        </div>

        {/* Auth Tabs Switcher */}
        <div className="flex rounded-lg bg-slate-200/70 p-1 text-xs font-semibold">
          <button className="flex-1 rounded-md bg-white py-2 text-indigo-700 shadow-sm">
            Sign In
          </button>
          <Link
            to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
            className="flex-1 py-2 text-slate-600 hover:text-slate-900 text-center"
          >
            Create Account
          </Link>
        </div>

        <Card className="border-slate-200/90 shadow-md">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Sign in with credentials</CardTitle>
            <CardDescription className="text-xs">
              Enter your registered email and password below.
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

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Demo Account Quick-Fill Buttons */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs space-y-2">
                <span className="text-[11px] font-semibold text-slate-600 block">
                  Quick Demo Accounts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDemoRole('candidate')}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                  >
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRole('recruiter')}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-indigo-700 hover:bg-indigo-50 font-medium cursor-pointer"
                  >
                    Recruiter (ALICE01)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRole('admin')}
                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[11px] text-purple-700 hover:bg-purple-50 font-medium cursor-pointer"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <Link
                  to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
