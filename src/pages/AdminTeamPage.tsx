import React, { useState } from 'react';
import { UsersRound, Search, ShieldCheck, Mail, Phone, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/Footer';

const AdminTeamPage: React.FC = () => {
    const { allUsers, approveUser, rejectUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const teamMembers = allUsers.filter(u => 
        (u.role === 'team' || u.role === 'admin') && 
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingReview = teamMembers.filter(u => u.status === 'pending');
    const activeTeam = teamMembers.filter(u => u.status === 'approved');

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0">Team Governance</h1>
                    <p className="text-text-muted text-sm mt-1">Manage internal access, roles, and administrative approvals.</p>
                </div>
                
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 w-full lg:w-80">
                    <Search size={18} className="text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search team members..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                    />
                </div>
            </div>

            {/* Pending Approvals Section */}
            {pendingReview.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <ShieldCheck size={18} /> Pending Team Requests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingReview.map(user => (
                            <div key={user.id} className="glass-card p-6 border-amber-500/20 bg-amber-500/5 rounded-card flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-text-primary font-bold">{user.name}</h3>
                                        <p className="text-xs text-text-muted">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => approveUser(user.id)}
                                        className="p-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                                        title="Approve Member"
                                    >
                                        <CheckCircle2 size={20} />
                                    </button>
                                    <button 
                                        onClick={() => rejectUser(user.id)}
                                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                                        title="Reject Request"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Team Table */}
            <div className="glass-card rounded-card border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg text-text-primary font-bold flex items-center gap-2">
                        <UsersRound size={20} className="text-primary" /> Approved Personnel
                    </h2>
                    <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black tracking-widest">{activeTeam.length} ACTIVE</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/2 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Security Level</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeTeam.map(user => (
                                <tr key={user.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{user.name}</p>
                                                <span className="text-[10px] text-text-muted">UID: {user.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`status-badge w-fit ${user.role === 'admin' ? 'status-amber' : 'status-cyan'}`}>
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <Mail size={12} /> {user.email}
                                            </div>
                                            {user.phone && (
                                                <div className="flex items-center gap-2 text-xs text-text-muted">
                                                    <Phone size={12} /> {user.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black tracking-widest text-text-primary/40 uppercase">Full Access</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminTeamPage;
