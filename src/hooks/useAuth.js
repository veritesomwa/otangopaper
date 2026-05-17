import { useContext } from 'react';
import { AuthContext } from '@context/AuthContext.jsx';

/** Access the current user + login/register/logout actions. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
