import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Settings, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Users, 
  History,
  Download,
  Eye,
  Send,
  MoreVertical,
  Paperclip,
  Shield, 
  PlusCircle, 
  DollarSign, 
  Wallet, 
  FileLock2, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { projects as mockProjects } from '../data/mockData';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = mockProjects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('Overview');

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl text-text-primary font-display">Project Not Found</h2>
        <p className="text-text-muted mt-2">The project you're looking for doesn't exist or has been moved.</p>
        <Link to="/projects" className="btn-primary mt-6">Back to Projects</Link>
      </div>
    );
  }

  const tabs = [
    { name: 'Overview', icon: FileText },
    { name: 'Scope & Contract', icon: FileLock2 },
    { name: 'Change Requests', icon: PlusCircle },
    { name: 'Financials', icon: DollarSign },
    { name: 'Milestones', icon: CheckCircle2 },
    { name: 'Deliverables', icon: Download },
    { name: 'Activity Log', icon: History },
    { name: 'Team', icon: Users },
    { name: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <Link to="/projects" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest w-fit">
            <ChevronLeft size={16} />
            Back to Projects
        </Link>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-surface border border-white/10 flex items-center justify-center text-primary text-3xl font-bold shadow-glow shrink-0">
                    {project.name.charAt(0)}
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl text-text-primary m-0">{project.name}</h1>
                        <div className={`status-badge ${
                            project.status === 'In Progress' ? 'status-cyan' :
                            project.status === 'Completed' ? 'status-green' :
                            project.status === 'Blocked' ? 'status-red' :
                            project.status === 'Review' ? 'status-amber' : 'status-gray'
                        }`}>
                            {project.status}
                        </div>
                    </div>
                    <p className="text-text-muted text-sm max-w-2xl">{project.description}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
                <button className="bg-white/5 border border-white/10 text-text-primary p-2.5 rounded-button hover:bg-white/10 transition-all">
                    <Settings size={20} />
                </button>
                <button className="btn-primary px-6">
                    Request Update
                </button>
            </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/5 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
            <button 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.name 
                        ? 'border-primary text-primary bg-primary/5' 
                        : 'border-transparent text-text-muted hover:text-text-primary hover:bg-white/5'
                }`}
            >
                <tab.icon size={16} />
                {tab.name}
            </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in">
        {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="glass-card p-8 rounded-card border shadow-glow">
                        <h2 className="text-xl text-text-primary mb-6">Project Progress</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-4xl font-display font-black text-text-primary">{project.progress}%</p>
                                    <p className="text-xs text-text-muted uppercase font-bold tracking-widest mt-1">Total Completion</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-text-primary">{project.deadline}</p>
                                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">Estimated Deadline</p>
                                </div>
                            </div>
                            <div className="progress-bar-bg h-3">
                                <div 
                                    className="progress-bar-fill h-3 shadow-glow" 
                                    style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center">
                                <div>
                                    <p className="text-lg font-bold text-text-primary">12</p>
                                    <p className="text-[10px] text-text-muted uppercase">Completed Tasks</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-primary">4</p>
                                    <p className="text-[10px] text-text-muted uppercase">In Review</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-text-primary">8</p>
                                    <p className="text-[10px] text-text-muted uppercase">Remaining</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section className="glass-card p-8 rounded-card border shadow-glow">
                        <h2 className="text-xl text-text-primary mb-6">Tech Stack</h2>
                        <div className="flex flex-wrap gap-3">
                            {project.techStack.map(tech => (
                                <div key={tech} className="px-4 py-3 bg-surface border border-white/10 rounded-xl flex items-center gap-3 group hover:border-primary/50 transition-all">
                                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                        {tech.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-text-primary">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                
                <div className="space-y-8">
                    <section className="glass-card p-6 rounded-card border shadow-glow">
                        <h2 className="text-lg text-text-primary mb-4">Assigned PM</h2>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                            <img src={project.team.find(m => m.role.includes('PM'))?.avatar || 'https://i.pravatar.cc/150'} className="w-12 h-12 rounded-full ring-2 ring-primary/20" alt="" />
                            <div>
                                <p className="text-text-primary font-bold">{project.pm}</p>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Project Manager</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-primary/10 text-primary rounded-button font-bold text-xs uppercase tracking-widest hover:bg-primary/20 transition-all">
                            <MessageSquare size={16} />
                            Contact PM
                        </button>
                    </section>
                    
                    <section className="glass-card p-6 rounded-card border shadow-glow">
                        <h2 className="text-lg text-text-primary mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Issue Date</span>
                                <span className="text-text-primary font-medium">Jan 12, 2025</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Total Milestones</span>
                                <span className="text-text-primary font-medium">8</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Files Shared</span>
                                <span className="text-text-primary font-medium">24</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-text-muted">Support Tickets</span>
                                <span className="text-text-primary font-medium">1 Open</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )}

        {activeTab === 'Scope & Contract' && (
            <div className="space-y-6">
                <div className="glass-card p-8 rounded-card border shadow-glow">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl text-text-primary font-display flex items-center gap-2">
                                <Shield className="text-primary" size={24} />
                                Project Scope Lock (v{project.scope?.version || '1.0'})
                            </h2>
                            <p className="text-text-muted mt-2">Explicit definition of project deliverables and boundaries.</p>
                        </div>
                        {project.scope?.isApproved && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 text-success rounded-lg font-bold text-xs uppercase tracking-widest shrink-0">
                                <CheckCircle2 size={16} /> Client Approved ({project.scope?.approvedAt?.split('T')[0]})
                            </div>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div>
                            <h3 className="text-lg text-text-primary mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-success" size={20} />
                                Included in Scope
                            </h3>
                            <ul className="space-y-3">
                                {project.scope?.included?.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 p-3 bg-white/5 border border-white/5 rounded-xl text-sm text-text-primary">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                                        {item}
                                    </li>
                                )) || <p className="text-text-muted text-sm border-dashed border border-white/10 p-4 rounded-xl text-center">No explicit inclusions listed.</p>}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg text-text-primary mb-4 flex items-center gap-2">
                                <Info className="text-red-500" size={20} />
                                Excluded from Scope
                            </h3>
                            <ul className="space-y-3">
                                {project.scope?.excluded?.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl text-sm text-text-primary">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                        {item}
                                    </li>
                                )) || <p className="text-text-muted text-sm border-dashed border border-white/10 p-4 rounded-xl text-center">No exclusions listed.</p>}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-10 p-6 border border-primary/20 bg-primary/5 inset-0 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-text-primary font-bold mb-1">Scope Compliance Protection Act</h4>
                            <p className="text-xs text-text-muted">Any feature requests not explicitly listed under "Included" above will automatically trigger our Change Request workflow and may impact billing and timelines.</p>
                        </div>
                        <button className="btn-primary w-full sm:w-auto px-8 shrink-0">Accept Scope Agreement</button>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'Change Requests' && (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-linear-to-r from-surface to-background p-6 rounded-card border border-white/10 shadow-glow">
                    <div>
                        <h2 className="text-xl text-text-primary">Change Requests (CRs)</h2>
                        <p className="text-text-muted text-sm">Formal requests for work outside the approved boundary.</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2 shrink-0">
                        <PlusCircle size={18} /> Log New Request
                    </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {project.changeRequests?.map(cr => (
                        <div key={cr.id} className="glass-card p-6 rounded-xl border flex flex-col lg:flex-row justify-between gap-6 hover:bg-white/5 transition-all">
                            <div className="space-y-3 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-primary font-mono text-[10px] uppercase font-black tracking-widest bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">{cr.id}</span>
                                    <h3 className="text-lg text-text-primary font-bold">{cr.title}</h3>
                                </div>
                                <p className="text-sm text-text-muted">{cr.description}</p>
                                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest pt-2">
                                    <span className="text-text-primary/70 flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded"><Calendar size={12} className="text-primary" /> +{cr.timelineImpactDays} Days Delay</span>
                                    <span className="text-text-primary/70 flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded"><DollarSign size={12} className="text-green-500" /> ${cr.cost} Additional Cost</span>
                                    <span className="text-text-primary/70 flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded"><Clock size={12} /> Logged: {cr.submittedAt}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col justify-between items-end shrink-0 gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 min-w-[200px]">
                                <div className={`status-badge ${cr.status === 'Approved' ? 'status-green' : cr.status === 'Rejected' ? 'status-red' : 'status-amber'}`}>
                                    {cr.status}
                                </div>
                                {cr.status === 'Pending Review' && (
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-red-400/10 text-red-400 hover:bg-red-400/20 hover:text-red-300 transition-all rounded-button text-xs font-bold uppercase tracking-widest">Decline</button>
                                        <button className="btn-primary text-xs w-auto px-4 py-2">Approve Cost</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {!project.changeRequests?.length && (
                        <div className="p-12 text-center glass-card rounded-xl border-dashed">
                            <PlusCircle size={32} className="text-text-primary/20 mx-auto mb-4" />
                            <p className="text-text-primary font-medium">No Change Requests logged</p>
                            <p className="text-text-muted text-sm mt-1">This project is currently strictly adhering to its initial scope.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'Financials' && (
            <div className="space-y-8">
                {/* Budget Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="glass-card p-6 rounded-card border shadow-glow relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] text-text-primary group-hover:scale-110 transition-transform"><Wallet size={120} /></div>
                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-2 relative z-10">Total Budget</p>
                        <p className="text-4xl font-display font-black text-text-primary relative z-10">${project.financials?.totalBudget.toLocaleString() || '0'}</p>
                    </div>
                    <div className="glass-card p-6 rounded-card border-success/30 bg-success/5 shadow-[0_0_15px_rgba(34,197,94,0.05)] relative overflow-hidden group hover:border-success/50 transition-all">
                        <div className="absolute -top-4 -right-4 p-4 opacity-5 text-success group-hover:scale-110 transition-transform"><CheckCircle2 size={120} /></div>
                        <p className="text-[10px] text-success/70 uppercase font-bold tracking-widest mb-2 relative z-10">Total Paid Amount</p>
                        <p className="text-4xl font-display font-black text-success relative z-10">${project.financials?.paidAmount.toLocaleString() || '0'}</p>
                    </div>
                    <div className="glass-card p-6 rounded-card border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(99,102,241,0.05)] relative overflow-hidden group hover:border-primary/50 transition-all">
                        <div className="absolute -top-4 -right-4 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform"><DollarSign size={120} /></div>
                        <p className="text-[10px] text-primary/70 uppercase font-bold tracking-widest mb-2 relative z-10">Remaining Balance</p>
                        <p className="text-4xl font-display font-black text-primary relative z-10">${project.financials?.remainingBalance.toLocaleString() || '0'}</p>
                    </div>
                </div>

                {/* Milestones Billing */}
                <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                        <h2 className="text-xl text-text-primary flex items-center gap-3">
                            <div className="p-2 bg-primary/20 text-primary rounded-lg">
                                <DollarSign size={20} />
                            </div>
                            Milestone Payments
                        </h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {project.financials?.paymentMilestones.map((milestone, idx) => (
                            <div key={idx} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-white/5 transition-all">
                                <div>
                                    <h3 className="text-text-primary font-bold">{milestone.name}</h3>
                                    <p className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Shield size={12} className="text-primary"/> 
                                        Releases Milestone: {milestone.condition}
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 min-w-0 lg:min-w-[350px] justify-between">
                                    <div className="text-left sm:text-right">
                                        <p className="text-xl font-bold text-text-primary">${milestone.amount.toLocaleString()}</p>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Due: {milestone.dueDate}</p>
                                    </div>
                                    <div className={`status-badge shrink-0 ${milestone.status === 'Paid' ? 'status-green' : milestone.status === 'Overdue' ? 'status-red' : 'status-gray'}`}>
                                        {milestone.status}
                                    </div>
                                    {milestone.status === 'Pending' ? (
                                        <button className="btn-primary w-full sm:w-auto px-6 py-2.5 text-xs flex items-center justify-center gap-2 group shrink-0">
                                            Pay Securely 
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <div className="w-[140px] hidden sm:block"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'Milestones' && (
            <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                <div className="p-8 border-b border-white/5">
                    <h2 className="text-xl text-text-primary">Project Milestones</h2>
                    <p className="text-text-muted text-sm mt-1">Key objectives and completion status.</p>
                </div>
                <div className="divide-y divide-white/5">
                    {[
                        { name: 'Project Kickoff & Discovery', date: 'Jan 15', status: 'Completed', progress: 100 },
                        { name: 'UX/UI Design Phase', date: 'Feb 10', status: 'Completed', progress: 100 },
                        { name: 'Core Infrastructure Setup', date: 'Mar 01', status: 'Completed', progress: 100 },
                        { name: 'User Authentication & Profiles', date: 'Mar 15', status: 'In Progress', progress: 65 },
                        { name: 'Payment Gateway Integration', date: 'Apr 05', status: 'Pending', progress: 0 },
                        { name: 'Admin Dashboard API', date: 'Apr 20', status: 'Pending', progress: 0 },
                    ].map((milestone, idx) => (
                        <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/2 transition-all">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                    milestone.status === 'Completed' ? 'bg-success text-text-primary' :
                                    milestone.status === 'In Progress' ? 'bg-primary text-text-primary animate-pulse' : 'bg-white/10 text-text-muted'
                                }`}>
                                    {milestone.status === 'Completed' ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                                </div>
                                <div>
                                    <h3 className="text-text-primary font-bold leading-none">{milestone.name}</h3>
                                    <p className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} />
                                        Expected by {milestone.date}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-8 min-w-[200px]">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-text-muted mb-1.5">
                                        <span>Progress</span>
                                        <span>{milestone.progress}%</span>
                                    </div>
                                    <div className="progress-bar-bg">
                                        <div 
                                            className="progress-bar-fill" 
                                            style={{ width: `${milestone.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className={`status-badge shrink-0 ${
                                    milestone.status === 'Completed' ? 'status-green' :
                                    milestone.status === 'In Progress' ? 'status-cyan' : 'status-gray'
                                }`}>
                                    {milestone.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'Deliverables' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { name: 'Wireframes.fig', type: 'Figma', size: '1.2 MB', date: 'Jan 20, 2025' },
                    { name: 'DatabaseSchema.pdf', type: 'PDF', size: '450 KB', date: 'Feb 05, 2025' },
                    { name: 'Brand_Guidelines.zip', type: 'ZIP', size: '8.4 MB', date: 'Feb 12, 2025' },
                    { name: 'API_Documentation.html', type: 'HTML', size: '200 KB', date: 'Mar 10, 2025' },
                ].map((file, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-card border shadow-glow group hover:border-primary/30 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-primary group-hover:scale-110 transition-transform">
                                <FileText size={24} />
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="p-2 text-text-muted hover:text-text-primary transition-colors"><Eye size={18} /></button>
                                <button className="p-2 text-text-muted hover:text-primary transition-colors"><Download size={18} /></button>
                            </div>
                        </div>
                        <h3 className="text-text-primary font-bold mb-1 truncate" title={file.name}>{file.name}</h3>
                        <div className="flex justify-between items-center text-[10px] text-text-muted uppercase font-black tracking-widest mt-4">
                            <span>{file.type} • {file.size}</span>
                            <span>{file.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'Team' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.team.map((member, idx) => (
                    <div key={idx} className="glass-card p-6 rounded-card border shadow-glow flex items-center gap-6 group hover:bg-white/5 transition-all">
                        <div className="relative shrink-0">
                            <img src={member.avatar} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/5 group-hover:ring-primary/40 transition-all" alt="" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-surface shadow-glow"></div>
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-text-primary font-bold leading-none truncate">{member.name}</h3>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2">{member.role}</p>
                            <div className="flex items-center gap-3 mt-4 text-text-muted">
                                <button className="hover:text-text-primary transition-colors"><MessageSquare size={16} /></button>
                                <button className="hover:text-text-primary transition-colors"><Send size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        )}

        {activeTab === 'Messages' && (
            <div className="glass-card rounded-card border shadow-glow h-[600px] flex flex-col overflow-hidden relative">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/2">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                             {project.team.slice(0, 3).map((m, i) => (
                                 <img key={i} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-surface" alt="" />
                             ))}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-primary">Project Discussion</p>
                            <span className="text-[10px] text-success font-black uppercase tracking-widest">3 Team Members Online</span>
                        </div>
                    </div>
                    <button className="text-text-muted hover:text-text-primary transition-colors"><MoreVertical size={20} /></button>
                </div>
                
                {/* Messages Buffer */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex gap-4">
                        <img src="https://i.pravatar.cc/150?u=sarah" className="w-8 h-8 rounded-full mt-1 shrink-0" alt="" />
                        <div className="space-y-1 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-text-primary">Sarah Chen</span>
                                <span className="text-[10px] text-text-muted font-bold">10:45 AM</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-text-primary leading-relaxed">
                                Hi Wajiha! We've just uploaded the latest wireframes in the Deliverables tab. Please take a look and let us know your thoughts on the new navigation flow.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-row-reverse">
                        <img src="https://i.pravatar.cc/150?u=wajiha" className="w-8 h-8 rounded-full mt-1 shrink-0" alt="" />
                        <div className="space-y-1 max-w-[80%] text-right">
                            <div className="flex items-center justify-end gap-2">
                                <span className="text-[10px] text-text-muted font-bold">11:12 AM</span>
                                <span className="text-xs font-bold text-text-primary">You</span>
                            </div>
                            <div className="bg-primary/20 border border-primary/20 p-4 rounded-2xl rounded-tr-none text-sm text-text-primary leading-relaxed inline-block text-left">
                                Thanks Sarah! Checking them now. Will provide feedback by EOD.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <img src="https://i.pravatar.cc/150?u=alex" className="w-8 h-8 rounded-full mt-1 shrink-0" alt="" />
                        <div className="space-y-1 max-w-[80%]">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-text-primary">Alex Rivera</span>
                                <span className="text-[10px] text-text-muted font-bold">11:30 AM</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-text-primary leading-relaxed">
                                Great! Also, I've started the frontend scaffolding for the user profiles. It's coming along nicely.
                                <div className="mt-3 p-3 bg-black/40 rounded-lg font-mono text-[11px] text-primary border border-primary/20">
                                    git checkout -b feature/user-profiles
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Chat Input */}
                <div className="p-4 bg-white/2 border-t border-white/5">
                    <div className="glass-card border border-white/10 rounded-xl p-2 flex items-center gap-2">
                        <button className="p-2 text-text-muted hover:text-text-primary transition-colors"><Paperclip size={20} /></button>
                        <input 
                            type="text" 
                            placeholder="Type your message here..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary px-2 focus:ring-0"
                        />
                        <button className="p-2.5 bg-primary text-text-primary rounded-lg shadow-glow hover:scale-105 transition-all">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
