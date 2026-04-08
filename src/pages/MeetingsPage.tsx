import React, { useState } from 'react';
import { Calendar, Clock, Video, Plus, CheckCircle2 } from 'lucide-react';

const MeetingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');

    const meetings = [
        { id: 1, title: 'Project Kickoff: E-Commerce', date: '2025-04-10', time: '10:00 AM EST', type: 'Discovery Call', status: 'Scheduled', url: 'https://zoom.us/j/123456789' },
        { id: 2, title: 'Sprint Review & Demo', date: '2025-04-15', time: '02:30 PM EST', type: 'Progress Update', status: 'Scheduled', url: 'https://zoom.us/j/987654321' },
        { id: 3, title: 'Initial Consultation', date: '2025-03-25', time: '11:00 AM EST', type: 'Discovery Call', status: 'Completed', url: '#' }
    ];

    return (
        <div className="space-y-8 pb-20 animate-in">
            {/* Header */}
            <div className="glass-card p-8 rounded-card border shadow-glow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl text-text-primary font-display">Meetings Center</h1>
                    <p className="text-text-muted mt-2">Schedule and manage all your strategic sessions.</p>
                </div>
                <button className="btn-primary flex items-center gap-2 shrink-0">
                    <Plus size={20} /> Schedule Meeting
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-card border shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><Calendar size={120} /></div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 relative z-10">Upcoming Meetings</p>
                    <p className="text-3xl font-display font-black text-text-primary relative z-10">2</p>
                </div>
                <div className="glass-card p-6 rounded-card border-success/30 bg-success/5 shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] text-success group-hover:scale-110 transition-transform"><CheckCircle2 size={120} /></div>
                    <p className="text-[10px] text-success/70 uppercase font-bold tracking-widest mb-1 relative z-10">Past Sessions</p>
                    <p className="text-3xl font-display font-black text-success relative z-10">1</p>
                </div>
                <div className="glass-card p-6 rounded-card border shadow-glow relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform"><Clock size={120} /></div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 relative z-10">Total Hours</p>
                    <p className="text-3xl font-display font-black text-text-primary relative z-10">1.5</p>
                </div>
            </div>

            {/* List */}
            <div className="glass-card rounded-card border shadow-glow overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/2">
                    <div className="flex bg-surface p-1 rounded-xl border border-white/5 w-full sm:w-auto">
                        {['Upcoming', 'Past', 'Cancelled'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 sm:flex-none px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-primary text-black shadow-glow' : 'text-text-muted hover:text-text-primary'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divide-y divide-white/5">
                    {meetings.filter(m => activeTab === 'Upcoming' ? m.status === 'Scheduled' : activeTab === 'Past' ? m.status === 'Completed' : m.status === 'Cancelled').map(meeting => (
                         <div key={meeting.id} className="p-6 hover:bg-white/5 transition-all flex flex-col md:flex-row justify-between lg:items-center gap-6">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0"><Video size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">{meeting.title}</h3>
                                    <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">{meeting.type}</p>
                                    <div className="flex gap-4 mt-3">
                                        <div className="flex items-center gap-2 text-sm text-text-primary"><Calendar size={14} className="text-primary"/> {meeting.date}</div>
                                        <div className="flex items-center gap-2 text-sm text-text-primary"><Clock size={14} className="text-amber-400"/> {meeting.time}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 md:items-end">
                                {meeting.status === 'Scheduled' ? (
                                    <>
                                        <button className="px-4 py-2 bg-white/5 text-text-primary border border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all rounded-button text-xs font-bold uppercase tracking-widest">Reschedule</button>
                                        <a href={meeting.url} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2 px-6 flex items-center justify-center gap-2">Join Call <Video size={14}/></a>
                                    </>
                                ) : (
                                    <div className="px-4 py-2 bg-success/10 text-success rounded-lg text-xs font-bold uppercase tracking-widest border border-success/20">Session Completed</div>
                                )}
                            </div>
                        </div>
                    ))}
                    {meetings.filter(m => activeTab === 'Upcoming' ? m.status === 'Scheduled' : activeTab === 'Past' ? m.status === 'Completed' : m.status === 'Cancelled').length === 0 && (
                        <div className="p-12 text-center text-text-muted">
                            <Clock size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No meetings found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MeetingsPage;
