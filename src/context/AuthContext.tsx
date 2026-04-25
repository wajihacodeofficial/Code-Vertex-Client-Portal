import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import api, { API_URL } from '../lib/api';

// ─── Types ─────────────────────────────────────────────────────────────────
export type UserRole = 'client' | 'team' | 'admin';

export interface User {
    id: string;
    supabase_uid?: string;
    email: string;
    name: string;
    role: UserRole;
    status: 'pending' | 'approved' | 'rejected';
    phone?: string;
    avatar?: string;
    email_verified?: boolean;
}

export interface Project {
    id: string;
    name: string;
    status: string;
    progress: number;
    client_id?: string;
    pm_id?: string;
}

export interface Invoice {
    id: string;
    project_id: string;
    amount: number;
    status: string;
    due_date?: string;
}

export interface Ticket {
    id: string;
    project_id: string;
    subject: string;
    priority: string;
    status: string;
}

export interface RegistrationRequest {
    id: string;
    user_id: string;
    role: string;
    document_url?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejection_reason?: string;
    created_at: string;
    users?: {
        name: string;
        email: string;
        phone?: string;
    };
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
    login: (email: string, password: string) => Promise<UserRole>;
    signup: (name: string, email: string, password: string, role?: UserRole, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    allUsers: User[];
    approveUser: (requestId: string) => Promise<void>;
    rejectUser: (requestId: string, reason: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    deleteTicket: (id: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (email: string, token: string, newPassword: string) => Promise<void>;
    projects: Project[];
    invoices: Invoice[];
    tickets: Ticket[];
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [adminStats, setAdminStats] = useState<AdminStats | null>(null);


    const fetchProjects = useCallback(async () => {
        try {
            const { data } = await api.get('/api/projects');
            setProjects(data);
        } catch { /* Suppress */ }
    }, []);

    const fetchAdminStats = useCallback(async () => {
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
    }, []);

    const fetchAdminData = useCallback(async () => {
        // Single efficient call - fetchAdminStats now populates everything
        await fetchAdminStats();
    }, [fetchAdminStats]);

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
    }, [fetchAdminData, fetchProjects]);

    // ── Login ────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string): Promise<UserRole> => {
        const { data } = await api.post('/api/auth/login', { email, password });

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
    ): Promise<any> => {
        const { data } = await api.post('/api/auth/signup', { name, email, password, role, phone });
        toast.success('Account created! Please check your email for the verification code.', {
            duration: 6000,
        });
        return data;
    };

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = async (): Promise<void> => {
        try {
            await api.post('/api/auth/logout');
        } catch { /* Suppress */ }

        // Clear local state
        setUser(null);
        setAllUsers([]);
        setProjects([]);
        
        // Clear storage
        localStorage.removeItem('cv_auth_user');
        localStorage.removeItem('cv_session');
        localStorage.removeItem('token'); // Generic cleanup
        localStorage.removeItem('user');  // Generic cleanup
        
        toast.success('Logged out successfully');
        window.location.href = '/login'; // Force clear all states
    };

    // ── Admin: Approve User ───────────────────────────────────────────────────
    const approveUser = async (requestId: string): Promise<void> => {
        try {
            await api.patch(`/api/registration-requests/${requestId}/review`, { action: 'APPROVE' });
            toast.success('Registration request approved');
            await fetchAdminData(); // Refresh list
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to approve request';
            toast.error(message);
        }
    };

    // ── Admin: Reject User ────────────────────────────────────────────────────
    const rejectUser = async (requestId: string, reason: string): Promise<void> => {
        try {
            await api.patch(`/api/registration-requests/${requestId}/review`, { 
                action: 'REJECT', 
                rejection_reason: reason 
            });
            toast.success('Registration request rejected');
            await fetchAdminData(); // Refresh list
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to reject request';
            toast.error(message);
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

    useEffect(() => {
        const isAuthenticated = !!user;
        if (isAuthenticated && user?.role === 'admin') {
            const socket = io(API_URL || window.location.origin);
            
            socket.on('registration_update', ({ userId, status }: { userId: string, status: string }) => {
                setAllUsers(prev => prev.map(u => 
                    u.id === userId ? { ...u, status: status.toLowerCase() as "pending" | "approved" | "rejected" } : u
                ));
            });

            socket.on('new_registration_request', () => {
                fetchAdminData(); // Refresh everything on new request
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [user, fetchAdminData]);

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
