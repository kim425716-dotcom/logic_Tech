import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/shared/PageTransition';

import LandingPage from './pages/LandingPage';
import FooterCtaDemo from './pages/FooterCtaDemo';
import KineticGridDemo from './pages/KineticGridDemo';
import CloudWatchFormDemo from './pages/CloudWatchFormDemo';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ServiceRequestPage from './pages/client/ServiceRequestPage';
import ClientPaymentsPage from './pages/client/ClientPaymentsPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProjectsPage from './pages/admin/AdminProjectsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

import MessagingPage from './pages/MessagingPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import SettingsPage from './pages/SettingsPage';
import { Error403, Error404, Error500 } from './pages/errors/ErrorPages';

function PublicShell() {
  const { pathname } = useLocation();
  const hideFooter = pathname === '/' || pathname === '/demo/footer-cta' || pathname === '/demo/kinetic-grid' || pathname === '/demo/cloud-watch-form';

  return (
    <>
      <Navbar />
      <PageTransition>
        <Outlet />
      </PageTransition>
      {!hideFooter && <Footer />}
    </>
  );
}

function AuthShell() {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo/footer-cta" element={<FooterCtaDemo />} />
        <Route path="/demo/kinetic-grid" element={<KineticGridDemo />} />
        <Route path="/demo/cloud-watch-form" element={<CloudWatchFormDemo />} />
      </Route>

      <Route element={<AuthShell />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout role="client" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="projects" element={<ClientProjects />} />
        <Route path="projects/:id" element={<ProjectDetailsPage role="client" />} />
        <Route path="service-request" element={<ServiceRequestPage />} />
        <Route path="messages" element={<MessagingPage role="client" />} />
        <Route path="payments" element={<ClientPaymentsPage />} />
        <Route path="settings" element={<SettingsPage role="client" />} />
      </Route>

      {/* Redirect any legacy consultant route to client dashboard */}
      <Route path="/consultant/*" element={<Navigate to="/client/dashboard" replace />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<SettingsPage role="admin" />} />
      </Route>

      <Route path="/403" element={<Error403 />} />
      <Route path="/404" element={<Error404 />} />
      <Route path="/500" element={<Error500 />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
