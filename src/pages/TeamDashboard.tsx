import React from 'react';
import { Briefcase, CheckSquare, Clock, ArrowUpRight } from 'lucide-react';

const TeamDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-4xl text-text-primary m-0 heading-gradient pb-1">Execution Hub</h1>
              <p className="text-text-muted text-sm mt-1">Hello Partner, let's ship some code 🚀</p>
          </div>
          <div className="flex items-center gap-3">
              <button className="btn-secondary text-sm">Submit Time</button>
              <button className="btn-primary flex items-center gap-2 group text-sm">
                  <span>Internal Note</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald">
                <CheckSquare size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">My Workspace</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">0 Tasks</h3>
            <p className="text-xs text-text-muted font-bold mt-2 relative z-10">Ready for allocation</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald">
                <Briefcase size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Active Client Projects</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">0</h3>
            <p className="text-xs text-text-muted font-bold mt-2 relative z-10">No active assignments</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald">
                <Clock size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Deadlines This Week</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">0</h3>
            <p className="text-xs text-text-muted font-bold mt-2 relative z-10">All clear</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-card border shadow-glow">
            <h2 className="text-xl text-text-primary font-display font-bold mb-6">High Priority Tasks</h2>
            <div className="space-y-4">
                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                    <CheckSquare size={48} className="mx-auto mb-4 opacity-10 text-primary" />
                    <p className="text-sm text-text-muted uppercase tracking-widest font-bold">No High Priority Tasks Assigned</p>
                </div>
            </div>
        </div>

        <div className="glass-card p-6 rounded-card border shadow-glow border-red-500/20 bg-red-500/5">
            <h2 className="text-xl text-text-primary font-display font-bold mb-6">Recent Internal Notes</h2>
            <div className="space-y-4">
                <div className="text-center py-20 border border-dashed border-red-500/20 rounded-xl">
                    <p className="text-sm text-red-500/50 uppercase tracking-widest font-bold font-sans">Internal Feed Offline</p>
                    <p className="text-[10px] text-red-500/30 mt-2 uppercase tracking-[0.2em] font-black">Waiting for project initiation</p>
                </div>
                <p className="text-xs text-text-muted italic mt-4">⚠️ These notes are strictly hidden from clients.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
