import React, { useState } from 'react';
import { User, Lock, Bell, Download, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Profile');

    const getTabClass = (tabName: string) => {
        const isActive = activeTab === tabName;
        if (!isActive) return 'bg-surface border border-white/5 hover:bg-white/5 text-text-muted hover:text-text-primary';
        
        if (user?.role === 'admin') return 'bg-[#00CFFF]/10 border border-[#00CFFF]/30 text-text-primary shadow-[0_0_15px_rgba(0,207,255,0.2)]';
        if (user?.role === 'team') return 'bg-success/10 border border-success/30 text-text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]';
        return 'bg-primary/10 border border-primary/30 text-text-primary shadow-glow';
    };

    const getIconClass = (tabName: string) => {
        const isActive = activeTab === tabName;
        if (!isActive) return '';
        if (user?.role === 'admin') return 'text-[#00CFFF]';
        if (user?.role === 'team') return 'text-success';
        return 'text-primary';
    };

    const getBtnClass = () => {
        if (user?.role === 'admin') return 'px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs transition-all text-black bg-[#00CFFF] hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(0,207,255,0.4)]';
        if (user?.role === 'team') return 'px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs transition-all text-black bg-success hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.4)]';
        return 'btn-primary';
    };

    return (
        <div className="space-y-8 pb-20 animate-in">
            <div className="glass-card p-8 rounded-card border shadow-glow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl text-text-primary font-display">Account Settings</h1>
                    <p className="text-text-muted mt-2">Manage your preferences, security, and notification configurations.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    {[
                        { name: 'Profile', text: 'Personal Details', icon: User },
                        { name: 'Security', text: 'Passwords & 2FA', icon: Lock },
                        { name: 'Notifications', text: 'Alert Preferences', icon: Bell },
                        { name: 'Policies', text: 'Legal Documents', icon: Shield },
                        { name: 'Data', text: 'Export & Privacy', icon: Download },
                    ].map(tab => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left ${getTabClass(tab.name)}`}
                        >
                            <tab.icon size={18} className={getIconClass(tab.name)} />
                            <div>
                                <p className="text-sm font-bold">{tab.name}</p>
                                <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">{tab.text}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className="flex-1 glass-card p-8 rounded-card border shadow-glow">
                    {activeTab === 'Profile' && (
                        <div className="space-y-6">
                            <h2 className="text-xl text-text-primary mb-6 border-b border-white/10 pb-4">Personal Details</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" className="input-field w-full" defaultValue={user?.name} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" className="input-field w-full" defaultValue={user?.email} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Company Name</label>
                                <input type="text" className="input-field w-full" placeholder="Your Enterprise LLC" />
                            </div>
                            <button className={`mt-6 ${getBtnClass()}`}>Save Changes</button>
                        </div>
                    )}

                    {activeTab === 'Security' && (
                        <div className="space-y-6">
                            <h2 className="text-xl text-text-primary mb-6 border-b border-white/10 pb-4">Security Settings</h2>
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Current Password</label>
                                <input type="password" className="input-field w-full" placeholder="••••••••" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">New Password</label>
                                    <input type="password" className="input-field w-full" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Confirm New Password</label>
                                    <input type="password" className="input-field w-full" placeholder="••••••••" />
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl mt-6 flex justify-between items-center">
                                <div>
                                    <h4 className="text-text-primary font-bold text-sm">Two-Factor Authentication</h4>
                                    <p className="text-xs text-text-muted mt-1">Add an extra layer of security to your account.</p>
                                </div>
                                <button className={`px-4 py-2 uppercase font-bold tracking-widest text-[10px] rounded-lg border transition-colors ${
                                    user?.role === 'admin' ? 'bg-[#00CFFF]/10 text-[#00CFFF] border-[#00CFFF]/20 hover:bg-[#00CFFF]/20' : 
                                    user?.role === 'team' ? 'bg-success/10 text-success border-success/20 hover:bg-success/20' : 
                                    'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                                }`}>Enable 2FA</button>
                            </div>
                            <button className={`mt-6 ${getBtnClass()}`}>Update Password</button>
                        </div>
                    )}
                    
                    {activeTab !== 'Profile' && activeTab !== 'Security' && (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 text-text-muted">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-lg text-text-primary font-bold">{activeTab} Settings</h3>
                            <p className="text-sm text-text-muted mt-2">This configuration module is actively being developed by the Code Vertex engineering team.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
