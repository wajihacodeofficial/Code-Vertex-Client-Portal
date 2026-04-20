import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────
export type UserRole = 'client' | 'team' | 'admin';

export interface User {
    id: string;
    supabase_uid?: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    company?: string;
    avatar?: string;
    status?: 'pending' | 'approved' | 'rejected';
    email_verified?: boolean;
}

export interface AdminStats {
    totalRevenue: number;
    activeProjects: number;
    activeClients: number;
    pendingApprovals: number;
    totalUsers: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<UserRole>;
    signup: (name: string, email: string, password: string, role?: UserRole, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    allUsers: User[];
    approveUser: (id: string) => Promise<void>;
    rejectUser: (id: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    deleteTicket: (id: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
    projects: any[];
    invoices: any[];
    tickets: any[];
    adminStats: AdminStats | null;
    fetchAdminData: () => Promise<void>;
    fetchProjects: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);


    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/api/projects');
            setProjects(data);
        } catch { /* Suppress */ }
    };

    const fetchAdminStats = async () => {
        try {
            const { data } = await api.get('/api/admin/stats');
            // API now returns { stats, users, projects, invoices, tickets }
            setAdminStats(data.stats ?? data); 
            if (data.users) setAllUsers(data.users);
            if (data.projects) setProjects(data.projects);
            if (data.invoices) setInvoices(data.invoices);
            if (data.tickets) setTickets(data.tickets);
        } catch (err: any) {
            console.error('Failed to fetch admin stats:', err);
            const message = err.response?.data?.error || 'Connection to server lost. Please refresh.';
            toast.error(message, { id: 'admin-fetch-error' });
        }
    };

    const fetchAdminData = async () => {
        // Single efficient call - fetchAdminStats now populates everything
        await fetchAdminStats();
    };

    // ── Restore session on mount ──
    useEffect(() => {
        const storedUser = localStorage.getItem('cv_auth_user');
        const storedSession = localStorage.getItem('cv_session');

        if (storedUser && storedSession) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const parsedSession = JSON.parse(storedSession);

                // Validate token hasn't expired (Supabase JWT)
                if (parsedSession?.expires_at) {
                    const expiresAt = new Date(parsedSession.expires_at * 1000);
                    if (expiresAt > new Date()) {
                        setUser(parsedUser);
                    } else {
                        // Token expired — clear storage
                        localStorage.removeItem('cv_auth_user');
                        localStorage.removeItem('cv_session');
                    }
                } else {
                    setUser(parsedUser);
                }
            } catch {
                localStorage.removeItem('cv_auth_user');
                localStorage.removeItem('cv_session');
            }
        }

