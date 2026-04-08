import React, { useState } from 'react';
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
import { projects } from '../data/mockData';
import { Footer } from '../components/Footer';

const MessagesPage: React.FC = () => {
    const [selectedChat, setSelectedChat] = useState<string | null>(projects && projects.length > 0 ? projects[0].id : null);
    const [showChatList, setShowChatList] = useState(true);

    const chats = projects ? projects.map(p => ({
        id: p.id,
        name: p.name,
        lastMessage: "Looking forward to the update!",
        time: "10:45 AM",
        unread: p.id === '1' ? 3 : 0,
        online: true,
        avatar: p.name.charAt(0)
    })) : [];

    return (
        <div className="h-[calc(100vh-160px)] flex glass-card rounded-card border border-white/5 overflow-hidden shadow-2xl animate-in relative">
            {/* Chats Sidebar */}
            <aside className={`${showChatList ? 'w-full md:w-80' : 'hidden md:flex md:w-80'} border-r border-white/5 flex flex-col bg-white/1 shrink-0`}>
                <div className="p-6 border-b border-white/5">
                    <h2 className="text-xl text-text-primary font-bold mb-4">Messages</h2>
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
                    {chats.map(chat => (
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
                                {chat.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-surface"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-text-primary truncate">{chat.name}</h3>
                                    <span className="text-[9px] text-text-muted font-bold whitespace-nowrap">{chat.time}</span>
                                </div>
                                <p className="text-xs text-text-muted truncate leading-relaxed">{chat.lastMessage}</p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="absolute right-4 bottom-4 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-text-primary shadow-glow">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Chat Content */}
            <main className={`${!showChatList ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col min-w-0 bg-background/20 relative`}>
                {/* Chat Header */}
                <header className="px-4 md:px-8 py-4 border-b border-white/5 flex justify-between items-center bg-white/2 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowChatList(true)}
                            className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="w-10 h-10 rounded-xl bg-surface border border-white/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {chats.find(c => c.id === selectedChat)?.avatar}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-text-primary">{chats.find(c => c.id === selectedChat)?.name || 'Select a chat'}</h3>
                            <div className="flex items-center gap-2">
                                <Circle size={8} className="fill-success text-success" />
                                <span className="text-[10px] text-text-muted uppercase font-black tracking-widest leading-none">Active Team Discussion</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"><Phone size={18} /></button>
                        <button className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"><Video size={18} /></button>
                        <button className="p-2.5 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"><Info size={18} /></button>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    <div className="flex justify-center mb-4">
                        <span className="text-[9px] text-text-muted font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">April 4, 2026</span>
                    </div>

                    <div className="flex gap-4">
                        <img src="https://i.pravatar.cc/150?u=pm" className="w-8 h-8 rounded-full mt-1 shrink-0" alt="" />
                        <div className="space-y-2 max-w-[70%]">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-text-primary">Project Manager</span>
                                <span className="text-[9px] text-text-muted font-bold">10:30 AM</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm text-text-primary leading-relaxed shadow-lg">
                                Welcome to the portal! This is where we'll coordinate all project efforts. I've uploaded the initial briefing.
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-row-reverse">
                         <img src="https://i.pravatar.cc/150?u=wajiha" className="w-8 h-8 rounded-full mt-1 shrink-0" alt="" />
                         <div className="space-y-2 max-w-[70%] text-right">
                            <div className="flex items-center justify-end gap-3">
                                <span className="text-[9px] text-text-muted font-bold">10:45 AM</span>
                                <span className="text-xs font-bold text-text-primary">You</span>
                            </div>
                            <div className="bg-primary/20 border border-primary/20 p-4 rounded-2xl rounded-tr-none text-sm text-text-primary leading-relaxed inline-block text-left shadow-glow">
                                Thanks! Looking forward to working together. The dashboard looks great.
                                <div className="flex items-center justify-end gap-1 mt-2 text-primary">
                                    <CheckCheck size={14} />
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1 shrink-0">
                            <MessageSquare size={16} />
                        </div>
                        <div className="space-y-2 max-w-[70%]">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-text-primary">System Bot</span>
                                <span className="text-[9px] text-text-muted font-bold">11:00 AM</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none text-sm text-text-primary leading-relaxed border-l-4 border-l-primary italic">
                                Project "E-Commerce Platform" status changed to "In Progress".
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/2 border-t border-white/5">
                    <div className="max-w-4xl mx-auto glass-card border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 shadow-2xl">
                        <button className="p-2 text-text-muted hover:text-text-primary transition-colors hover:bg-white/5 rounded-lg"><Paperclip size={20} /></button>
                        <input 
                            type="text" 
                            placeholder="Write your message..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary px-2 focus:ring-0"
                        />
                        <button className="p-3 bg-primary text-text-primary rounded-xl shadow-glow hover:scale-105 active:scale-95 transition-all">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>
            <Footer className="absolute bottom-0 left-0 w-full px-8 pointer-events-none" />
        </div>
    );
};

export default MessagesPage;
