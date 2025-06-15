// components/RedirectIfAuthenticated.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or a loader

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default RedirectIfAuthenticated;
