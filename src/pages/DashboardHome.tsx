import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  Receipt, 
  Ticket, 
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  projects, 
  invoices, 
  tickets, 
  activityFeed 
} from '../data/mockData';


const StatCard = ({ title, value, icon: Icon, trend, color, subtitle, to }: { title: string, value: string, icon: any, trend?: string, color: string, subtitle?: string, to: string }) => {
  return (
    <Link to={to} className="block glass-card p-6 rounded-card border shadow-glow transition-all hover:border-white/10 group cursor-pointer hover:-translate-y-1 hover:bg-white/5">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100 shadow-inner group-hover:scale-105 transition-transform`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-0.5 rounded-full">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-text-muted text-[10px] font-semibold uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mt-2 leading-none font-body tracking-tight">{value}</h3>
        {subtitle && <p className="text-[10px] text-text-muted mt-2 font-medium line-clamp-1">{subtitle}</p>}
      </div>
    </Link>
  );
};

const DashboardHome: React.FC = () => {
    // Stat calculations
    const activeProjectsCount = projects.filter(p => p.status !== 'Completed').length;
    const pendingDeliverables = 4; // Mock
    const unpaidInvoices = invoices.filter(i => i.status === 'Unpaid' || i.status === 'Overdue');
    const totalUnpaidAmount = unpaidInvoices.reduce((acc, i) => acc + i.amount, 0);
    const openTicketsCount = tickets.filter(t => t.status === 'Open').length;

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl m-0 heading-gradient pb-1">Good morning, Wajiha 👋</h1>
                    <p className="text-text-muted text-sm mt-1">Saturday, April 4, 2026</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary flex items-center gap-2 group text-sm">
                        View Invoices
                    </button>
                    <button className="btn-primary flex items-center gap-2 group text-sm">
                        <span>+ New Request</span>
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Active Projects" 
                    value={activeProjectsCount.toString()} 
                    icon={Briefcase} 
                    trend="+12%" 
                    color="bg-primary"
                    subtitle="3 ongoing, 1 on hold"
                    to="/projects"
                />
                <StatCard 
                    title="Deliverables" 
                    value={pendingDeliverables.toString()} 
                    icon={Clock} 
                    color="bg-blue-500"
                    subtitle="Next: 'User Dashboard API' due in 2d"
                    to="/documents"
                />
                <StatCard 
                    title="Unpaid Balance" 
                    value={`$${totalUnpaidAmount.toLocaleString()}`} 
                    icon={Receipt} 
                    color="bg-amber-500"
                    subtitle={`${unpaidInvoices.length} invoices pending payment`}
                    to="/invoices"
                />
                <StatCard 
                    title="Support Tickets" 
                    value={openTicketsCount.toString()} 
                    icon={Ticket} 
                    color="bg-red-500"
                    subtitle="1 high priority ticket needs attention"
                    to="/support"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Projects Table/List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl text-text-primary leading-none">Active Projects</h2>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All Projects</button>
                    </div>

                    <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/5 uppercase text-[10px] text-text-muted font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Project Name</th>
                                        <th className="px-6 py-4 text-center">Progress</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Deadline</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {projects.slice(0, 3).map(project => (
                                        <tr key={project.id} className="hover:bg-white/2 transition-colors group cursor-pointer">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                        {project.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary leading-none whitespace-nowrap">{project.name}</p>
                                                        <span className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-tighter whitespace-nowrap">{project.type}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 min-w-[150px]">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                                                        <span>{project.progress}% completed</span>
                                                    </div>
                                                    <div className="progress-bar-bg w-full">
                                                        <div 
                                                            className="progress-bar-fill shadow-glow" 
                                                            style={{ width: `${project.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`status-badge flex items-center gap-1.5 w-fit ${
                                                    project.status === 'In Progress' ? 'status-cyan' :
                                                    project.status === 'Completed' ? 'status-green' :
                                                    project.status === 'Blocked' ? 'status-red' :
                                                    project.status === 'Review' ? 'status-amber' : 'status-gray'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        project.status === 'In Progress' ? 'bg-primary' :
                                                        project.status === 'Completed' ? 'bg-success' :
                                                        project.status === 'Blocked' ? 'bg-danger' :
                                                        project.status === 'Review' ? 'bg-warning' : 'bg-text-muted'
                                                    } ${project.status === 'In Progress' ? 'animate-pulse shadow-glow' : ''}`}></span>
                                                    {project.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-text-muted">
                                                {project.deadline}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-1 hover:text-text-primary text-text-muted transition-colors"><MoreVertical size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Upcoming Milestones */}
                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl text-text-primary px-2">Upcoming Milestones</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass-card p-5 rounded-card border shadow-glow border-primary/20 bg-primary/5 group transition-all hover:bg-primary/10">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary">Project Kickoff & Discovery</p>
                                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-0.5">E-Commerce Platform</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">In 2 Days</span>
                                </div>
                            </div>
                            <div className="glass-card p-5 rounded-card border shadow-glow group hover:bg-white/5 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-text-muted group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary opacity-70">Design Phase Approval</p>
                                            <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-0.5 line-through">Mobile App MVP</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded uppercase">Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl text-text-primary px-2 leading-none">Recent Activity</h2>
                    <div className="glass-card rounded-card border shadow-glow relative h-[calc(100%-48px)]">
                        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60"></div>
                        <div className="p-6 space-y-8 relative z-10">
                            {activityFeed.map((activity) => (
                                <div key={activity.id} className="flex gap-4 group">
                                    <div className={`w-4 h-4 rounded-full mt-1 border-4 border-surface ring-2 shadow-glow shrink-0 z-10 transition-transform group-hover:scale-125 ${
                                        activity.type === 'file' ? 'bg-primary ring-primary/20' :
                                        activity.type === 'invoice' ? 'bg-amber-500 ring-amber-500/20' :
                                        activity.type === 'message' ? 'bg-violet-500 ring-violet-500/20' : 'bg-blue-500 ring-blue-500/20'
                                    }`}></div>
                                    <div>
                                        <p className="text-sm text-text-primary font-medium leading-relaxed group-hover:text-primary transition-colors">{activity.text}</p>
                                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1 block">{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="flex gap-4 group">
                                <div className="w-4 h-4 rounded-full mt-1 border-4 border-surface ring-2 shadow-glow bg-red-500 ring-red-500/20 shrink-0 z-10"></div>
                                <div>
                                    <p className="text-sm font-medium text-text-primary group-hover:text-red-400 transition-colors">Critical bug reported on mobile app login.</p>
                                    <span className="text-[10px] text-text-muted font-bold tracking-widest mt-1 block uppercase">3 days ago</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t border-white/5 mt-auto">
                            <button className="w-full text-center text-xs font-bold text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest">
                                Load more activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
