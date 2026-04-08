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
    status?: 'pending' | 'approved' | 'rejected';
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
}

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<User[]>([]);

    // ── Fetch all users (for admin panel) ───────────────────────────────────
    const fetchAllUsers = async () => {
        try {
            const { data } = await api.get('/api/users');
            setAllUsers(data);
        } catch {
            // Non-critical — admin panel will just be empty
        }
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

        // Load all users for admin panel
        fetchAllUsers();
        setIsLoading(false);
    }, []);

    // ── Login ────────────────────────────────────────────────────────────────
    const login = async (email: string, password: string, role: UserRole): Promise<UserRole> => {
        const { data } = await api.post('/api/auth/login', { email, password, role });

        const loggedInUser: User = data.user;

        // Persist session + profile
        localStorage.setItem('cv_auth_user', JSON.stringify(loggedInUser));
        if (data.session) {
            localStorage.setItem('cv_session', JSON.stringify(data.session));
        }

        setUser(loggedInUser);
        toast.success(`Welcome back, ${loggedInUser.name}!`);

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
            setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: updated.status } : u));
            toast.success('User account approved successfully');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to approve user');
        }
    };

    // ── Admin: Reject User ────────────────────────────────────────────────────
    const rejectUser = async (id: string): Promise<void> => {
        try {
            const { data: updated } = await api.patch(`/api/users/${id}/status`, { status: 'rejected' });
            setAllUsers(prev => prev.map(u => u.id === id ? { ...u, status: updated.status } : u));
            toast.success('User account rejected');
        } catch (err: unknown) {
            const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
            toast.error(message || 'Failed to reject user');
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
