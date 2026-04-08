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
            <h3 className="text-3xl font-black text-text-primary relative z-10">12 Tasks</h3>
            <p className="text-xs text-red-400 font-bold mt-2 relative z-10">3 High Priority</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald">
                <Briefcase size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Active Client Projects</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">5</h3>
            <p className="text-xs text-emerald font-bold mt-2 relative z-10">All on schedule</p>
          </div>

          <div className="glass-card p-6 rounded-card border shadow-glow relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald">
                <Clock size={80} />
            </div>
            <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 relative z-10">Deadlines This Week</p>
            <h3 className="text-3xl font-black text-text-primary relative z-10">4</h3>
            <p className="text-xs text-text-muted font-bold mt-2 relative z-10">Next: API Integration (Tomorrow)</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-card border shadow-glow">
            <h2 className="text-xl text-text-primary font-display font-bold mb-6">High Priority Tasks</h2>
            <div className="space-y-4">
                {[
                    { task: 'Fix critical auth vulnerability', project: 'LogistiX Mobile App', code: 'LOG-120' },
                    { task: 'Finalize payment gateway Webhooks', project: 'E-Commerce Core', code: 'ECO-44' },
                    { task: 'Review new SLA documents sent by Wajiha', project: 'Internal', code: 'INT-09' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-text-primary group-hover:text-red-400 transition-colors">{item.task}</p>
                            <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded text-text-muted">{item.code}</span>
                        </div>
                        <p className="text-xs text-text-muted uppercase tracking-widest font-bold">{item.project}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="glass-card p-6 rounded-card border shadow-glow border-red-500/20 bg-red-500/5">
            <h2 className="text-xl text-text-primary font-display font-bold mb-6">Recent Internal Notes</h2>
            <div className="space-y-4">
                {[
                    { text: 'Client requested changing the entire color scheme again. Need to push back or charge more.', author: 'Admin' },
                    { text: 'AWS server migration scheduled for Friday at 2am.', author: 'Partner Dev' }
                ].map((act, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl bg-background/50 border border-red-500/20">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0"></div>
                        <div>
                            <p className="text-sm font-medium text-text-primary opacity-90">{act.text}</p>
                            <p className="text-[10px] text-red-500/80 mt-1 uppercase tracking-widest font-bold">{act.author}</p>
                        </div>
                    </div>
                ))}
                <p className="text-xs text-text-muted italic mt-4">⚠️ These notes are strictly hidden from clients.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
