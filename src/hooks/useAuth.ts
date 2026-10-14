import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService, type LoginPayload, type RegisterPayload } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, isAuthenticated, setAuth, logout: storeLogout, hasRole } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);

      // Check redirect param
      const searchParams = new URLSearchParams(location.search);
      const redirect = searchParams.get('redirect');

      if (redirect) {
        navigate(redirect, { replace: true });
      } else if (data.user.role === 'ADMIN' || data.user.role === 'RECRUITER') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(['auth', 'me'], data.user);

      if (data.user.role === 'ADMIN' || data.user.role === 'RECRUITER') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/jobs', { replace: true });
      }
    },
  });

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logout = () => {
    storeLogout();
    queryClient.clear();
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
    hasRole,
    refetchMe: meQuery.refetch,
    isCandidate: user?.role === 'CANDIDATE',
    isRecruiter: user?.role === 'RECRUITER',
    isAdmin: user?.role === 'ADMIN',
  };
}