        // Initial data load based on role
        const initialize = async () => {
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.role === 'admin') {
                    await fetchAdminData();
                } else {
                    await fetchProjects();
                }
            }
            setIsLoading(false);
        };
        
        initialize();
    }, []);

    // ── Login ────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string, role: UserRole): Promise<UserRole> => {
        const { data } = await api.post('/api/auth/login', { email, password, role });

        if (data.success === false) {
            throw new Error(data.error || 'Login failed.');
        }

        const loggedInUser: User = data.user;

        // Persist session + profile
        localStorage.setItem('cv_auth_user', JSON.stringify(loggedInUser));
        if (data.session) {
            localStorage.setItem('cv_session', JSON.stringify(data.session));
        }

        setUser(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name}!`);

        // Fetch data immediately after login
        if (loggedInUser.role === 'admin') {
            await fetchAdminData();
        } else {
            await fetchProjects();
        }

        return loggedInUser.role;
    };

    // ── Signup ───────────────────────────────────────────────────────────────
    const signup = async (
        name: string,
        email: string,
        password: string,
        role: UserRole = 'client',
        phone?: string
    ): Promise<void> => {
        await api.post('/api/auth/signup', { name, email, password, role, phone });
        toast.success('Account created! Please check your email for the verification code.', {
            duration: 6000,
        });
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = async (): Promise<void> => {
        try {
            await api.post('/api/auth/logout');
        } catch {
            // Even if server call fails, clear local state
        }
        setUser(null);
        localStorage.removeItem('cv_auth_user');
        localStorage.removeItem('cv_session');
        toast.success('Logged out successfully');
    };

    // ── Admin: Approve User ───────────────────────────────────────────────────
    const approveUser = async (id: string): Promise<void> => {
        try {
            const { data: updated } = await api.patch(`/api/users/${id}/status`, { status: 'approved' });
            if (updated && updated.status) {
                setAllUsers((prev: User[]) => prev.map((u: User) => u.id === id ? { ...u, status: updated.status } : u));
                toast.success('User account approved successfully');
            } else {
                // Fallback local update if the response doesn't contain the object
                setAllUsers((prev: User[]) => prev.map((u: User) => u.id === id ? { ...u, status: 'approved' } : u));
                toast.success('User account approved successfully');
            }
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to approve user');
        }
    };

    // ── Admin: Reject User ────────────────────────────────────────────────────
    const rejectUser = async (id: string): Promise<void> => {
        try {
            const { data: updated } = await api.patch(`/api/users/${id}/status`, { status: 'rejected' });
            if (updated && updated.status) {
                setAllUsers((prev: User[]) => prev.map((u: User) => u.id === id ? { ...u, status: updated.status } : u));
                toast.success('User account rejected');
            } else {
                 // Fallback local update if the response doesn't contain the object
                 setAllUsers((prev: User[]) => prev.map((u: User) => u.id === id ? { ...u, status: 'rejected' } : u));
                 toast.success('User account rejected');
            }
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to reject user');
        }
    };

    // ── Admin: Delete User ────────────────────────────────────────────────────
    const deleteUser = async (id: string): Promise<void> => {
        try {
            await api.delete(`/api/users/${id}`);
            setAllUsers((prev: User[]) => prev.filter((u: User) => u.id !== id));
            toast.success('User deleted successfully');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to delete user');
        }
    };

    // ── Admin: Delete Project ────────────────────────────────────────────────────
    const deleteProject = async (id: string): Promise<void> => {
        try {
            await api.delete(`/api/projects/${id}`);
            setProjects((prev: any[]) => prev.filter((p: any) => p.id !== id));
            toast.success('Project deleted successfully');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to delete project');
        }
    };

    // ── Admin: Delete Invoice ────────────────────────────────────────────────────
    const deleteInvoice = async (id: string): Promise<void> => {
        try {
            await api.delete(`/api/invoices/${id}`);
            setInvoices((prev: any[]) => prev.filter((i: any) => i.id !== id));
            toast.success('Invoice deleted successfully');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to delete invoice');
        }
    };

    // ── Admin: Delete Ticket ────────────────────────────────────────────────────
    const deleteTicket = async (id: string): Promise<void> => {
        try {
            await api.delete(`/api/tickets/${id}`);
            setTickets((prev: any[]) => prev.filter((t: any) => t.id !== id));
            toast.success('Ticket deleted successfully');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to delete ticket');
        }
    };

    // ── Forgot Password ───────────────────────────────────────────────────────
    const forgotPassword = async (email: string): Promise<void> => {
        try {
            const { data } = await api.post('/api/auth/forgot-password', { email });
            if (data.error) throw new Error(data.error);
            toast.success('If an account exists, a reset link has been sent to your email.');
        } catch (err: any) {
            const message = err.response?.data?.error || err.message;
            throw new Error(message || 'Failed to send reset link');
        }
    };

    // ── Reset Password ────────────────────────────────────────────────────────
    const resetPassword = async (email: string, token: string, newPassword: string): Promise<void> => {
        try {
            const { data } = await api.post('/api/auth/reset-password', { email, token, newPassword });
            if (data.error) throw new Error(data.error);
            toast.success('Password reset successfully! You can now log in.');
        } catch (err: any) {
            const message = err.response?.data?.error || err.message;
            throw new Error(message || 'Failed to reset password');
        }
    };

    // ── Update Profile ───────────────────────────────────────────────────────
    const updateProfile = async (updates: Partial<User>): Promise<void> => {
        if (!user) return;
        try {
            const { data } = await api.patch(`/api/users/${user.id}`, updates);
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            localStorage.setItem('cv_auth_user', JSON.stringify(updatedUser));
            toast.success('Profile updated successfully');
        } catch (err: any) {
            const message = err.response?.data?.error || err.message;
            toast.error(message || 'Failed to update profile');
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout,
            allUsers,
            approveUser,
            rejectUser,
            deleteUser,
            deleteProject,
            deleteInvoice,
            deleteTicket,
            forgotPassword,
            resetPassword,
            projects,
            invoices,
            tickets,
            adminStats,
            fetchAdminData,
            fetchProjects,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
