import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  PieChart, 
  Activity, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { projects } from '../data/mockData';

const ProjectAnalysisPage: React.FC = () => {
    const totalProjects = projects.length;
    const blockedProjects = projects.filter(p => p.status === 'Blocked').length;

    return (
        <div className="space-y-8 pb-20 animate-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 heading-gradient">Project Intelligence</h1>
                    <p className="text-text-muted text-sm mt-1">Deep analysis of project health, financial efficiency, and delivery velocity.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary flex items-center gap-2 group text-xs">
                        <TrendingUp size={16} className="text-emerald"/> <span>Growth Report</span>
                    </button>
                    <button className="btn-primary text-xs py-2 px-6">Generate Analysis</button>
                </div>
            </div>

            {/* Strategic KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-card border shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><BarChart3 size={120} /></div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 relative z-10">Portfolio Progress</p>
                    <h3 className="text-3xl font-display font-black text-text-primary relative z-10">
                        {Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)}%
                    </h3>
                </div>
                <div className="glass-card p-6 rounded-card border-emerald/30 bg-emerald/5 shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] text-emerald group-hover:scale-110 transition-transform"><CheckCircle2 size={120} /></div>
                    <p className="text-[10px] text-emerald/70 uppercase font-bold tracking-widest mb-1 relative z-10">Delivery Velocity</p>
                    <h3 className="text-3xl font-display font-black text-emerald relative z-10">Fast</h3>
                    <p className="text-[10px] uppercase font-black text-emerald/50 mt-1">Ahead of Schedule</p>
                </div>
                <div className="glass-card p-6 rounded-card border-amber-500/30 bg-amber-500/5 shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] text-amber-500 group-hover:scale-110 transition-transform"><AlertTriangle size={120} /></div>
                    <p className="text-[10px] text-amber-500/70 uppercase font-bold tracking-widest mb-1 relative z-10">Attention Required</p>
                    <h3 className="text-3xl font-display font-black text-amber-500 relative z-10">{blockedProjects}</h3>
                    <p className="text-[10px] uppercase font-black text-amber-500/50 mt-1">Blocked Resources</p>
                </div>
                <div className="glass-card p-6 rounded-card border shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><PieChart size={120} /></div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 relative z-10">Resource Utilization</p>
                    <h3 className="text-3xl font-display font-black text-text-primary relative z-10">84%</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Delivery Analysis Table */}
                <div className="lg:col-span-2 glass-card rounded-card border shadow-glow overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 bg-white/2 flex justify-between items-center">
                        <h2 className="text-lg text-text-primary font-bold flex items-center gap-2">
                             <Activity size={20} className="text-primary" /> Delivery Stream Analysis
                        </h2>
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Global Overview</span>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/1 uppercase text-[10px] text-text-muted font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Project Entity</th>
                                    <th className="px-6 py-4">Market Segment</th>
                                    <th className="px-6 py-4 text-center">Efficiency</th>
                                    <th className="px-6 py-4 text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map(project => (
                                    <tr key={project.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {project.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-text-primary whitespace-nowrap">{project.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs text-text-muted uppercase font-black tracking-widest bg-white/5 px-2 py-1 rounded inline-block">
                                                {project.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-[80px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-primary shadow-glow transition-all duration-1000" 
                                                        style={{ width: `${project.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-text-primary">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {project.progress > 50 ? (
                                                <TrendingUp size={16} className="ml-auto text-emerald drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                            ) : (
                                                <TrendingDown size={16} className="ml-auto text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Financial Health & Insights */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-card border shadow-glow">
                        <h2 className="text-lg text-text-primary font-bold mb-6 flex items-center gap-2">
                             <DollarSign size={20} className="text-amber-400" /> Financial Liquidity
                        </h2>
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-2">Total Contract Value</p>
                                <div className="flex items-end gap-2">
                                    <h3 className="text-2xl font-display font-bold text-text-primary">$482,000</h3>
                                    <span className="text-xs text-emerald font-bold pb-1">+12.4%</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-2">Average Project Return</p>
                                <div className="flex items-end gap-2">
                                    <h3 className="text-2xl font-display font-bold text-text-primary">$34,500</h3>
                                    <span className="text-xs text-emerald font-bold pb-1">+4.2%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-card border border-primary/20 bg-primary/5 shadow-glow">
                        <h2 className="text-lg text-text-primary font-bold mb-4 flex items-center gap-2">
                             <Clock size={20} className="text-primary" /> Delivery Velocity
                        </h2>
                        <p className="text-xs text-text-muted leading-relaxed mb-6">
                            Project completion cycle has decreased by <span className="text-text-primary font-bold">14 days</span> on average compared to Q3 2024.
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <TrendingUp size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                     <div className="h-full w-3/4 bg-primary shadow-glow"></div>
                                </div>
                                <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-2">Optimal Efficiency Reach</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalysisPage;
