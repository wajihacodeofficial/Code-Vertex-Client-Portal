import React, { useState } from 'react';
import { Search, Plus, Trash2, Calendar, Lock } from 'lucide-react';
import { Footer } from '../components/Footer';

const PrivateNotesPage: React.FC = () => {
    const [notes] = useState([
        { id: 1, title: 'Project X Requirements', content: 'Met with client today. They want the checkout flow to be ultra-fast.', date: 'Apr 4, 2026', tag: 'High' },
        { id: 2, title: 'Feedback on v1.2', content: 'The overall theme is good but the buttons need more contrast.', date: 'Apr 2, 2026', tag: 'Design' }
    ]);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 flex items-center gap-3">
                        <Lock size={28} className="text-primary" /> Private Notes
                    </h1>
                    <p className="text-text-muted text-sm mt-1">Internal-only team discussions and developer scratchpads.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-3 grow lg:grow-0">
                        <Search size={18} className="text-text-muted" />
                        <input 
                            type="text" 
                            placeholder="Search notes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-text-primary px-3 py-2.5 w-full focus:ring-0"
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2 group text-sm shrink-0">
                        <Plus size={16} />
                        <span>New Note</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => (
                    <div key={note.id} className="glass-card p-6 rounded-card border border-white/5 relative group hover:scale-[1.02] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-black uppercase tracking-widest">{note.tag}</span>
                            <button className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                        </div>
                        <h3 className="text-lg text-text-primary font-bold mb-3">{note.title}</h3>
                        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-6">{note.content}</p>
                        <div className="flex items-center gap-2 mt-auto text-[10px] text-text-muted font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                            <Calendar size={12} /> {note.date}
                        </div>
                    </div>
                ))}
                <button className="glass-card rounded-card border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-8 group hover:border-primary/50 transition-all text-text-muted hover:text-primary">
                    <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Create Scratchpad</span>
                </button>
            </div>

            <Footer />
        </div>
    );
};

export default PrivateNotesPage;
