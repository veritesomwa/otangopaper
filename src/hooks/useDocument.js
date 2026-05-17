import { useContext } from 'react';
import { DocumentContext } from '@context/DocumentContext.jsx';

/** Access the active document (template, sections, person, etc.). */
export function useDocument() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocument must be used inside <DocumentProvider>');
  return ctx;
}
