// Application entry. Mounts <App/> wrapped in every provider it needs.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

import { ThemeProvider }    from '@context/ThemeContext.jsx';
import { AuthProvider }     from '@context/AuthContext.jsx';
import { DocumentProvider } from '@context/DocumentContext.jsx';
import { ToastProvider }    from '@context/ToastContext.jsx';

import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DocumentProvider>
            <App />
          </DocumentProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
