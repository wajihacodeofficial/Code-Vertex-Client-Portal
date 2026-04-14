import React from 'react';
import { Users, Briefcase, Activity, DollarSign, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { allUsers, approveUser, rejectUser, adminStats, tickets } = useAuth();
  const pendingUsers = allUsers?.filter(u => u.status === 'pending') || [];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-4xl text-text-primary m-0 heading-gradient pb-1">Overview</h1>
              <p className="text-text-muted text-sm mt-1">Administrative Control Center</p>
          </div>
          <div className="flex items-center gap-3">
              <button className="btn-secondary text-sm">Download Report</button>
              <Link 
                  to="/admin/clients"
                  className="btn-primary flex items-center gap-2 group text-sm"
              >
                  <span>New Client</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
          </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-card border border-amber-500/20 shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Total Revenue</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">
                {adminStats ? `$${adminStats.totalRevenue.toLocaleString()}` : '$0'}
            </h3>
            <p className="text-xs text-emerald font-bold mt-2 relative z-10">{adminStats?.totalRevenue ? '+14% this month' : 'No data'}</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Active Projects</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">
                {adminStats?.activeProjects || 0}
            </h3>
            <p className="text-xs text-emerald font-bold mt-2 relative z-10">Live operations</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Active Clients</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">
                {adminStats?.activeClients || 0}
            </h3>
            <p className="text-xs text-text-muted font-bold mt-2 relative z-10">Approved partners</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">System Health</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">99.9%</h3>
            <p className="text-xs text-text-muted font-bold mt-2 relative z-10">All systems normal</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Account Approvals */}
        <div className="glass-card p-6 rounded-card border border-amber-500/20 shadow-glow">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl text-text-primary font-display font-bold">Pending Approvals</h2>
                    <p className="text-sm text-text-muted mt-1">Internal account registration requests</p>
                </div>
                {pendingUsers.length > 0 && (
                    <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-3 py-1 rounded-lg border border-amber-500/30 animate-pulse">{pendingUsers.length} Pending</span>
                )}
            </div>
            <div className="space-y-4">
                {pendingUsers.length === 0 ? (
                    <div className="text-center p-8 border border-dashed border-white/10 rounded-xl text-text-muted bg-white/2">
                        <CheckCircle size={32} className="mx-auto mb-3 opacity-20" />
                        No pending internal account requests.
                    </div>
                ) : (
                    pendingUsers.map(user => (
                        <div key={user.id} className="p-4 rounded-xl bg-surface border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/30 transition-all">
                            <div>
                                <p className="text-text-primary font-bold">{user.name}</p>
                                <p className="text-xs text-text-muted">{user.email}</p>
                                <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-2 bg-primary/10 inline-block px-2 py-1 rounded">
                                    Requested Role: {user.role}
                                </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={() => rejectUser(user.id)} 
                                    className="flex-1 sm:flex-none px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-button transition-colors text-xs font-bold uppercase tracking-widest text-center"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => approveUser(user.id)} 
                                    className="btn-primary flex-1 sm:flex-none px-6 py-2 text-xs"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="glass-card p-6 rounded-card border shadow-glow">
            <h2 className="text-xl text-text-primary font-display font-bold mb-6">Recent System Activity</h2>
            <div className="space-y-4">
                {tickets?.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className={`w-2 h-2 mt-1.5 rounded-full shadow-glow shrink-0 ${ticket.priority === 'High' ? 'bg-red-500' : 'bg-primary'}`}></div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-1">{ticket.subject}</p>
                            <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold">New Ticket • {ticket.status}</p>
                        </div>
                    </div>
                ))}
                {tickets?.length === 0 && (
                    <div className="text-center py-8 text-text-muted text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
                        No recent activity recorded.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
