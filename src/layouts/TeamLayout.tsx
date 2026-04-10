import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Briefcase,
  CheckSquare,
  MessageSquare,
  FolderOpen,
  FileText,
  StickyNote,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Settings,
  BarChart3,
  Video,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/BrandLogo';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';

const SidebarItem = ({
  to,
  icon: Icon,
  label,
  collapsed,
  badge,
}: {
  to: string;
  icon: any;
  label: string;
  collapsed: boolean;
  badge?: number;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) => `
        flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative
        ${
          isActive
            ? 'bg-emerald-500/10 text-emerald border-l-4 border-emerald shadow-[inset_4px_0_0_0_rgba(16,185,129,1)]'
            : 'text-text-muted hover:bg-white/5 hover:text-text-primary border-l-0'
        }
      `}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && (
        <span className="font-medium text-xs uppercase tracking-widest">
          {label}
        </span>
      )}
      {badge && !collapsed && (
        <span className="ml-auto bg-emerald text-black text-[10px] px-2 py-0.5 rounded-full font-black">
          {badge}
        </span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-surface border border-white/10 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 uppercase tracking-widest font-bold">
          {label}
        </div>
      )}
    </NavLink>
  );
};

const TeamLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Project Updated', desc: 'Deliverable submitted for review.', time: '10m ago', unread: true },
    { id: 2, title: 'Invoice Paid', desc: 'INV-2026-004 has been settled.', time: '2h ago', unread: true },
    { id: 3, title: 'System Alert', desc: 'Database optimization complete.', time: '5h ago', unread: true },
    { id: 4, title: 'Support Ticket', desc: 'Critical bug reported on mobile.', time: '1d ago', unread: false }
  ]);
  const location = useLocation();
  const { logout, user } = useAuth();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n: any) => n.unread).length;

  useEffect(() => {
    if (mainContentRef.current) {
        mainContentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const pathnames = location.pathname.split('/').filter((x: string) => x);
  const breadcrumbs = pathnames.map((name: string, index: number) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    const displayName =
      name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

    return (
      <span key={name} className="flex items-center">
        <span className="mx-2 text-text-muted">/</span>
        {isLast ? (
          <span className="text-text-primary font-medium">{displayName}</span>
        ) : (
          <Link
            to={routeTo}
            className="text-text-muted hover:text-emerald transition-colors"
          >
            {displayName}
          </Link>
        )}
      </span>
    );
  });

  return (
    <div className="flex min-h-screen bg-background font-body text-text-primary overflow-hidden">
      <aside
        className={`hidden md:flex flex-col border-r border-white/5 bg-surface transition-all duration-300 relative z-40 ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="p-6 mb-8 mt-2">
          <Link
            to="/team/dashboard"
            className={`block ${collapsed ? 'flex justify-center transition-all' : ''}`}
          >
            <BrandLogo
              collapsed={collapsed}
              subtitle="Team Portal"
              subtitleClassName="text-emerald drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <SidebarItem
            to="/team/dashboard"
            icon={LayoutGrid}
            label="Dashboard"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/team/projects"
            icon={Briefcase}
            label="Projects"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/team/analysis"
            icon={BarChart3}
            label="Project Analysis"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/team/tasks"
            icon={CheckSquare}
            label="My Tasks"
            collapsed={collapsed}
            badge={12}
          />
          <SidebarItem
            to="/team/messages"
            icon={MessageSquare}
            label="Client Comm"
            collapsed={collapsed}
            badge={3}
          />
          <SidebarItem
            to="/team/files"
            icon={FolderOpen}
            label="Deliverables"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/team/meetings"
            icon={Video}
            label="Meetings"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/team/billing"
            icon={FileText}
            label="Billing Prep"
            collapsed={collapsed}
          />

          <div className="pt-6 pb-2">
            {!collapsed && (
              <p className="px-5 text-[10px] text-text-muted uppercase font-black font-sans tracking-widest">
                Internal Area
              </p>
            )}
            <div
              className={`h-px bg-white/5 mx-5 mt-2 mb-4 ${collapsed ? 'mx-2' : ''}`}
            ></div>
          </div>

          <SidebarItem
            to="/team/notes"
            icon={StickyNote}
            label="Private Notes"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/team/settings"
            icon={Settings}
            label="Settings"
            collapsed={collapsed}
          />
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className={`w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-lg transition-all md:${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && (
              <span className="font-black text-xs uppercase tracking-widest">
                Logout
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-surface border border-white/10 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-all shadow-xl z-50 hover:border-emerald/50"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      <div 
        ref={mainContentRef}
        className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden overflow-y-auto bg-grid"
      >
        {user?.status === 'pending' && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-3 flex items-center justify-center gap-3 backdrop-blur-md sticky top-0 z-50">
            <AlertTriangle className="text-amber-500" size={18} />
            <span className="text-amber-400 font-bold text-[10px] uppercase tracking-widest">
              Awaiting Internal Authorization: Restricted Access Mode
            </span>
          </div>
        )}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-background/80 backdrop-blur-md border-b border-emerald/10">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-text-muted hover:text-text-primary"
            >
                <Menu size={24} />
            </button>
            <nav className="hidden md:flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <Link
                to="/team/dashboard"
                className="hover:text-emerald transition-colors"
              >
                Team
              </Link>
              {breadcrumbs}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://codevertex.solutions/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/10 transition-all group"
            >
              <Globe size={14} className="group-hover:text-emerald transition-colors" />
              <span>Visit Website</span>
            </a>

            <ThemeToggle />

            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-full transition-all"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-emerald rounded-full text-black text-[9px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(74,222,128,0.5)] pulse-glow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl border shadow-[0_0_20px_rgba(0,0,0,0.5)] border-white/10 overflow-hidden z-50 animate-in">
                  <div className="p-4 border-b border-white/5 bg-white/2 flex justify-between items-center">
                    <h3 className="text-text-primary font-bold">Notifications</h3>
                    <span className="text-[10px] text-black bg-emerald px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{unreadCount} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} 
                           onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n))}
                           className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-emerald/5' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-xs font-bold ${notif.unread ? 'text-emerald' : 'text-text-primary'}`}>{notif.title}</p>
                          <span className="text-[10px] text-text-muted">{notif.time}</span>
                        </div>
                        <p className="text-xs text-text-muted">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/5 bg-surface text-center flex justify-between px-6">
                    <button onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))} className="text-[10px] text-text-muted hover:text-emerald uppercase tracking-widest font-bold transition-colors">Mark all as read</button>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] text-text-muted hover:text-text-primary uppercase tracking-widest font-bold transition-colors">Close</button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/team/settings" className="flex items-center gap-3 pl-6 border-l border-emerald/10 group">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-text-primary leading-none group-hover:text-emerald transition-colors lowercase tracking-widest">{user?.name || 'Partner Dev'}</p>
                <span className="text-[10px] text-emerald mt-1 inline-block uppercase tracking-widest font-bold">Execution Staff</span>
              </div>
              <div className="w-10 h-10 rounded-xl border-2 border-emerald/50 p-0.5 bg-surface flex items-center justify-center text-emerald font-display font-black group-hover:scale-105 group-hover:border-emerald transition-all overflow-hidden relative">
                <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.email}`} alt="" className="w-full h-full object-cover rounded-lg" />
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-12 animate-in">{children}</main>

        <Footer className="px-12" />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div 
            className="absolute inset-0 bg-background/90 backdrop-blur-lg animate-in fade-in duration-300" 
            onClick={() => setMobileOpen(false)}
          ></div>
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-surface/95 border-r border-white/5 p-6 flex flex-col z-50 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
              <BrandLogo collapsed={false} subtitle="Team Portal" subtitleClassName="text-emerald" />
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-3 -mr-3 bg-white/5 rounded-full text-text-muted hover:text-text-primary active:bg-white/10 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pb-4 scrollbar-hide">
              <SidebarItem to="/team/dashboard" icon={LayoutGrid} label="Dashboard" collapsed={false} />
              <SidebarItem to="/team/projects" icon={Briefcase} label="Projects" collapsed={false} />
              <SidebarItem to="/team/analysis" icon={BarChart3} label="Analysis" collapsed={false} />
              <SidebarItem to="/team/tasks" icon={CheckSquare} label="Tasks" collapsed={false} badge={12} />
              <SidebarItem to="/team/messages" icon={MessageSquare} label="Messages" collapsed={false} badge={3} />
              <SidebarItem to="/team/files" icon={FolderOpen} label="Deliverables" collapsed={false} />
              <SidebarItem to="/team/meetings" icon={Video} label="Meetings" collapsed={false} />
              <SidebarItem to="/team/billing" icon={FileText} label="Billing Prep" collapsed={false} />
              
              <div className="py-6">
                <div className="h-px bg-white/5"></div>
              </div>

              <p className="px-4 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans mb-3">
                Internal Area
              </p>

              <SidebarItem to="/team/notes" icon={StickyNote} label="Notes" collapsed={false} />
              <SidebarItem to="/team/settings" icon={Settings} label="Settings" collapsed={false} />
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <Link 
                to="/team/settings" 
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-colors"
              >
                <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.email}`} className="w-12 h-12 rounded-full border-2 border-emerald/20 object-cover" alt="" />
                <div>
                  <p className="text-text-primary font-bold text-sm uppercase tracking-wider leading-none truncate">{user?.name || 'Dev'}</p>
                  <span className="text-[10px] text-emerald mt-2 flex uppercase font-bold tracking-widest">Execution Staff</span>
                </div>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://codevertex.solutions/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-primary active:scale-95 transition-all text-center"
                >
                  <Globe size={14} className="text-emerald shrink-0" />
                  Website
                </a>
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3.5 text-red-500 bg-red-500/5 rounded-xl font-black text-[10px] uppercase tracking-widest active:bg-red-500/10 active:scale-95 transition-all text-center"
                >
                  <LogOut size={14} className="shrink-0" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default TeamLayout;
