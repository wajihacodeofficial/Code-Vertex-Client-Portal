import React, { useState } from 'react';
import { 
  Search,
  Download, 
  ExternalLink, 
  Receipt,
  CheckCircle2, 
  Clock, 
  Banknote
} from 'lucide-react';
import { invoices as mockInvoices } from '../data/mockData';
import { Footer } from '../components/Footer';

const InvoicesPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const filteredInvoices = mockInvoices.filter(inv => {
        const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             inv.project.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'All' || inv.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const totalPaid = mockInvoices ? mockInvoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0) : 0;
    const totalOutstanding = mockInvoices ? mockInvoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0) : 0;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0">Invoices & Billing</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your payments and download professional invoices.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search by ID or project..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2 group text-sm shrink-0">
                        <Banknote size={16} />
                        <span>Pay Balance</span>
                    </button>
                </div>
            </div>

            {/* Quick Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-card border border-white/5 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Total Paid</p>
                        <h3 className="text-2xl font-display font-bold text-text-primary mt-0.5">${totalPaid.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-card border border-white/5 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Outstanding</p>
                        <h3 className="text-2xl font-display font-bold text-text-primary mt-0.5">${totalOutstanding.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="glass-card p-6 rounded-card border border-primary/20 bg-primary/5 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center shadow-glow">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-primary uppercase font-black tracking-widest">Latest Invoice</p>
                        <h3 className="text-2xl font-display font-bold text-text-primary mt-0.5">{mockInvoices && mockInvoices.length > 0 ? mockInvoices[0].id : 'N/A'}</h3>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {['All', 'Paid', 'Unpaid', 'Overdue', 'Draft'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                            activeTab === tab 
                                ? 'bg-primary/10 border-primary/30 text-primary' 
                                : 'bg-white/5 border-white/10 text-text-muted hover:text-text-primary'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Invoices Table */}
            <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/5 uppercase text-[10px] text-text-muted font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Invoice ID</th>
                                <th className="px-6 py-4">Project</th>
                                <th className="px-6 py-4">Issue Date</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredInvoices.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-text-primary">{invoice.id}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-text-muted font-medium">{invoice.project}</p>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-text-muted italic">
                                        {invoice.issueDate}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-text-primary">
                                        {invoice.dueDate}
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-black text-text-primary">${invoice.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`status-badge flex items-center justify-center gap-1.5 w-fit ${
                                            invoice.status === 'Paid' ? 'status-green' :
                                            invoice.status === 'Unpaid' ? 'status-cyan' :
                                            invoice.status === 'Overdue' ? 'status-red' : 'status-gray'
                                        }`}>
                                            {invoice.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-text-muted hover:text-text-primary" title="Download PDF"><Download size={18} /></button>
                                            <button className="p-2 text-text-muted hover:text-primary" title="View Detail"><ExternalLink size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Empty State */}
            {filteredInvoices.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-text-muted mb-4">
                        <Receipt size={32} />
                    </div>
                    <h3 className="text-xl text-text-primary">No invoices found</h3>
                    <p className="text-text-muted mt-2">Adjust your filters or search query to find what you're looking for.</p>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default InvoicesPage;
