import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Briefcase,
  MessageSquare,
  Receipt,
  Ticket,
  FolderOpen,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notifications as mockNotifications } from '../data/mockData';
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
            ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-[inset_4px_0_0_0_rgba(255,215,0,1)]'
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
        <span className="ml-auto bg-primary text-black text-[10px] px-2 py-0.5 rounded-full font-black">
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

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const location = useLocation();
  const { logout, user } = useAuth();
  const mainContentRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

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
            className="text-text-muted hover:text-primary transition-colors"
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
            to="/dashboard"
            className={`block ${collapsed ? 'flex justify-center transition-all' : ''}`}
          >
            <BrandLogo
              collapsed={collapsed}
              subtitle="Client Portal"
              subtitleClassName="text-primary drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
            />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <SidebarItem
            to="/dashboard"
            icon={LayoutGrid}
            label="Dashboard"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/projects"
            icon={Briefcase}
            label="Managed Portfolios"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/messages"
            icon={MessageSquare}
            label="Direct Support"
            collapsed={collapsed}
            badge={3}
          />
          <SidebarItem
            to="/invoices"
            icon={Receipt}
            label="Settlements"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/support"
            icon={Ticket}
            label="Work Tickets"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/documents"
            icon={FolderOpen}
            label="Asset Library"
            collapsed={collapsed}
          />

          <div className="pt-6 pb-2">
            {!collapsed && (
              <p className="px-5 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans">
                Account
              </p>
            )}
            <div
              className={`h-px bg-white/5 mx-5 mt-2 mb-4 ${collapsed ? 'mx-2' : ''}`}
            ></div>
          </div>

          <SidebarItem
            to="/profile"
            icon={User}
            label="Profile"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/settings"
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
          className="absolute -right-3 top-24 w-6 h-6 bg-surface border border-white/10 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-all shadow-xl z-50 hover:border-primary/50"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      <div 
        ref={mainContentRef}
        className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden overflow-y-auto bg-grid"
      >
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-text-muted hover:text-text-primary"
            >
              <Menu size={24} />
            </button>
            <nav className="hidden md:flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <Link
                to="/dashboard"
                className="text-text-muted hover:text-primary transition-colors"
              >
                Dashboard
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
              <Globe size={14} className="group-hover:text-primary transition-colors" />
              <span>Visit Website</span>
            </a>

            <ThemeToggle />

            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 px-4 py-1.5 rounded-full w-64 group focus-within:border-primary/50 transition-all">
              <Search
                size={16}
                className="text-text-muted group-focus-within:text-primary"
              />
              <input
                type="text"
                placeholder="Global search..."
                className="bg-transparent border-none outline-none text-xs text-text-primary px-2 w-full focus:ring-0"
              />
            </div>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-full transition-all"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full text-black text-[9px] font-black flex items-center justify-center shadow-glow pulse-glow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-surface border border-white/10 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden z-100 animate-in">
                  <div className="px-6 py-5 border-b border-white/5 bg-white/2 flex justify-between items-center">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-[10px] text-primary font-bold uppercase tracking-wide hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => setNotifications(notifications.map(n => n.id === note.id ? { ...n, read: true } : n))}
                        className="px-5 py-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-all cursor-pointer group"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${note.read ? 'bg-white/5' : 'bg-primary/10 text-primary'}`}
                          >
                            {note.type === 'message' && (
                              <MessageSquare size={14} />
                            )}
                            {note.type === 'file' && <FolderOpen size={14} />}
                            {note.type === 'invoice' && <Receipt size={14} />}
                            {note.type === 'ticket' && <Ticket size={14} />}
                          </div>
                          <div className="flex flex-col">
                            <p
                              className={`text-xs ${note.read ? 'text-text-muted' : 'text-text-primary font-medium'}`}
                            >
                              {note.message}
                            </p>
                            <span className="text-[10px] text-text-muted mt-1 lowercase">
                              {note.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-3 pl-4 border-l border-white/10 group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-text-primary leading-none uppercase tracking-widest group-hover:text-primary transition-colors">
                  {user?.name || 'Partner'}
                </p>
                <span className="text-[10px] text-text-muted mt-1 inline-block uppercase font-bold tracking-widest">
                  Client Partner
                </span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 hover:border-primary transition-all overflow-hidden relative">
                <img
                  src={`https://i.pravatar.cc/150?u=${user?.email}`}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-12 animate-in">{children}</main>

        <Footer className="px-12 mt-auto" />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 md:hidden" style={{ zIndex: 100 }}>
          <div 
            className="absolute inset-0 bg-background/90 backdrop-blur-lg animate-in" 
            onClick={() => setMobileOpen(false)}
          ></div>
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-surface/95 border-r border-white/5 p-6 flex flex-col z-50 animate-in slide-in-from-left shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
              <BrandLogo collapsed={false} subtitle="Client Portal" subtitleClassName="text-primary" />
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-3 -mr-3 bg-white/5 rounded-full text-text-muted hover:text-text-primary active:bg-white/10 transition-all cursor-pointer"
                aria-label="Close Mobile Menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pb-4 scrollbar-hide">
              <SidebarItem to="/dashboard" icon={LayoutGrid} label="Dashboard" collapsed={false} />
              <SidebarItem to="/projects" icon={Briefcase} label="Portfolios" collapsed={false} />
              <SidebarItem to="/messages" icon={MessageSquare} label="Support Chat" collapsed={false} badge={3} />
              <SidebarItem to="/invoices" icon={Receipt} label="Settlements" collapsed={false} />
              <SidebarItem to="/support" icon={Ticket} label="Work Tickets" collapsed={false} />
              <SidebarItem to="/documents" icon={FolderOpen} label="Asset Library" collapsed={false} />
              
              <div className="py-6">
                <div className="h-px bg-white/5"></div>
              </div>

              <p className="px-4 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans mb-3">
                Account Base
              </p>
              <SidebarItem to="/profile" icon={User} label="My Profile" collapsed={false} />
              <SidebarItem to="/settings" icon={Settings} label="Preferences" collapsed={false} />
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <Link 
                to="/profile" 
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-colors"
              >
                <img src={`https://i.pravatar.cc/150?u=${user?.email}`} className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover" alt="Profile" />
                <div>
                  <p className="text-text-primary font-bold text-sm uppercase tracking-wider leading-none truncate">{user?.name || 'Partner'}</p>
                  <span className="text-[10px] text-primary mt-2 flex uppercase font-bold tracking-widest">Client Partner</span>
                </div>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://codevertex.solutions/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-primary active:scale-95 transition-all text-center"
                >
                  <Globe size={14} className="text-primary" />
                  Website
                </a>
                <button 
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-3.5 text-red-500 bg-red-500/5 rounded-xl font-black text-[10px] uppercase tracking-widest active:bg-red-500/10 active:scale-95 transition-all text-center"
                >
                  <LogOut size={14} />
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

export default DashboardLayout;
