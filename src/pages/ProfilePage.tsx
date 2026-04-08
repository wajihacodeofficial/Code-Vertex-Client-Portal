import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Bell, 
  Globe, 
  Camera,
  CheckCircle2,
  Lock,
  Smartphone,
  History
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const handleSave = () => {
        toast.success('Profile updated successfully!');
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl text-text-primary m-0">Account Settings</h1>
                <p className="text-text-muted text-sm mt-1">Manage your personal information, security, and notification preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Sidebar */}
                <aside className="lg:w-64 space-y-1">
                    {[
                        { name: 'Profile', icon: User },
                        { name: 'Security', icon: Shield },
                        { name: 'Notifications', icon: Bell },
                        { name: 'Preferences', icon: Globe },
                    ].map(tab => (
                        <button 
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                                activeTab === tab.name 
                                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow' 
                                    : 'text-text-muted hover:bg-white/5 hover:text-text-primary border border-transparent'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.name}
                        </button>
                    ))}
                </aside>

                {/* Tab Content */}
                <div className="flex-1 space-y-8 animate-in">
                    {activeTab === 'Profile' && (
                        <div className="glass-card p-8 rounded-card border border-white/5 space-y-8">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <div className="relative group cursor-pointer shrink-0">
                                    <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1 group-hover:border-primary transition-all">
                                        <img src="https://i.pravatar.cc/150?u=wajiha" className="w-full h-full rounded-full object-cover" alt="" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={24} className="text-text-primary" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-text-primary border-4 border-surface shadow-glow">
                                        <CheckCircle2 size={12} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-2xl text-text-primary font-bold leading-none">Wajiha Zehra</h3>
                                    <p className="text-text-muted text-sm italic">Verified Client Account</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[9px] font-black uppercase tracking-widest leading-none">Owner</span>
                                        <span className="px-2 py-0.5 bg-white/5 text-text-muted border border-white/10 rounded text-[9px] font-black uppercase tracking-widest leading-none">Since 2024</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-text-muted font-black uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><User size={16} /></div>
                                        <input type="text" defaultValue="Wajiha Zehra" className="input-field w-full pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-text-muted font-black uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><Mail size={16} /></div>
                                        <input type="email" defaultValue="wajiha@codevertex.tech" className="input-field w-full pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-text-muted font-black uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><Phone size={16} /></div>
                                        <input type="text" defaultValue="+92 300 1234567" className="input-field w-full pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] text-text-muted font-black uppercase tracking-widest ml-1">Company Name</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"><Building size={16} /></div>
                                        <input type="text" defaultValue="Wajiha Solutions" className="input-field w-full pl-10" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <button onClick={handleSave} className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div className="space-y-8">
                            <div className="glass-card p-8 rounded-card border border-white/5 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary/10 text-primary rounded-lg"><Lock size={20} /></div>
                                    <h3 className="text-xl text-text-primary font-bold">Change Password</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <input type="password" placeholder="Current Password" className="input-field" />
                                    <input type="password" placeholder="New Password" className="input-field" />
                                    <input type="password" placeholder="Confirm New Password" className="input-field" />
                                </div>
                                <button onClick={handleSave} className="btn-primary w-fit">Update Password</button>
                            </div>

                            <div className="glass-card p-8 rounded-card border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-success/10 text-success rounded-lg shrink-0"><Smartphone size={20} /></div>
                                    <div>
                                        <h3 className="text-text-primary font-bold leading-none">Two-Factor Authentication</h3>
                                        <p className="text-text-muted text-xs mt-2">Add an extra layer of security to your account.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-success font-black uppercase mr-2">Enabled</span>
                                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary shadow-glow transition-all">
                                        <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-all"></span>
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-card border border-white/5 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-text-muted/10 text-text-muted rounded-lg"><History size={20} /></div>
                                    <h3 className="text-xl text-text-primary font-bold">Active Sessions</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { device: 'MacBook Pro 16"', location: 'Karachi, Pakistan', platform: 'Chrome • Active Now', primary: true },
                                        { device: 'iPhone 15 Pro', location: 'Karachi, Pakistan', platform: 'Code Vertex Mobile • 2h ago', primary: false },
                                    ].map((session, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-text-muted"><Smartphone size={20} /></div>
                                                <div>
                                                    <p className="text-text-primary font-bold text-sm">{session.device} {session.primary && <span className="text-[8px] text-primary font-black uppercase bg-primary/10 px-1.5 py-0.5 rounded ml-2">This Device</span>}</p>
                                                    <p className="text-[10px] text-text-muted mt-1">{session.platform} • {session.location}</p>
                                                </div>
                                            </div>
                                            {!session.primary && <button className="text-[10px] text-red-500 font-bold uppercase hover:underline">Revoke</button>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="glass-card p-8 rounded-card border border-white/5 space-y-8">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl text-text-primary font-bold">Preferences</h3>
                                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Global Settings</p>
                             </div>
                             
                             <div className="space-y-6">
                                {[
                                    { title: 'Project Updates', desc: 'Get notified about milestone changes and deliverables.' },
                                    { title: 'Invoices & Billing', desc: 'Alerts for new invoices, payment success, and overdue notices.' },
                                    { title: 'New Messages', desc: 'Instant alerts for team discussion and PM direct messages.' },
                                    { title: 'Support Ticket Replies', desc: 'Status updates and replies on your open tickets.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <p className="text-text-primary font-bold group-hover:text-primary transition-colors">{item.title}</p>
                                            <p className="text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="text-[8px] text-text-muted uppercase font-black">Email</span>
                                                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary/20 transition-all">
                                                    <span className="inline-block h-3 w-3 translate-x-5 rounded-full bg-primary transition-all shadow-glow"></span>
                                                </button>
                                            </div>
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="text-[8px] text-text-muted uppercase font-black">App</span>
                                                <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                                                    <span className="inline-block h-3 w-3 translate-x-5 rounded-full bg-white transition-all"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                             
                             <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                                <p className="text-xs text-text-muted">Changes are saved automatically.</p>
                                <button className="text-xs text-primary font-bold hover:underline">Reset to Default</button>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
