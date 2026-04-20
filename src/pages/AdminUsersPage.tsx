import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  UserCog, 
  Filter,
  MoreVertical,
  ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';

const AdminUsersPage: React.FC = () => {
    const { allUsers, approveUser, rejectUser, deleteUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const filteredUsers = allUsers.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const pendingApprovals = allUsers.filter(u => u.status === 'pending');

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 heading-gradient">User Command Center</h1>
                    <p className="text-text-muted text-sm mt-1">Global oversight of all platform identities and registration lifecycle.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 grow lg:grow-0 transition-all focus-within:border-primary/50">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Universal search..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-3 w-full lg:w-64 focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            {/* Registration Queue - Critical Visibility */}
            {pendingApprovals.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                         <ShieldCheck size={18} className="animate-pulse" /> Urgent Approval Queue
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingApprovals.map(user => (
                            <div key={user.id} className="glass-card p-6 border-primary/20 bg-primary/5 rounded-card flex flex-col gap-6 shadow-glow transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/10">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-text-primary font-bold truncate leading-none">{user.name}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                                user.role === 'team' ? 'bg-emerald-500/20 text-emerald' : 'bg-blue-500/20 text-blue-400'
                                            }`}>{user.role}</span>
                                            
                                            {user.email_verified ? (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-success/20 text-success flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Verified
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 flex items-center gap-1">
                                                    <Mail size={10} /> Unverified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-text-muted truncate mt-1">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => approveUser(user.id)}
                                        className="flex-1 py-3 bg-success/10 text-success border border-success/20 rounded-xl hover:bg-success/20 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <CheckCircle2 size={16} /> Authorize Access
                                    </button>
                                    <button 
                                        onClick={() => rejectUser(user.id)}
                                        className="py-3 px-4 bg-red-400/10 text-red-400 border border-red-400/20 rounded-xl hover:bg-red-400/20 transition-all flex items-center justify-center"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Global Directory with Advanced Filtering */}
            <div className="glass-card rounded-card border border-white/10 shadow-glow overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white/2">
                    <h2 className="text-lg text-text-primary font-bold flex items-center gap-2">
                        <UserCog size={20} className="text-primary" /> Master User Directory
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                            <Filter size={14} />
                            Role:
                            <select 
                                value={roleFilter} 
                                onChange={(e) => setRoleFilter(e.target.value as any)}
                                className="bg-transparent border-none outline-none text-text-primary focus:ring-0 cursor-pointer"
                            >
                                <option value="all">Every Account</option>
                                <option value="admin">Administrators</option>
                                <option value="team">Execution Team</option>
                                <option value="client">Client Owners</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                            <ArrowUpDown size={14} />
                            Status:
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="bg-transparent border-none outline-none text-text-primary focus:ring-0 cursor-pointer"
                            >
                                <option value="all">All States</option>
                                <option value="approved">Active</option>
                                <option value="pending">In Review</option>
                                <option value="rejected">Denied</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/2 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Identity Profile</th>
                                <th className="px-6 py-5">Platform Role</th>
                                <th className="px-6 py-5">Contact Vector</th>
                                <th className="px-6 py-5">Account Status</th>
                                <th className="px-6 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-primary/2 transition-colors group">
                                    <td className="px-6 py-6 transition-transform group-hover:translate-x-1">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{user.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] text-text-muted font-bold">UID: {user.id.slice(0, 10).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className={`status-badge w-fit ${
                                            user.role === 'admin' ? 'status-amber' : 
                                            user.role === 'team' ? 'status-green' : 'status-cyan'
                                        }`}>
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs text-text-muted group-hover:text-text-primary transition-colors">
                                                <Mail size={12} className="text-primary/70" /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-xs text-text-muted group-hover:text-text-primary transition-colors">
                                                    <Phone size={12} className="text-primary/70" /> {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                            user.status === 'approved' ? 'text-success' :
                                            user.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                user.status === 'approved' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                user.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                                            }`} />
                                            {user.status || 'Active'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            <button className="p-2 text-text-muted hover:text-text-primary transition-colors" title="Edit Metadata"><UserCog size={18} /></button>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this user?')) {
                                                        deleteUser(user.id);
                                                    }
                                                }}
                                                className="p-2 text-text-muted hover:text-red-500 transition-colors" 
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="p-2 text-text-muted hover:text-text-primary transition-colors"><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-text-muted text-sm font-medium bg-white/1 rounded-b-card border-dashed">
                                        <Users className="mx-auto mb-4 opacity-10" size={48} />
                                        No users matching your current security filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;
