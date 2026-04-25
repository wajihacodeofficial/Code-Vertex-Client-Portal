import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List as ListIcon, 
  Calendar, 
  ExternalLink,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal';
import dayjs from 'dayjs';

const ProjectsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, projects, deleteProject } = useAuth();

  const filteredProjects = (projects || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl text-text-primary m-0">Your Projects</h1>
          <p className="text-text-muted text-sm mt-1">Track and manage your development projects with Code Vertex.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                <Search size={18} className="text-text-muted" />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                />
            </div>
            
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1 shrink-0">
                <button 
                    onClick={() => setViewMode('card')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'card' ? 'bg-primary text-text-primary shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
                >
                    <Grid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-primary text-text-primary shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
                >
                    <ListIcon size={18} />
                </button>
            </div>
            
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary flex items-center gap-2 group text-sm shrink-0"
            >
                <span>{user?.role === 'client' ? '+ New Request' : '+ Create Project'}</span>
            </button>
        </div>
      </div>
      
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Tabs / Filters */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {['All', 'In Progress', 'Review', 'Completed', 'On Hold', 'Blocked'].map(tab => (
            <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${
                    activeTab === tab 
                        ? 'bg-primary/10 border-primary/30 text-primary shadow-glow' 
                        : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10 hover:text-text-primary'
                }`}
            >
                {tab}
            </button>
        ))}
        <div className="ml-auto flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors text-text-muted">
            <Filter size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">More Filters</span>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
                <div key={project.id} className="glass-card rounded-card border shadow-glow transition-transform hover:-translate-y-1 group">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold shadow-inner group-hover:scale-110 transition-transform">
                                {project.name.charAt(0)}
                            </div>
                            <div className={`status-badge ${
                                project.status === 'In Progress' ? 'status-cyan' :
                                project.status === 'Completed' ? 'status-green' :
                                project.status === 'Blocked' ? 'status-red' :
                                project.status === 'Review' ? 'status-amber' : 'status-gray'
                            }`}>
                                {project.status}
                            </div>
                        </div>

                        <Link to={`/projects/${project.id}`}>
                            <h3 className="text-xl text-text-primary group-hover:text-primary transition-colors">{project.name}</h3>
                        </Link>
                        <p className="text-text-muted text-sm mt-3 line-clamp-2 leading-relaxed">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-6">
                            {(project.tech_stack || project.techStack || []).map((tag: string) => (
                                <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex -space-x-2">
                            {(project.team || []).map((member: any, idx: number) => (
                                <img 
                                    key={idx}
                                    src={member.avatar || `https://i.pravatar.cc/150?u=${idx}`} 
                                    alt={member.name} 
                                    className="w-8 h-8 rounded-full border-2 border-surface" 
                                    title={`${member.name} - ${member.role}`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-text-muted">
                            <Calendar size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{dayjs(project.deadline).format('MMM DD, YYYY')}</span>
                        </div>
                    </div>

                    <div className="p-1 px-6 pb-6">
                        <div className="flex justify-between items-center text-[10px] text-text-muted font-bold uppercase mb-2">
                            <span>Progress</span>
                            <span>{project.progress || 0}%</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div 
                                className="progress-bar-fill shadow-glow" 
                                style={{ width: `${project.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="glass-card rounded-card border shadow-glow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/5 uppercase text-[10px] text-text-muted font-black tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Project</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Progress</th>
                            <th className="px-6 py-4">Deadline</th>
                            <th className="px-6 py-4">Team</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProjects.map(project => (
                            <tr key={project.id} className="hover:bg-white/2 transition-colors group cursor-pointer">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-surface border border-white/10 flex items-center justify-center text-primary font-bold group-hover:scale-105 transition-transform shrink-0">
                                            {project.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary leading-none whitespace-nowrap">{project.name}</p>
                                            <span className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-tighter">{project.type}</span>
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
                                        }`}></span>
                                        {project.status}
                                    </div>
                                </td>
                                <td className="px-6 py-5 min-w-[150px]">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-text-muted">
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="progress-bar-bg max-w-[120px]">
                                            <div 
                                                className="progress-bar-fill shadow-glow" 
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm font-medium text-text-muted whitespace-nowrap">
                                    {project.deadline}
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex -space-x-1.5">
                                        {(project.team || []).slice(0, 3).map((member: any, idx: number) => (
                                            <img key={idx} src={member.avatar} className="w-7 h-7 rounded-full border border-surface" alt="" />
                                        ))}
                                        {(project.team?.length || 0) > 3 && (
                                            <div className="w-7 h-7 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] text-text-muted font-bold">
                                                +{(project.team?.length || 0) - 3}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link to={`/projects/${project.id}`} className="p-2 text-text-muted hover:text-text-primary transition-colors">
                                            <ExternalLink size={18} />
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <button 
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this project?')) {
                                                        deleteProject(project.id);
                                                    }
                                                }}
                                                className="p-2 text-text-muted hover:text-red-500 transition-colors"
                                                title="Delete Project"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-2 pt-6 border-t border-white/5">
        <p className="text-xs text-text-muted">Showing <strong>{filteredProjects.length}</strong> project results</p>
        <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded text-xs font-bold text-text-muted cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-primary/20 border border-primary/50 text-primary rounded text-xs font-bold">1</button>
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded text-xs font-bold text-text-muted hover:text-text-primary transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
