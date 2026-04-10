import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  Send,
  DollarSign,
  Download,
  AlertCircle,
  X
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';

const AdminInvoices: React.FC = () => {
    const { invoices, adminStats, projects, fetchAdminData } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        project_id: '',
        amount: '',
        status: 'Sent',
        issue_date: dayjs().format('YYYY-MM-DD'),
        due_date: dayjs().add(14, 'day').format('YYYY-MM-DD')
    });

    const filteredInvoices = (invoices || []).filter(inv => 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        inv.projects?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.project_id || !formData.amount) {
            toast.error('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/admin/invoices', {
                ...formData,
                amount: parseFloat(formData.amount)
            });
            toast.success('Invoice issued successfully');
            setIsCreateOpen(false);
            fetchAdminData(); // Refresh list
            setFormData({
                project_id: '',
                amount: '',
                status: 'Sent',
                issue_date: dayjs().format('YYYY-MM-DD'),
                due_date: dayjs().add(14, 'day').format('YYYY-MM-DD')
            });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to issue invoice');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Paid': return 'bg-emerald/10 text-emerald border-emerald/20';
            case 'Sent': 
            case 'Pending': return 'bg-amber-400/10 text-amber-400 border-amber-400/20';
            case 'Overdue': 
            case 'Unpaid': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Draft': return 'bg-white/10 text-text-muted border-white/20';
            default: return 'bg-white/5 text-text-muted';
        }
    };

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 font-display heading-gradient pb-1">Financial Operations</h1>
                    <p className="text-text-muted text-sm mt-1">Manage global billing cycles and track revenue streams in real-time.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 grow lg:grow-0 group focus-within:border-primary/50 transition-all">
                        <Search size={18} className="text-text-muted group-focus-within:text-primary transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find invoices..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full lg:w-64 focus:ring-0"
                        />
                    </div>
                    <button onClick={() => setIsCreateOpen(true)} className="btn-primary flex items-center gap-2 group text-sm shrink-0 px-6">
                        <Plus size={16} />
                        <span>Issue Invoice</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-card border shadow-glow border-amber-400/20 bg-amber-400/5 group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] text-amber-400 uppercase font-black tracking-widest flex items-center gap-2"><DollarSign size={12}/> Net Revenue</p>
                    <h3 className="text-3xl font-display font-black text-text-primary mt-2">
                        ${(adminStats?.totalRevenue || 0).toLocaleString()}
                    </h3>
                </div>
                <div className="glass-card p-6 rounded-card border border-white/5 group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Active Cycles</p>
                    <h3 className="text-3xl font-display font-black text-text-primary mt-2">
                        {adminStats?.activeProjects || 0}
                    </h3>
                </div>
                <div className="glass-card p-6 rounded-card border border-red-500/20 bg-red-500/5 group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest flex items-center gap-2"><AlertCircle size={12}/> Access Requests</p>
                    <h3 className="text-3xl font-display font-black text-text-primary mt-2">
                        {adminStats?.pendingApprovals || 0}
                    </h3>
                </div>
                <div className="glass-card p-6 rounded-card border border-white/5 group hover:scale-[1.02] transition-transform">
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Enterprise Partners</p>
                    <h3 className="text-3xl font-display font-black text-text-primary mt-2">
                        {adminStats?.activeClients || 0}
                    </h3>
                </div>
            </div>

            <div className="glass-card rounded-card border shadow-glow overflow-hidden bg-white/1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/5 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Invoice Identifier</th>
                                <th className="px-6 py-5">Partner / Account</th>
                                <th className="px-6 py-5">Financial Value</th>
                                <th className="px-6 py-5">Maturity Timeline</th>
                                <th className="px-6 py-5">Governance Status</th>
                                <th className="px-6 py-5 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredInvoices.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-text-muted text-sm uppercase tracking-widest font-bold">No financial records detected.</td>
                            </tr>
                        ) : filteredInvoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-surface border border-white/10 text-text-muted group-hover:text-primary transition-colors">
                                                <FileText size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-text-primary uppercase racking-tighter">INV-{inv.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-text-primary">{inv.projects?.name || 'Tactical Reserve'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-text-primary">${Number(inv.amount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-text-primary font-medium">{dayjs(inv.issue_date).format('MMM DD, YYYY')}</span>
                                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">DUE: {dayjs(inv.due_date).format('MMM DD, YYYY')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2.5 hover:text-primary text-text-muted transition-colors rounded-xl hover:bg-white/5" title="Transmit"><Send size={16} /></button>
                                            <button className="p-2.5 hover:text-primary text-text-muted transition-colors rounded-xl hover:bg-white/5" title="Export PDF"><Download size={16} /></button>
                                            <button className="p-2.5 hover:text-primary text-text-muted transition-colors rounded-xl hover:bg-white/5"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Sidebar Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex justify-end animate-in">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)}></div>
                    <form onSubmit={handleCreateInvoice} className="glass-card relative z-10 w-full max-w-xl h-full border-l shadow-2xl flex flex-col bg-surface">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/2">
                            <div>
                                <h2 className="text-2xl font-display font-black text-text-primary uppercase tracking-tighter">Generate Financial Record</h2>
                                <p className="text-[10px] text-primary uppercase font-bold tracking-[0.2em] mt-1">Authorized Admin Access</p>
                            </div>
                            <button type="button" onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-text-muted transition-colors"><X size={24}/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            <section className="space-y-6">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
                                   <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-glow"></div> Partner Assignment
                                </h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Select Active Project</label>
                                    <select 
                                        className="input-field w-full appearance-none bg-white/5 p-4 border-white/10 focus:border-primary/50 transition-all text-sm font-medium"
                                        value={formData.project_id}
                                        onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-surface">SELECT PROJECT ENTITY</option>
                                        {projects?.map(p => (
                                            <option key={p.id} value={p.id} className="bg-surface">{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
                                   <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-glow"></div> Financial Parameters
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Invoice Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                                            <input 
                                                type="number" 
                                                className="input-field w-full pl-10 py-4" 
                                                placeholder="0.00"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Issue Date</label>
                                        <input 
                                            type="date" 
                                            className="input-field w-full py-4 px-4"
                                            value={formData.issue_date}
                                            onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Maturity Date</label>
                                        <input 
                                            type="date" 
                                            className="input-field w-full py-4 px-4"
                                            value={formData.due_date}
                                            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-4">
                                   <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-glow"></div> Governance
                                </h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Initial Status</label>
                                    <select 
                                        className="input-field w-full appearance-none bg-white/5 p-4 border-white/10 text-sm font-medium"
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                    >
                                        <option value="Sent" className="bg-surface">SENT / TRANSMITTED</option>
                                        <option value="Draft" className="bg-surface">DRAFT MODE</option>
                                        <option value="Paid" className="bg-surface">SETTLED / PAID</option>
                                    </select>
                                </div>
                            </section>
                        </div>

                        <div className="p-8 border-t border-white/10 bg-white/2 flex justify-end gap-4">
                            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn-secondary px-8 py-3">Cancel</button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn-primary flex items-center gap-3 px-10 py-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
                                )}
                                <span>{isSubmitting ? 'GENERATING...' : 'ISSUE RECORD'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminInvoices;
