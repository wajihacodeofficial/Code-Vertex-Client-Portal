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
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const AdminInvoices: React.FC = () => {
    const { invoices, adminStats } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const filteredInvoices = (invoices || []).filter(inv => 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        inv.projects?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch(status) {
            case 'Paid': return 'bg-success/10 text-success border-success/20';
            case 'Sent': 
            case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Overdue': 
            case 'Unpaid': return 'bg-danger/10 text-danger border-danger/20';
            case 'Draft': return 'bg-white/10 text-text-muted border-white/20';
            default: return 'bg-white/5 text-text-muted';
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 font-display">Financial Control</h1>
                    <p className="text-text-muted text-sm mt-1">Manage billing, generate invoices, and track revenue.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search invoices..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                        />
                    </div>
                    <button className="btn-secondary flex items-center gap-2 group text-sm shrink-0">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button onClick={() => setIsCreateOpen(true)} className="btn-primary flex items-center gap-2 group text-sm shrink-0">
                        <Plus size={16} />
                        <span>Create Invoice</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-5 rounded-card border shadow-glow border-amber-400/20 bg-amber-400/5">
                    <p className="text-[10px] text-amber-400 uppercase font-black tracking-widest flex items-center gap-2"><DollarSign size={12}/> Total Revenue</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-2">
                        ${(adminStats?.totalRevenue || 0).toLocaleString()}
                    </h3>
                </div>
                <div className="glass-card p-5 rounded-card border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Active Projects</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">
                        {adminStats?.activeProjects || 0}
                    </h3>
                </div>
                <div className="glass-card p-5 rounded-card border border-danger/20 bg-danger/5">
                    <p className="text-[10px] text-danger uppercase font-black tracking-widest flex items-center gap-2"><AlertCircle size={12}/> Pending Approvals</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">
                        {adminStats?.pendingApprovals || 0}
                    </h3>
                </div>
                <div className="glass-card p-5 rounded-card border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Total Partners</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">
                        {adminStats?.activeClients || 0}
                    </h3>
                </div>
            </div>

            <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/5 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Invoice ID</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Issued / Due</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {filteredInvoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/2 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-surface border border-white/10 text-text-muted group-hover:text-amber-400 transition-colors">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-text-primary">{inv.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{inv.projects?.name || 'General Project'}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-text-primary">${Number(inv.amount).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-text-primary">{dayjs(inv.issue_date).format('MMM DD, YYYY')}</span>
                                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Due: {dayjs(inv.due_date).format('MMM DD, YYYY')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:text-text-primary text-text-muted transition-colors rounded-lg hover:bg-white/5"><Send size={16} /></button>
                                            <button className="p-2 hover:text-text-primary text-text-muted transition-colors rounded-lg hover:bg-white/5"><Download size={16} /></button>
                                            <button className="p-2 hover:text-text-primary text-text-muted transition-colors rounded-lg hover:bg-white/5"><MoreVertical size={16} /></button>
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
                    <div className="glass-card relative z-10 w-full max-w-xl h-full border-l shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-white/5 bg-surface/50">
                            <h2 className="text-xl font-display font-bold text-text-primary">Create New Invoice</h2>
                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Drafting mode</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-text-primary border-b border-white/10 pb-2">Client Details</h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Select Client</label>
                                    <select className="input-field w-full appearance-none bg-surface p-3 border-dashed hover:border-amber-400/50 transition-colors">
                                        <option>Select a client...</option>
                                        <option>LogistiX Corp</option>
                                        <option>TechFlow</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-text-primary border-b border-white/10 pb-2">Invoice Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Issue Date</label>
                                        <input type="date" className="input-field w-full" defaultValue="2026-04-04" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Due Date</label>
                                        <input type="date" className="input-field w-full" defaultValue="2026-04-18" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                    <h3 className="text-sm font-bold text-text-primary">Line Items</h3>
                                    <button className="text-[10px] text-amber-400 uppercase font-black tracking-widest hover:underline">+ Add Item</button>
                                </div>
                                <div className="space-y-3">
                                    {/* Mock line item 1 */}
                                    <div className="flex gap-3 items-start">
                                        <div className="grow">
                                            <input type="text" className="input-field w-full py-2 text-sm" defaultValue="Frontend Development (Phase 1)" />
                                        </div>
                                        <div className="w-24">
                                            <input type="number" className="input-field w-full py-2 text-sm text-center" defaultValue={1} />
                                        </div>
                                        <div className="w-32">
                                            <input type="text" className="input-field w-full py-2 text-sm text-right" defaultValue="$4,500.00" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <div className="w-64 space-y-2">
                                        <div className="flex justify-between text-sm text-text-muted font-bold">
                                            <span>Subtotal</span>
                                            <span>$4,500.00</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-text-muted font-bold">
                                            <span>Tax (0%)</span>
                                            <span>$0.00</span>
                                        </div>
                                        <div className="flex justify-between text-lg text-text-primary font-black border-t border-white/10 pt-2 mt-2">
                                            <span>Total</span>
                                            <span className="text-amber-400">$4,500.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-surface/50 flex justify-end gap-3">
                            <button onClick={() => setIsCreateOpen(false)} className="btn-secondary py-2.5">Cancel</button>
                            <button onClick={() => setIsCreateOpen(false)} className="bg-white/10 text-text-primary font-bold py-2.5 px-6 rounded-lg uppercase tracking-wider text-xs hover:bg-white/20 transition-all">Save Draft</button>
                            <button onClick={() => setIsCreateOpen(false)} className="btn-primary py-2.5 flex items-center gap-2"><Send size={14}/> Send to Client</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInvoices;
