import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Contacts } from './pages/Contacts';
import { AddContact } from './pages/AddContact';
import { AdminDashboard } from './admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

function App() {
  const { token, loading } = useAuth();
  const location = useLocation();

  console.log('App: Rendering', { path: location.pathname, token: !!token, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="contacts/add" element={<AddContact />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
