import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Mail, Globe, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminClients: React.FC = () => {
    const { allUsers, approveUser, rejectUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const clients = allUsers.filter(u => 
        u.role === 'client' && 
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const pendingClients = clients.filter(c => c.status === 'pending');
    const approvedClients = clients.filter(c => c.status === 'approved');

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0">Client Portfolio</h1>
                    <p className="text-text-muted text-sm mt-1">Manage global enterprise accounts and registration requests.</p>
                </div>
                
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 w-full lg:w-80">
                    <Search size={18} className="text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search clients..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                    />
                </div>
            </div>

            {/* Registration Queue Section */}
            {pendingClients.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                         <ShieldCheck size={18} /> New Registration Queue
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingClients.map(client => (
                            <div key={client.id} className="glass-card p-6 border-primary/20 bg-primary/5 rounded-card flex flex-col gap-6 shadow-glow transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-text-primary font-bold truncate">{client.name}</h3>
                                        <p className="text-xs text-text-muted truncate">{client.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => approveUser(client.id)}
                                        className="flex-1 py-2.5 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <CheckCircle2 size={16} /> Approve
                                    </button>
                                    <button 
                                        onClick={() => rejectUser(client.id)}
                                        className="flex-1 py-2.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Approved Clients List */}
            <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-lg text-text-primary font-bold flex items-center gap-2">
                        <Globe size={20} className="text-primary" /> Active Client Accounts
                    </h2>
                    <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black tracking-widest">{approvedClients.length} APPROVED</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/2 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Identity</th>
                                <th className="px-6 py-4">Registration</th>
                                <th className="px-6 py-4">Security Level</th>
                                <th className="px-6 py-4">Governance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {approvedClients.map(client => (
                                <tr key={client.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-primary font-bold">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-primary">{client.name}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
                                                    <Mail size={10} /> {client.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-text-muted">
                                        {client.status === 'approved' ? 'Active' : 'Pending'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="status-badge status-green w-fit">Full Client</div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-text-muted hover:text-text-primary transition-colors"><Settings size={18} /></button>
                                            <button className="p-2 text-text-muted hover:text-red-500 transition-colors"><XCircle size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {approvedClients.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-text-muted text-sm font-medium">
                                        No approved clients found. 
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

export default AdminClients;
