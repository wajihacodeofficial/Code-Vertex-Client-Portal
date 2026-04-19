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
import { useAuth } from '../context/AuthContext';


const StatCard = ({ title, value, icon: Icon, trend, color, subtitle, to }: { title: string, value: string, icon: React.ElementType, trend?: string, color: string, subtitle?: string, to: string }) => {
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
    const { user, projects, invoices, tickets } = useAuth();
    
    // Stat calculations
    const activeProjectsCount = projects?.filter((p: any) => p.status !== 'Completed').length || 0;
    const pendingDeliverables = projects?.length || 0; // Fallback for now
    const unpaidInvoices = invoices?.filter((i: any) => i.status === 'Unpaid' || i.status === 'Overdue') || [];
    const totalUnpaidAmount = unpaidInvoices.reduce((acc: number, i: any) => acc + (i.amount || 0), 0);
    const openTicketsCount = tickets?.filter((t: any) => t.status === 'Open').length || 0;

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl m-0 heading-gradient pb-1 text-text-primary uppercase tracking-tighter">Welcome back, {user?.name || 'Client'} 👋</h1>
                    <p className="text-text-muted text-sm mt-1 uppercase tracking-widest font-bold">Portal Live Status • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/invoices" className="btn-secondary flex items-center gap-2 group text-sm">
                        View Invoices
                    </Link>
                    <Link to="/support" className="btn-primary flex items-center gap-2 group text-sm">
                        <span>+ New Request</span>
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Active Projects" 
                    value={activeProjectsCount.toString()} 
                    icon={Briefcase} 
                    trend="+Live" 
                    color="bg-primary"
                    subtitle={`${activeProjectsCount} ongoing operations`}
                    to="/projects"
                />
                <StatCard 
                    title="Project Depth" 
                    value={pendingDeliverables.toString()} 
                    icon={Clock} 
                    color="bg-blue-500"
                    subtitle="Tracked development phases"
                    to="/projects"
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
                    subtitle="Open support requests"
                    to="/support"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Projects Table/List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xl text-text-primary leading-none uppercase tracking-widest font-black">Active Projects</h2>
                        <Link to="/projects" className="text-xs font-bold uppercase tracking-widest hover:underline text-primary">View All Projects</Link>
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
                                    {projects?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-text-muted text-sm uppercase tracking-widest font-bold">No active projects found in your dashboard.</td>
                                        </tr>
                                    ) : projects?.slice(0, 3).map((project: any) => (
                                        <tr key={project.id} className="hover:bg-white/2 transition-colors group cursor-pointer">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                                                        {project.name?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-text-primary leading-none whitespace-nowrap">{project.name}</p>
                                                        <span className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-tighter whitespace-nowrap">{project.type || 'Custom Work'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 min-w-[150px]">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                                                        <span>{project.progress || 0}% completed</span>
                                                    </div>
                                                    <div className="progress-bar-bg w-full">
                                                        <div 
                                                            className="progress-bar-fill shadow-glow" 
                                                            style={{ width: `${project.progress || 0}%` }}
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
                                                    {project.status || 'Planned'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-text-muted">
                                                {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
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
                        <h2 className="text-xl text-text-primary px-2 uppercase tracking-widest font-bold">Upcoming Milestones</h2>
                        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/2">
                            <Calendar size={32} className="mx-auto mb-3 opacity-10" />
                            <p className="text-xs text-text-muted uppercase tracking-widest font-bold">No upcoming milestones scheduled</p>
                        </div>
                    </div>
                </div>

                {/* Activity Feed Sidebar */}
                <div className="space-y-6">
                    <h2 className="text-xl text-text-primary px-2 leading-none uppercase tracking-widest font-bold">Recent Updates</h2>
                    <div className="glass-card rounded-card border shadow-glow relative h-[calc(100%-48px)] bg-white/2">
                        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60"></div>
                        <div className="p-6 space-y-8 relative z-10">
                            {tickets?.slice(0, 3).map((ticket: any) => (
                                <div key={ticket.id} className="flex gap-4 group">
                                    <div className={`w-4 h-4 rounded-full mt-1 border-4 border-surface ring-2 shadow-glow shrink-0 z-10 transition-transform group-hover:scale-125 ${
                                        ticket.priority === 'High' ? 'bg-red-500 ring-red-500/20' :
                                        ticket.priority === 'Medium' ? 'bg-amber-500 ring-amber-500/20' : 'bg-primary ring-primary/20'
                                    }`}></div>
                                    <div>
                                        <p className="text-sm text-text-primary font-medium leading-relaxed group-hover:text-primary transition-colors">{ticket.subject}</p>
                                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1 block">TICKET #{ticket.id.slice(0, 8)} • REAL-TIME SYNC</span>
                                    </div>
                                </div>
                            ))}
                            
                            {tickets?.length === 0 && (
                                <div className="text-center py-10 text-text-muted text-xs uppercase tracking-widest">No recent alerts or activity.</div>
                            )}
                        </div>
                        
                        <div className="p-6 border-t border-white/5 mt-auto bg-white/2">
                            <Link to="/support" className="block w-full text-center text-xs font-bold text-text-muted hover:text-text-primary transition-colors uppercase tracking-widest">
                                Go to Support Center
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
