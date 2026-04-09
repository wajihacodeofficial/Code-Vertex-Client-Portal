import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import type { UserRole } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import TeamLayout from './layouts/TeamLayout';

// Direct imports for absolute performance
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerificationPage from './pages/VerificationPage';
import AwaitingApproval from './pages/AwaitingApproval';
import DashboardHome from './pages/DashboardHome';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeamPage from './pages/AdminTeamPage';
import TeamDashboard from './pages/TeamDashboard';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import InvoicesPage from './pages/InvoicesPage';
import TicketsPage from './pages/TicketsPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import TeamTasks from './pages/TeamTasks';
import PrivateNotesPage from './pages/PrivateNotesPage';
import AdminInvoices from './pages/AdminInvoices';
import PoliciesPage from './pages/PoliciesPage';
import MeetingsPage from './pages/MeetingsPage';
import SettingsPage from './pages/SettingsPage';
import AdminClients from './pages/AdminClients';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminInternalTeam from './pages/AdminInternalTeam';
import ProjectAnalysisPage from './pages/ProjectAnalysisPage';

// Simple PageLoader remains for initial auth check if needed
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen w-full bg-background relative" style={{ zIndex: 9999 }}>
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-transparent animate-spin"></div>
        </div>
    </div>
);

// Scroll to Top Utility for window-level pages
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: UserRole[] }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    
    if (isLoading) return <PageLoader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    // Check if the route is restricted by role
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'team') return <Navigate to="/team/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
};

// Guard to prevent authenticated users from going back to Login/Signup
const NoAuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAuth();
    
    if (isAuthenticated) {
        return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'team' ? '/team/dashboard' : '/dashboard'} replace />;
    }
    
    return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<NoAuthRoute><LoginPage /></NoAuthRoute>} />
        <Route path="/signup" element={<NoAuthRoute><SignUpPage /></NoAuthRoute>} />
        <Route path="/forgot-password" element={<NoAuthRoute><ForgotPasswordPage /></NoAuthRoute>} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerificationPage />} />
        <Route path="/awaiting-approval" element={<AwaitingApproval />} />
        
        {/* Team Routes Wrapper */}
        <Route path="/team/*" element={
            <ProtectedRoute allowedRoles={['team', 'admin']}>
                <TeamLayout>
                    <Routes>
                        <Route path="dashboard" element={<TeamDashboard />} />
                        <Route path="projects" element={<ProjectsList />} />
                        <Route path="tasks" element={<TeamTasks />} />
                        <Route path="analysis" element={<ProjectAnalysisPage />} />
                        <Route path="messages" element={<MessagesPage />} />
                        <Route path="files" element={<DocumentsPage />} />
                        <Route path="meetings" element={<MeetingsPage />} />
                        <Route path="billing" element={<InvoicesPage />} />
                        <Route path="notes" element={<PrivateNotesPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="/" element={<Navigate to="/team/dashboard" replace />} />
                    </Routes>
                </TeamLayout>
            </ProtectedRoute>
        } />

        {/* Admin Routes Wrapper */}
        <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="clients" element={<AdminClients />} />
                        <Route path="team" element={<AdminInternalTeam />} />
                        <Route path="projects" element={<ProjectsList />} />
                        <Route path="analysis" element={<ProjectAnalysisPage />} />
                        <Route path="messages" element={<MessagesPage />} />
                        <Route path="invoices" element={<AdminInvoices />} />
                        <Route path="tickets" element={<TicketsPage />} />
                        <Route path="meetings" element={<MeetingsPage />} />
                        <Route path="policies" element={<PoliciesPage />} />
                        <Route path="team" element={<AdminTeamPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                </AdminLayout>
            </ProtectedRoute>
        } />

        {/* Protected Routes Wrapper (Client) - MUST BE LAST */}
        <Route path="/*" element={
            <ProtectedRoute allowedRoles={['client', 'admin']}>
                <DashboardLayout>
                    <Routes>
                        <Route path="dashboard" element={<DashboardHome />} />
                        <Route path="projects" element={<ProjectsList />} />
                        <Route path="projects/:id" element={<ProjectDetail />} />
                        <Route path="messages" element={<MessagesPage />} />
                        <Route path="invoices" element={<InvoicesPage />} />
                        <Route path="support" element={<TicketsPage />} />
                        <Route path="documents" element={<DocumentsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="policies" element={<PoliciesPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="meetings" element={<MeetingsPage />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </DashboardLayout>
            </ProtectedRoute>
        } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
        <ScrollToTop />
        <ThemeProvider>
            <AuthProvider>
                <div className="bg-background min-h-screen text-text-primary selection:bg-primary/30 selection:text-white">
                    <Toaster position="top-right" toastOptions={{
                        className: 'glass-card border border-white/10 rounded-xl shadow-glow text-text-primary text-sm font-medium',
                        duration: 2000,
                        style: {
                            background: 'var(--surface)',
                            color: 'var(--text-primary)',
                        }
                    }}>
                      {(t) => (
                        <div className="hover:opacity-50 transition-opacity duration-300">
                            <ToastBar toast={t}>
                            {({ icon, message }) => (
                                <div className="flex items-center gap-3 w-full pr-2">
                                    <button 
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.dismiss(t.id); }} 
                                        className="hover:bg-white/10 p-1 -ml-1 rounded-md text-text-muted hover:text-red-400 transition-colors cursor-pointer pointer-events-auto flex items-center justify-center shrink-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                    </button>
                                    {icon}
                                    <div className="flex-1">{message}</div>
                                </div>
                            )}
                            </ToastBar>
                        </div>
                      )}
                    </Toaster>
                    <AppRoutes />
                </div>
            </AuthProvider>
        </ThemeProvider>
    </Router>
  );
};

export default App;
