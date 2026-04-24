import { useState, useEffect } from 'react';
import { 
  Check, 
  Eye, 
  FileText, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  User as UserIcon,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { API_URL } from '../../lib/api';
import type { RegistrationRequest } from '../../context/AuthContext';
import { io } from 'socket.io-client';

const RegistrationRequests = () => {
    const [requests, setRequests] = useState<RegistrationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/api/registration-requests');
            setRequests(data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch registration requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();

        // Socket.io for real-time updates
        const socket = io(API_URL || window.location.origin);
        
        socket.on('new_registration_request', (newRequest: RegistrationRequest) => {
            setRequests(prev => [newRequest, ...prev]);
            toast.success('New registration request received!', { icon: '🔔' });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (status === 'REJECTED' && !rejectionReason) {
            toast.error('Please provide a rejection reason');
            return;
        }

        setIsReviewing(true);
        try {
            await api.patch(`/api/registration-requests/${id}/review`, { 
                status, 
                rejectionReason 
            });
            toast.success(`Request ${status.toLowerCase()} successfully`);
            setRequests(prev => prev.filter(r => r.id !== id));
            setSelectedRequest(null);
            setRejectionReason('');
        } catch (err: any) {
            const message = err.response?.data?.error || 'Failed to process request';
            toast.error(message);
        } finally {
            setIsReviewing(false);
        }
    };

    const filteredRequests = requests.filter(req => 
        req.users?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.users?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl text-text-primary m-0 heading-gradient font-display tracking-tight">Registration Queue</h1>
                    <p className="text-text-muted text-sm mt-1">Review and approve new client and team member registrations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            className="input-field pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/10 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Requests List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-card border-white/5">
                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="text-text-muted font-bold uppercase tracking-widest text-xs">Loading queue...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 glass-card rounded-card border-white/5 text-center">
                            <div className="w-16 h-16 bg-success/10 text-success rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                                <Check size={32} />
                            </div>
                            <h3 className="text-xl text-text-primary font-bold">Queue is Empty</h3>
                            <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">All registration requests have been processed. Great job!</p>
                        </div>
                    ) : (
                        filteredRequests.map(request => (
                            <div 
                                key={request.id}
                                onClick={() => setSelectedRequest(request)}
                                className={`glass-card p-6 rounded-card border transition-all cursor-pointer group ${selectedRequest?.id === request.id ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-glow' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg text-text-primary font-bold group-hover:text-primary transition-colors">{request.users?.name}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[10px] text-text-muted">
                                                    <Mail size={12} /> {request.users?.email}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${request.role === 'team' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                    {request.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                                            <Clock size={12} className="text-primary" />
                                            {new Date(request.created_at).toLocaleDateString()}
                                        </div>
                                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-md text-[9px] font-black uppercase tracking-widest">
                                            Pending Review
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Details Panel */}
                <div className="space-y-6">
                    {selectedRequest ? (
                        <div className="glass-card p-8 rounded-card border border-white/10 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-xl text-text-primary font-bold mb-6 flex items-center gap-2">
                                <FileText className="text-primary" size={20} />
                                Request Details
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <label className="text-[10px] text-text-muted font-black uppercase tracking-widest block mb-2">User Information</label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted"><UserIcon size={14} /></div>
                                                <span className="text-sm text-text-primary font-bold">{selectedRequest.users?.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted"><Mail size={14} /></div>
                                                <span className="text-sm text-text-muted">{selectedRequest.users?.email}</span>
                                            </div>
                                            {selectedRequest.users?.phone && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted"><Phone size={14} /></div>
                                                    <span className="text-sm text-text-muted">{selectedRequest.users?.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <label className="text-[10px] text-text-muted font-black uppercase tracking-widest block mb-3">Identity Document</label>
                                        {selectedRequest.document_url ? (
                                            <a 
                                                href={selectedRequest.document_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-3 bg-surface rounded-lg border border-white/10 hover:border-primary/50 transition-all group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary group-hover:text-black transition-all">
                                                        <FileText size={16} />
                                                    </div>
                                                    <span className="text-xs font-bold text-text-primary">View Document Proof</span>
                                                </div>
                                                <Eye size={14} className="text-text-muted group-hover:text-primary transition-all" />
                                            </a>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-400 text-xs font-bold p-3 bg-red-400/5 rounded-lg border border-red-400/20">
                                                <AlertCircle size={14} /> No document uploaded
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex gap-3">
                                        <button 
                                            disabled={isReviewing}
                                            onClick={() => handleReview(selectedRequest.id, 'APPROVED')}
                                            className="flex-1 bg-success hover:bg-success/80 text-black font-black uppercase tracking-widest text-[10px] py-4 rounded-xl shadow-glow transition-all disabled:opacity-50"
                                        >
                                            Approve User
                                        </button>
                                        <button 
                                            disabled={isReviewing}
                                            onClick={() => handleReview(selectedRequest.id, 'REJECTED')}
                                            className="px-6 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all rounded-xl font-black uppercase tracking-widest text-[10px] disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] text-text-muted font-black uppercase tracking-widest block px-1">Rejection Reason <span className="normal-case font-normal">(Required for rejection)</span></label>
                                        <textarea 
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Explain why the registration was rejected..."
                                            className="input-field w-full h-24 py-3 resize-none text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-12 rounded-card border border-white/5 text-center space-y-4 opacity-60">
                            <div className="w-16 h-16 mx-auto bg-white/5 text-text-muted rounded-full flex items-center justify-center border border-white/10">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-text-muted text-sm font-medium">Select a request from the list to view details and take action.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrationRequests;
