import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Mail, ShieldCheck, UsersRound, Settings, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminInternalTeam: React.FC = () => {
    const { allUsers, approveUser, rejectUser, deleteUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const teamMembers = allUsers.filter(u => 
        (u.role === 'team' || u.role === 'admin') && 
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingRequests = teamMembers.filter(m => m.status === 'pending');
    const activeStaff = teamMembers.filter(m => m.status === 'approved');

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 heading-gradient">Internal Team Governance</h1>
                    <p className="text-text-muted text-sm mt-1">Oversee staff roles, approve memberships, and audit performance.</p>
                </div>
                
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 w-full lg:w-80">
                    <Search size={18} className="text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search team..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                    />
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-card border shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><UsersRound size={120} /></div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 relative z-10">Total Active Staff</p>
                    <p className="text-3xl font-display font-black text-text-primary relative z-10">{activeStaff.length}</p>
                </div>
                <div className="glass-card p-6 rounded-card border-amber-500/30 bg-amber-500/5 shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] text-amber-500 group-hover:scale-110 transition-transform"><ShieldCheck size={120} /></div>
                    <p className="text-[10px] text-amber-500/70 uppercase font-bold tracking-widest mb-1 relative z-10">Awaiting Approval</p>
                    <p className="text-3xl font-display font-black text-amber-500 relative z-10">{pendingRequests.length}</p>
                </div>
                <div className="glass-card p-6 rounded-card border-emerald/30 bg-emerald/5 shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] text-emerald group-hover:scale-110 transition-transform"><Activity size={120} /></div>
                    <p className="text-[10px] text-emerald/70 uppercase font-bold tracking-widest mb-1 relative z-10">Staff Performance</p>
                    <p className="text-3xl font-display font-black text-emerald relative z-10">92%</p>
                </div>
            </div>

            {/* Internal Membership Queue */}
            {pendingRequests.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <ShieldCheck size={18} /> Internal Staff Membership Queue
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingRequests.map(member => (
                            <div key={member.id} className="glass-card p-6 border-amber-500/20 bg-amber-500/5 rounded-card flex flex-col gap-6 shadow-glow transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-text-primary font-bold truncate">{member.name}</h3>
                                        <p className="text-xs text-text-muted truncate">{member.email}</p>
                                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1 bg-primary/10 px-2 py-0.5 rounded inline-block">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => approveUser(member.id)}
                                        className="flex-1 py-2.5 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <CheckCircle2 size={16} /> Grant Access
                                    </button>
                                    <button 
                                        onClick={() => rejectUser(member.id)}
                                        className="flex-1 py-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <XCircle size={16} /> Deny
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Staff List */}
            <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg text-text-primary font-bold flex items-center gap-2">
                        <UsersRound size={20} className="text-primary" /> Core Staff Directory
                    </h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/2 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Staff Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Security Level</th>
                                <th className="px-6 py-4 text-right">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeStaff.map(member => (
                                <tr key={member.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary font-bold">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{member.name}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                                                    <Mail size={10} /> {member.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-xs font-bold text-text-primary uppercase tracking-widest">{member.role}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-text-muted">
                                        Active
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`status-badge ${member.role === 'admin' ? 'status-amber' : 'status-cyan'} w-fit`}>
                                            {member.role === 'admin' ? 'Elevated Internal' : 'Standard Internal'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-text-muted hover:text-text-primary transition-colors"><Settings size={18} /></button>
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to remove this staff member?')) {
                                                        deleteUser(member.id);
                                                    }
                                                }}
                                                className="p-2 text-text-muted hover:text-red-500 transition-colors"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminInternalTeam;
