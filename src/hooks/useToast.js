import { useContext } from 'react';
import { ToastContext } from '@context/ToastContext.jsx';

/** Imperative toast API: const { push, dismiss } = useToast(); */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
