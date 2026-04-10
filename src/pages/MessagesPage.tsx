import React, { useState, useEffect } from 'react';
import { 
  Search,
  MessageSquare,
  Paperclip, 
  Send, 
  Circle,
  Phone,
  Video,
  Info,
  CheckCheck,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/Footer';

const MessagesPage: React.FC = () => {
    const { projects, user } = useAuth();
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [showChatList, setShowChatList] = useState(true);

    useEffect(() => {
        if (projects && projects.length > 0 && !selectedChat) {
            setSelectedChat(projects[0].id);
        }
    }, [projects, selectedChat]);

    const chats = projects ? projects.map(p => ({
        id: p.id,
        name: p.name,
        lastMessage: "System: Monitoring project lifecycle...",
        time: "Active",
        unread: 0,
        online: true,
        avatar: p.name?.charAt(0) || 'P'
    })) : [];

    const activeChat = chats.find(c => c.id === selectedChat);

    return (
        <div className="h-[calc(100vh-160px)] flex glass-card rounded-card border border-white/5 overflow-hidden shadow-2xl animate-in relative">
            {/* Chats Sidebar */}
            <aside className={`${showChatList ? 'w-full md:w-80' : 'hidden md:flex md:w-80'} border-r border-white/5 flex flex-col bg-white/1 shrink-0`}>
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl text-text-primary font-bold mb-4 font-display">Communications</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search discussions..." 
                            className="input-field w-full pl-10 py-2 text-xs"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {chats.length === 0 ? (
                        <div className="p-10 text-center text-text-muted text-xs uppercase tracking-widest font-bold">No active discussions found.</div>
                    ) : chats.map(chat => (
                        <div 
                            key={chat.id}
                            onClick={() => {
                                setSelectedChat(chat.id);
                                setShowChatList(false);
                            }}
                            className={`p-4 flex gap-4 cursor-pointer transition-all border-b border-white/2 relative group ${
                                selectedChat === chat.id ? 'bg-primary/10' : 'hover:bg-white/3'
                            }`}
                        >
                            {selectedChat === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-glow hidden md:block"></div>}
                            <div className="w-12 h-12 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold shrink-0 group-hover:scale-105 transition-transform">
                                {chat.avatar}
                                {chat.online && <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald border-2 border-surface animate-pulse"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-text-primary truncate">{chat.name}</h3>
                                    <span className="text-[9px] text-text-muted font-bold whitespace-nowrap uppercase tracking-tighter">{chat.time}</span>
                                </div>
                                <p className="text-[10px] text-text-muted truncate leading-relaxed font-medium">{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Content */}
            <main className={`${!showChatList ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col min-w-0 bg-background/20 relative`}>
                {selectedChat ? (
                    <>
                        <header className="px-4 md:px-8 py-4 border-b border-white/5 flex justify-between items-center bg-white/2 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setShowChatList(true)}
                                    className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary"
                                >
                                    <X size={24} />
                                </button>
                                <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold shrink-0">
                                    {activeChat?.avatar}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-text-primary leading-tight">{activeChat?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Circle size={8} className="fill-emerald text-emerald" />
                                        <span className="text-[10px] text-emerald uppercase font-black tracking-widest leading-none">Security Channel Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"><Phone size={18} /></button>
                                <button className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"><Video size={18} /></button>
                                <button className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"><Info size={18} /></button>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                            <div className="flex justify-center mb-4">
                                <span className="text-[9px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Session Initialized Today</span>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                    <MessageSquare size={16} />
                                </div>
                                <div className="space-y-2 max-w-[70%]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-text-primary">System Command</span>
                                        <span className="text-[9px] text-text-muted font-bold">LIVE</span>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm text-text-primary leading-relaxed shadow-lg border-l-4 border-l-primary uppercase tracking-tighter font-medium">
                                        Communications channel for "{activeChat?.name}" is now monitored. All tactical data and project syncs will be logged here.
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 flex-row-reverse animate-in">
                                 <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                 </div>
                                 <div className="space-y-2 max-w-[70%] text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="text-[9px] text-text-muted font-bold">JUST NOW</span>
                                        <span className="text-xs font-bold text-text-primary">{user?.name}</span>
                                    </div>
                                    <div className="bg-primary/20 border border-primary/20 p-4 rounded-2xl rounded-tr-none text-sm text-text-primary leading-relaxed inline-block text-left shadow-glow">
                                        Channel established. I am reviewing the status of {activeChat?.name}. Enable secure broadcast for the team.
                                        <div className="flex items-center justify-end gap-1 mt-2 text-primary">
                                            <CheckCheck size={14} />
                                        </div>
                                    </div>
                                 </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/2 border-t border-white/5">
                            <div className="max-w-4xl mx-auto glass-card border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl bg-white/2">
                                <button className="p-2 text-text-muted hover:text-text-primary transition-colors hover:bg-white/5 rounded-lg"><Paperclip size={20} /></button>
                                <input 
                                    type="text" 
                                    placeholder={`Message ${activeChat?.name} channel...`} 
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary px-2 focus:ring-0"
                                />
                                <button className="p-3 bg-primary text-black rounded-xl shadow-glow hover:scale-105 active:scale-95 transition-all">
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-text-muted border border-white/10">
                            <MessageSquare size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">No Active Thread</h2>
                            <p className="text-sm text-text-muted max-w-xs mt-1">Select a project chat from the left to start coordinating with your team.</p>
                        </div>
                    </div>
                )}
            </main>
            <Footer className="absolute bottom-0 left-0 w-full px-8 pointer-events-none" />
        </div>
    );
};

export default MessagesPage;
