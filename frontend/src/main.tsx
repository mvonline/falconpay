import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';

console.log('main.tsx: Entry point loaded');

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </StrictMode>,
  );
} else {
  console.error('main.tsx: Root element not found');
}
