import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Search, 
  Download, 
  Eye, 
  Grid, 
  List as ListIcon,
  MoreVertical,
  Plus,
  ArrowUpRight
} from 'lucide-react';

const DocumentsPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const folders = [
        { name: 'E-Commerce Platform', files: 12, size: '45 MB' },
        { name: 'CRM System', files: 8, size: '12 MB' },
        { name: 'Mobile App MVP', files: 15, size: '89 MB' },
    ];

    const recentFiles = [
        { name: 'Project_Proposal_v2.pdf', type: 'PDF', size: '2.4 MB', date: '2 hours ago', project: 'E-Commerce' },
        { name: 'UI_Kit_Final.fig', type: 'Figma', size: '15.8 MB', date: '5 hours ago', project: 'Mobile App' },
        { name: 'Database_Schema.png', type: 'Image', size: '800 KB', date: '1 day ago', project: 'CRM System' },
        { name: 'Meeting_Notes_April.docx', type: 'Word', size: '150 KB', date: '2 days ago', project: 'E-Commerce' },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0">Documents & Files</h1>
                    <p className="text-text-muted text-sm mt-1">Central repository for all project assets and deliverables.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search files..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2 group text-sm shrink-0">
                        <Plus size={16} />
                        <span>Upload File</span>
                    </button>
                </div>
            </div>

            {/* Folders Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl text-text-primary">Project Folders</h2>
                    <button className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {folders.map(folder => (
                        <div key={folder.name} className="glass-card p-6 rounded-card border border-white/5 group hover:border-primary/30 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform shadow-glow">
                                    <Folder size={24} />
                                </div>
                                <button className="text-text-muted hover:text-text-primary transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                            <h3 className="text-text-primary font-bold mb-1">{folder.name}</h3>
                            <div className="flex justify-between items-center text-[10px] text-text-muted font-black uppercase tracking-widest mt-2">
                                <span>{folder.files} Files</span>
                                <span>{folder.size}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Files Table/Grid */}
            <div className="space-y-4 mt-12">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl text-text-primary">Recent Files</h2>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentFiles.map(file => (
                            <div key={file.name} className="glass-card p-5 rounded-card border border-white/5 group hover:border-white/10 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-primary group-hover:bg-primary/10 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-text-muted hover:text-text-primary transition-colors"><Eye size={16} /></button>
                                        <button className="p-1.5 text-text-muted hover:text-primary transition-colors"><Download size={16} /></button>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-text-primary truncate mb-1" title={file.name}>{file.name}</h3>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{file.project}</p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[9px] text-text-muted font-black uppercase tracking-tighter">{file.type} • {file.size}</span>
                                    <span className="text-[9px] text-text-muted italic">{file.date}</span>
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
                                        <th className="px-6 py-4">Filename</th>
                                        <th className="px-6 py-4">Project</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Size</th>
                                        <th className="px-6 py-4">Uploaded</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentFiles.map(file => (
                                        <tr key={file.name} className="hover:bg-white/2 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={18} className="text-primary" />
                                                    <span className="text-sm font-bold text-text-primary">{file.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-muted">{file.project}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-text-muted font-bold">{file.type}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-text-muted">{file.size}</td>
                                            <td className="px-6 py-4 text-sm text-text-muted italic">{file.date}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-text-muted hover:text-text-primary"><Eye size={16} /></button>
                                                    <button className="p-2 text-text-muted hover:text-primary"><Download size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Drag & Drop Zone */}
            <div className="mt-12 p-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/2 flex flex-col items-center justify-center text-center group hover:border-primary/40 hover:bg-primary/2 transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-text-muted mb-4 group-hover:scale-110 group-hover:text-primary transition-all">
                    <ArrowUpRight size={32} />
                </div>
                <h3 className="text-xl text-text-primary font-bold">Upload new files</h3>
                <p className="text-text-muted text-sm mt-1">Drag and drop your project assets here, or click to browse.</p>
                <div className="mt-6 flex gap-3">
                    <span className="text-[10px] text-text-muted font-black border border-white/10 px-2 py-1 rounded">PDF</span>
                    <span className="text-[10px] text-text-muted font-black border border-white/10 px-2 py-1 rounded">ZIP</span>
                    <span className="text-[10px] text-text-muted font-black border border-white/10 px-2 py-1 rounded">FIGMA</span>
                    <span className="text-[10px] text-text-muted font-black border border-white/10 px-2 py-1 rounded">DOCX</span>
                </div>
            </div>
        </div>
    );
};

export default DocumentsPage;
