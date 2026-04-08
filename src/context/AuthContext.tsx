import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export type UserRole = 'client' | 'team' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  clientId?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole) => Promise<UserRole>;
  signup: (name: string, email: string, role?: UserRole, phone?: string) => Promise<void>;
  logout: () => void;
  allUsers: User[];
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check localStorage for session on mount
    const storedUser = localStorage.getItem('cv_auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('cv_auth_user');
      }
    }

    const storedUsers = localStorage.getItem('cv_auth_all_users');
    let parsedUsers: User[] = [];
    if (storedUsers) {
      try {
        parsedUsers = JSON.parse(storedUsers);
      } catch(e) {}
    }

    const mandatoryAccounts: User[] = [
        { id: 'admin1', name: 'System Admin', email: 'admin@codevertex.solutions', role: 'admin', status: 'approved' },
        { id: 'admin2', name: 'System Admin', email: 'admin@codevertex.solution', role: 'admin', status: 'approved' },
        { id: 'team1', name: 'Team Member', email: 'team@codevertex.solutions', role: 'team', status: 'approved' },
        { id: 'client1', name: 'Test Client', email: 'testclient@gmail.com', role: 'client', status: 'approved' }
    ];

    const finalizedUsers = [...parsedUsers];
    mandatoryAccounts.forEach(acc => {
        const existingIdx = finalizedUsers.findIndex(u => u.email.toLowerCase() === acc.email.toLowerCase());
        if (existingIdx === -1) {
            finalizedUsers.push(acc);
        } else {
            finalizedUsers[existingIdx].role = acc.role;
            finalizedUsers[existingIdx].status = 'approved'; // Force approved to end lockout issues
        }
    });

    setAllUsers(finalizedUsers);
    localStorage.setItem('cv_auth_all_users', JSON.stringify(finalizedUsers));
    
    setIsLoading(false);
  }, []);

  const approveUser = (id: string) => {
    const updated = allUsers.map(u => u.id === id ? { ...u, status: 'approved' as const } : u);
    setAllUsers(updated);
    localStorage.setItem('cv_auth_all_users', JSON.stringify(updated));
    toast.success('User account approved successfully');
  };

  const rejectUser = (id: string) => {
    const updated = allUsers.map(u => u.id === id ? { ...u, status: 'rejected' as const } : u);
    setAllUsers(updated);
    localStorage.setItem('cv_auth_all_users', JSON.stringify(updated));
    toast.success('User account rejected');
  };

  const login = async (email: string, role: UserRole) => {
    return new Promise<UserRole>((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('cv_auth_all_users') || '[]');
        const existingUser = storedUsers.find((u: User) => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            if (existingUser.phone?.startsWith('+972')) {
                toast.error('Access from this region is not permitted.');
                return reject(new Error('Blocked region'));
            }
            if (existingUser.role !== role) {
                // Exception: Admin can log in using team toggle
                if (!(role === 'team' && existingUser.role === 'admin')) {
                    toast.error(`Invalid role. This is a ${existingUser.role} account but chosen role is ${role}.`);
                    return reject(new Error('Role mismatch'));
                }
            }
            if (existingUser.status === 'pending') {
                toast('Account setup pending. An admin will review your registration soon.', { icon: '⏳', duration: 6000 });
                return reject(new Error('Pending approval'));
            } else if (existingUser.status === 'approved') {
                toast.success(`Successfully logged in as ${existingUser.role}`);
            } else if (existingUser.status === 'rejected') {
                toast.error('Login denied. Your account request was rejected.');
                return reject(new Error('Rejected'));
            }
            setUser(existingUser);
            localStorage.setItem('cv_auth_user', JSON.stringify(existingUser));
            return resolve(existingUser.role);
        }

        // Only auto-create if completely unknown AND trying to login as client (fallback mock)
        if (role !== 'client') {
            toast.error('Account not found. Please register.');
            return reject(new Error('Not found'));
        }

        const mockUser: User = {
          id: `u_${Date.now()}`,
          name: email.split('@')[0] || 'User',
          email,
          role,
          status: 'approved',
          clientId: role === 'client' ? 'client_1' : undefined
        };
        setUser(mockUser);
        localStorage.setItem('cv_auth_user', JSON.stringify(mockUser));
        toast.success(`Successfully logged in as ${role}`);
        resolve(role);
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, role: UserRole = 'client', phone?: string) => {
    if (phone?.startsWith('+972')) {
        toast.error('Access from this region is not permitted.');
        return Promise.reject(new Error('Blocked region'));
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `u_${Date.now()}`,
          name,
          email,
          role,
          phone,
          status: 'pending',
          clientId: role === 'client' ? `client_${Date.now()}` : undefined
        };
        
        const updatedUsers = [...allUsers, newUser];
        setAllUsers(updatedUsers);
        localStorage.setItem('cv_auth_all_users', JSON.stringify(updatedUsers));

        toast.success('Registration successful! Your account is now awaiting admin approval.', { duration: 6000 });
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cv_auth_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, allUsers, approveUser, rejectUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
