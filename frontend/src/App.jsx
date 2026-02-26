import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import JobDetailPage from './pages/JobDetailPage';
import FAQPage from './pages/FAQPage';
import InquiryPage from './pages/InquiryPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminMessages from './pages/admin/AdminMessages';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminStaff from './pages/admin/AdminStaff';
import AdminFAQs from './pages/admin/AdminFAQs';
import AdminProfile from './pages/admin/AdminProfile';

function PrivateRoute({ children, requiredRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ height: '100vh' }}><div className="spinner" /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (requiredRoles && !requiredRoles.includes(user.role)) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<JobDetailPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/get-quote" element={<InquiryPage />} />
          </Route>

          {/* ── Admin auth ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ── Admin protected ── */}
          <Route path="/admin" element={
            <PrivateRoute><AdminLayout /></PrivateRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="jobs" element={
              <PrivateRoute requiredRoles={['admin', 'manager']}><AdminJobs /></PrivateRoute>
            } />
            <Route path="applications" element={
              <PrivateRoute requiredRoles={['admin', 'manager']}><AdminApplications /></PrivateRoute>
            } />
            <Route path="staff" element={
              <PrivateRoute requiredRoles={['admin']}><AdminStaff /></PrivateRoute>
            } />
            <Route path="faqs" element={
              <PrivateRoute requiredRoles={['admin']}><AdminFAQs /></PrivateRoute>
            } />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}