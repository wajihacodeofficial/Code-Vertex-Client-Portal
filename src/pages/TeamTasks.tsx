import React, { useState } from 'react';
import { 
  Clock, 
  MoreVertical, 
  Plus, 
  Search, 
  Filter, 
  User,
  MessageSquare
} from 'lucide-react';

const TeamTasks: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Internal state mock
    const tasks = [
        { id: 'TSK-01', title: 'Fix JWT Token Expiration Bug', project: 'LogistiX Mobile App', priority: 'High', status: 'In Progress', assignee: 'Partner Dev', due: 'Today', notes: 2 },
        { id: 'TSK-02', title: 'Implement Stripe Webhooks', project: 'E-Commerce Core', priority: 'Critical', status: 'To Do', assignee: 'Unassigned', due: 'Tomorrow', notes: 5 },
        { id: 'TSK-03', title: 'Update Dashboard UI to v4', project: 'Code Vertex Internal', priority: 'Medium', status: 'Review', assignee: 'Admin', due: 'Next Week', notes: 0 },
        { id: 'TSK-04', title: 'Database Migration Strategy', project: 'FinTech Platform', priority: 'High', status: 'In Progress', assignee: 'Partner Dev', due: 'Tomorrow', notes: 1 }
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 font-display">Task Management</h1>
                    <p className="text-text-muted text-sm mt-1">Internal task execution, assignment, and tracking.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                        />
                    </div>
                    <button className="btn-secondary flex items-center gap-2 group text-sm shrink-0">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="btn-primary flex items-center gap-2 group text-sm shrink-0">
                        <Plus size={16} />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* To Do */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-text-primary uppercase tracking-widest text-[10px]">To Do</h3>
                        <span className="bg-white/10 text-text-primary px-2 py-0.5 rounded text-[10px] font-bold">1</span>
                    </div>
                    {tasks.filter(t => t.status === 'To Do').map(task => (
                        <div key={task.id} className="glass-card p-5 rounded-card border shadow-glow hover:border-emerald/30 transition-all cursor-pointer group">
                             <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                    task.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                    task.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-text-muted'
                                }`}>{task.priority}</span>
                                <button className="text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16} />
                                </button>
                             </div>
                             <h4 className="text-sm font-bold text-text-primary mb-2">{task.title}</h4>
                             <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-4">{task.project}</p>
                             
                             <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-muted">
                                    <Clock size={12} className={task.due === 'Tomorrow' ? 'text-amber-400' : ''} />
                                    <span className={task.due === 'Tomorrow' ? 'text-amber-400' : ''}>{task.due}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {task.notes > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] text-emerald font-bold">
                                            <MessageSquare size={12} /> {task.notes}
                                        </div>
                                    )}
                                    <div className="w-6 h-6 rounded-full bg-surface border border-white/10 flex items-center justify-center text-text-muted">
                                        <User size={12} />
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* In Progress */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-text-primary uppercase tracking-widest text-[10px]">In Progress</h3>
                        <span className="bg-emerald/20 text-emerald px-2 py-0.5 rounded text-[10px] font-bold">2</span>
                    </div>
                    {tasks.filter(t => t.status === 'In Progress').map(task => (
                        <div key={task.id} className="glass-card p-5 rounded-card border border-emerald/20 bg-emerald/5 shadow-glow hover:border-emerald/40 transition-all cursor-pointer group">
                             <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                    task.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                    task.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-text-muted'
                                }`}>{task.priority}</span>
                                <button className="text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16} />
                                </button>
                             </div>
                             <h4 className="text-sm font-bold text-text-primary mb-2">{task.title}</h4>
                             <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-4">{task.project}</p>
                             
                             <div className="flex justify-between items-center border-t border-emerald/10 pt-4">
                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-muted">
                                    <Clock size={12} className={task.due === 'Today' ? 'text-red-400' : ''} />
                                    <span className={task.due === 'Today' ? 'text-red-400' : ''}>{task.due}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {task.notes > 0 && (
                                        <div className="flex items-center gap-1 text-[10px] text-emerald font-bold">
                                            <MessageSquare size={12} /> {task.notes}
                                        </div>
                                    )}
                                    <div className="w-6 h-6 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-emerald text-[8px] font-black uppercase">
                                        PD
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>

                {/* In Review */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold text-text-primary uppercase tracking-widest text-[10px]">In Review</h3>
                        <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-[10px] font-bold">1</span>
                    </div>
                    {tasks.filter(t => t.status === 'Review').map(task => (
                        <div key={task.id} className="glass-card p-5 rounded-card border shadow-glow hover:border-amber-400/30 transition-all cursor-pointer group">
                             <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                    task.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                    task.priority === 'High' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-text-muted'
                                }`}>{task.priority}</span>
                                <button className="text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16} />
                                </button>
                             </div>
                             <h4 className="text-sm font-bold text-text-primary mb-2">{task.title}</h4>
                             <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-4">{task.project}</p>
                             
                             <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-text-muted">
                                    <Clock size={12} />
                                    <span>{task.due}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-[8px] font-black uppercase">
                                        AD
                                    </div>
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamTasks;
