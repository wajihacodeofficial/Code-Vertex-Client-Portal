import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Ticket, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Flag,
  X 
} from 'lucide-react';
import { tickets as mockTickets } from '../data/mockData';
const TicketsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const filteredTickets = mockTickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'All' || t.status === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0">Support Tickets</h1>
                    <p className="text-text-muted text-sm mt-1">Get help from our technical team and track resolutions.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search tickets..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                        />
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary flex items-center gap-2 group text-sm shrink-0">
                        <Plus size={16} />
                        <span>Create Ticket</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-5 rounded-card border border-white/5">
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Total Tickets</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{mockTickets.length}</h3>
                </div>
                <div className="glass-card p-5 rounded-card border border-primary/20 bg-primary/5">
                    <p className="text-[10px] text-primary uppercase font-black tracking-widest">Active/Open</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{mockTickets.filter(t => t.status === 'Open').length}</h3>
                </div>
                <div className="glass-card p-5 rounded-card border border-success/20 bg-success/5">
                    <p className="text-[10px] text-success uppercase font-black tracking-widest">Resolved</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{mockTickets.filter(t => t.status === 'Resolved').length}</h3>
                </div>
                <div className="glass-card p-5 rounded-card border border-danger/20 bg-danger/5">
                    <p className="text-[10px] text-danger uppercase font-black tracking-widest">Critical/High</p>
                    <h3 className="text-2xl font-display font-bold text-text-primary mt-1">{mockTickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length}</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(tab => (
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

            {/* Tickets List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} className="glass-card p-5 rounded-card border border-white/5 group hover:border-white/10 transition-all cursor-pointer">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2.5 rounded-xl ${
                                    ticket.status === 'Open' ? 'bg-primary/10 text-primary' :
                                    ticket.status === 'Resolved' ? 'bg-success/10 text-success' : 'bg-white/5 text-text-muted'
                                }`}>
                                    <Ticket size={20} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-text-primary font-bold leading-none">{ticket.subject}</h3>
                                        <span className="text-[10px] text-text-muted font-bold px-2 py-0.5 bg-white/5 rounded">#{ticket.id}</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                ticket.priority === 'High' || ticket.priority === 'Critical' ? 'bg-danger' : 
                                                ticket.priority === 'Medium' ? 'bg-warning' : 'bg-text-muted'
                                            }`}></div>
                                            Priority: {ticket.priority}
                                        </p>
                                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest flex items-center gap-1.5">
                                            <Flag size={12} />
                                            Project: {ticket.project}
                                        </p>
                                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest flex items-center gap-1.5">
                                            <Clock size={12} />
                                            Created: {ticket.created}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <img src="https://i.pravatar.cc/150?u=support1" className="w-7 h-7 rounded-full border-2 border-surface" alt="" />
                                        <div className="w-7 h-7 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] text-text-muted font-bold">+2</div>
                                    </div>
                                    <span className="text-[10px] text-text-muted font-bold ml-1">4 Replies</span>
                                </div>
                                
                                <div className={`status-badge w-fit ${
                                    ticket.status === 'Open' ? 'status-cyan shadow-glow' :
                                    ticket.status === 'Resolved' ? 'status-green' : 'status-gray'
                                }`}>
                                    {ticket.status}
                                </div>

                                <ChevronRight size={20} className="text-text-muted group-hover:text-text-primary transition-colors hidden md:block" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTickets.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-text-muted mb-4 opacity-50">
                        <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl text-text-primary">No tickets found</h3>
                    <p className="text-text-muted mt-2">Try searching for something else or create a new support ticket.</p>
                </div>
            )}

            {/* Create Ticket Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="glass-card relative z-10 w-full max-w-2xl rounded-card overflow-hidden border shadow-glow flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-white/5 bg-surface/50">
                            <h2 className="text-xl font-display font-bold text-text-primary">Create Support Ticket</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Ticket Subject</label>
                                <input type="text" className="input-field w-full" placeholder="Briefly describe the issue..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Connected Project</label>
                                    <select className="input-field w-full appearance-none bg-surface">
                                        <option>General Support</option>
                                        <option>LogistiX Mobile App</option>
                                        <option>E-Commerce Core</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Priority Level</label>
                                    <select className="input-field w-full appearance-none bg-surface">
                                        <option value="low">Low (Standard Request)</option>
                                        <option value="medium">Medium (Impeding work)</option>
                                        <option value="high">High (Critical Issue)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Detailed Description</label>
                                <textarea rows={5} className="input-field w-full resize-none" placeholder="Provide as much detail as possible to help our team understand..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Attachments</label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-white/5">
                                    <p className="text-sm font-medium text-text-primary mb-1">Click to upload or drag & drop</p>
                                    <p className="text-[10px] text-text-muted uppercase tracking-widest">SVG, PNG, JPG or PDF (max 10MB)</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-surface/50">
                            <button onClick={() => setIsCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                            <button onClick={() => setIsCreateModalOpen(false)} className="btn-primary">Submit Ticket</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
