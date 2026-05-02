import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts & Pages
import AuthLayout from './pages/auth/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';

import AppLayout from './pages/app/AppLayout';
import Dashboard from './pages/app/Dashboard';
import TeamSettings from './pages/app/TeamSettings';
import Billing from './pages/app/Billing';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />

        {/* Public Auth Routes */}
        <Route path="/auth" element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Protected App Routes */}
        <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="team" element={<TeamSettings />} />
        </Route>

        <Route path="/billing" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Billing />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
