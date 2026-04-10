import React, { useState } from 'react';
import { X, Calendar, User, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { useAuth, type User as UserType } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../lib/api';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
    const { allUsers, fetchProjects } = useAuth();
    const clients = allUsers.filter((u: UserType) => u.role === 'client');
    const [step, setStep] = useState(1);
    const [projectName, setProjectName] = useState('');
    const [selectedClient, setSelectedClient] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/api/projects', {
                name: projectName,
                client_id: selectedClient,
                deadline: deadline,
                description: description,
                type: 'Software Development' // Default for now
            });
            await fetchProjects();
            toast.success('Project explicitly created and scoped successfully!');
            onClose();
        } catch (err) {
            const error = err as any;
            toast.error(error.response?.data?.error || 'Failed to create project');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl glass-card border shadow-glow rounded-card overflow-hidden animate-in">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-white/2">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">Project Initialization Engine</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Enterprise Scope Lock System</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary bg-white/5 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex px-6 pt-6 gap-2">
                    {['Core Details', 'Scope Def', 'Milestones'].map((label, idx) => (
                        <div key={label} className={`flex-1 h-1.5 rounded-full ${step > idx ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10'}`} />
                    ))}
                </div>

                {/* Body */}
                <form onSubmit={handleCreate} className="p-6">
                    {step === 1 && (
                        <div className="space-y-5 animate-in">
                            <div>
                                <label className="flex text-xs font-bold text-text-muted uppercase tracking-widest mb-2 items-center gap-2"><FileText size={14}/> Project Name</label>
                                <input 
                                    type="text" 
                                    className="input-field w-full" 
                                    placeholder="e.g. Master E-Commerce Platform" 
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required 
                                />
                            </div>
                            <div>
                                <label className="flex text-xs font-bold text-text-muted uppercase tracking-widest mb-2 items-center gap-2"><User size={14}/> Assign Client Account</label>
                                <select 
                                    className="input-field w-full cursor-pointer text-text-primary" 
                                    value={selectedClient}
                                    onChange={(e) => setSelectedClient(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select a client to assign ownership</option>
                                    {clients.map((c: UserType) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                                    {clients.length === 0 && <option disabled>No active clients found. Add clients in Admin dashboard.</option>}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex text-xs font-bold text-text-muted uppercase tracking-widest mb-2 items-center gap-2"><Calendar size={14}/> Start Date</label>
                                    <input type="date" className="input-field w-full text-text-primary" required />
                                </div>
                                <div>
                                    <label className="flex text-xs font-bold text-text-muted uppercase tracking-widest mb-2 items-center gap-2"><Calendar size={14}/> Estimated Deadline</label>
                                    <input 
                                        type="date" 
                                        className="input-field w-full text-text-primary" 
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="flex text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Internal Description / Brief</label>
                                <textarea 
                                    className="input-field w-full h-24 resize-none" 
                                    placeholder="Details kept hidden from client unless published." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-in">
                            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl mb-6">
                                <h3 className="text-primary font-bold text-sm mb-1 uppercase tracking-widest">Scope Lock Enforcement</h3>
                                <p className="text-xs text-text-muted">Define exactly what is and isn't included. Anything outside this will automatically force the client into the Change Request (CR) workflow.</p>
                            </div>
                            
                            <div>
                                <label className="flex text-xs font-bold text-success uppercase tracking-widest mb-2 items-center gap-2"><CheckCircle2 size={14}/> Included Features (One per line)</label>
                                <textarea className="input-field w-full h-24 resize-none text-text-primary border-success/30 focus:border-success/50" placeholder="- User Authentication&#10;- Stripe Payments&#10;- Basic Admin Dashboard" required></textarea>
                            </div>
                            
                            <div>
                                <label className="flex text-xs font-bold text-red-400 uppercase tracking-widest mb-2 items-center gap-2"><X size={14}/> Explicitly Excluded (Crucial for Anti-Scope-Creep)</label>
                                <textarea className="input-field w-full h-24 resize-none text-text-primary border-red-500/30 focus:border-red-500/50" placeholder="- Mobile Applications&#10;- Multi-currency routing" required></textarea>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5 animate-in">
                             <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
                                <h3 className="text-amber-500 font-bold text-sm mb-1 uppercase tracking-widest flex items-center gap-2"><DollarSign size={16}/> Financial Billing Milestones</h3>
                                <p className="text-xs text-text-muted">Tie execution stages directly to invoice generation requirements.</p>
                            </div>
                            
                            <div className="space-y-3">
                                {/* Sample Milestone Row */}
                                <div className="flex gap-3">
                                    <input type="text" className="input-field flex-1" placeholder="Milestone Name (e.g. Project Kickoff)" defaultValue="Contract Signature" required />
                                    <input type="number" className="input-field w-32" placeholder="$ Amount" defaultValue="10000" required />
                                    <input type="date" className="input-field w-40 text-text-primary" required />
                                </div>
                                <div className="flex gap-3">
                                    <input type="text" className="input-field flex-1" placeholder="Milestone Name" defaultValue="Beta Delivery" required />
                                    <input type="number" className="input-field w-32" placeholder="$ Amount" defaultValue="5000" required />
                                    <input type="date" className="input-field w-40 text-text-primary" required />
                                </div>
                            </div>
                            <button type="button" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">+ Add Another Milestone</button>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                        <button type="button" onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="px-6 py-2 bg-white/5 text-text-primary rounded-button text-xs font-bold uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-colors">
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        
                        {step < 3 ? (
                            <button type="button" onClick={() => setStep(step + 1)} className="btn-primary px-8 py-2 text-xs">
                                Next Step
                            </button>
                        ) : (
                            <button type="submit" className="btn-primary px-8 py-2 text-xs shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                Finalize & Create
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
