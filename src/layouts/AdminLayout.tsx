import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid,
  Briefcase,
  MessageSquare,
  Receipt,
  Ticket,
  Video,
  Shield,
  Settings,
  Users,
  BarChart3,
  BookOpen,
  LifeBuoy,
  Banknote,
  UserCheck,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
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
            ? 'bg-[#00CFFF]/10 text-[#00CFFF] border-l-4 border-[#00CFFF] shadow-[inset_4px_0_0_0_#00CFFF]'
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
        <span className="ml-auto bg-[#00CFFF] text-black text-[10px] px-2 py-0.5 rounded-full font-black">
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

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Client Registration', desc: 'Enterprise LLC submitted a profile.', time: '10m ago', unread: true },
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

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (mainContentRef.current) {
        mainContentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background font-body text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-white/5 bg-surface transition-all duration-300 relative z-40 ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="p-6 mb-8 mt-2">
          <Link
            to="/admin/dashboard"
            className={`block ${collapsed ? 'flex justify-center transition-all' : ''}`}
          >
            <BrandLogo
              collapsed={collapsed}
              subtitle="Admin Panel"
              subtitleClassName="text-[#00CFFF]"
            />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <SidebarItem
            to="/admin/dashboard"
            icon={LayoutGrid}
            label="Dashboard"
            collapsed={collapsed}
          />

          <div className="pt-6 pb-2">
            {!collapsed && (
              <p className="px-5 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans">
                Administration
              </p>
            )}
            <div
              className={`h-px bg-white/5 mx-5 mt-2 mb-4 ${collapsed ? 'mx-2' : ''}`}
            ></div>
          </div>

          <SidebarItem
            to="/admin/clients"
            icon={Users}
            label="Clients"
            collapsed={collapsed}
            badge={3}
          />
          <SidebarItem
            to="/admin/team"
            icon={UserCheck}
            label="Internal Team"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/users"
            icon={Shield}
            label="User Access"
            collapsed={collapsed}
          />

          <div className="pt-6 pb-2">
            {!collapsed && (
              <p className="px-5 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans">
                Projects
              </p>
            )}
            <div
              className={`h-px bg-white/5 mx-5 mt-2 mb-4 ${collapsed ? 'mx-2' : ''}`}
            ></div>
          </div>

          <SidebarItem
            to="/admin/projects"
            icon={Briefcase}
            label="Portfolio Management"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/analysis"
            icon={BarChart3}
            label="Project Analysis"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/messages"
            icon={MessageSquare}
            label="Communications"
            collapsed={collapsed}
            badge={5}
          />
          <SidebarItem
            to="/admin/invoices"
            icon={Receipt}
            label="Invoices & Billing"
            collapsed={collapsed}
          />

          <div className="pt-6 pb-2">
            {!collapsed && (
              <p className="px-5 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans">
                Support
              </p>
            )}
            <div
              className={`h-px bg-white/5 mx-5 mt-2 mb-4 ${collapsed ? 'mx-2' : ''}`}
            ></div>
          </div>

          <SidebarItem
            to="/admin/tickets"
            icon={Ticket}
            label="Support Tickets"
            collapsed={collapsed}
            badge={2}
          />
          <SidebarItem
            to="/admin/meetings"
            icon={Video}
            label="Meetings"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/policies"
            icon={Shield}
            label="Legal & Contracts"
            collapsed={collapsed}
          />
          <SidebarItem
            to="/admin/settings"
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

      {/* Main Content Area */}
      <div 
        ref={mainContentRef}
        className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden overflow-y-auto bg-grid"
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-text-muted hover:text-text-primary"
            >
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md">
              <AlertTriangle size={14} className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                Admin Oversight Mode
              </span>
            </div>

            <nav className="hidden lg:flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
              <Link
                to="/admin/dashboard"
                className="hover:text-[#00CFFF] transition-colors"
              >
                Core
              </Link>
              <span className="mx-3 text-text-primary/10">/</span>
              <span className="text-text-primary">
                {location.pathname.split('/').pop()?.replace(/-/g, ' ')}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://codevertex.solutions/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary hover:bg-white/10 transition-all group"
            >
              <Globe size={14} className="group-hover:text-[#00CFFF] transition-colors" />
              <span>Visit Website</span>
            </a>
            
            <ThemeToggle />

            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-full transition-all">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#00CFFF] rounded-full text-black text-[9px] font-black flex items-center justify-center shadow-glow pulse-glow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl border shadow-[0_0_20px_rgba(0,0,0,0.5)] border-white/10 overflow-hidden z-50 animate-in">
                  <div className="p-4 border-b border-white/5 bg-white/2 flex justify-between items-center">
                    <h3 className="text-text-primary font-bold">Notifications</h3>
                    <span className="text-[10px] text-black bg-[#00CFFF] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{unreadCount} New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} 
                           onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n))}
                           className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-[#00CFFF]/5' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-xs font-bold ${notif.unread ? 'text-[#00CFFF]' : 'text-text-primary'}`}>{notif.title}</p>
                          <span className="text-[10px] text-text-muted">{notif.time}</span>
                        </div>
                        <p className="text-xs text-text-muted">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-white/5 bg-surface text-center flex justify-between px-6">
                    <button onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))} className="text-[10px] text-text-muted hover:text-[#00CFFF] uppercase tracking-widest font-bold transition-colors">Mark all as read</button>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] text-text-muted hover:text-text-primary uppercase tracking-widest font-bold transition-colors">Close</button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/admin/settings" className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-text-primary leading-none uppercase tracking-widest">
                  {user?.name || 'Admin User'}
                </p>
                <span className="text-[10px] text-[#00CFFF] mt-1 inline-block font-bold">
                  Platform Architect
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl border-2 border-[#00CFFF]/20 p-0.5 hover:border-[#00CFFF] transition-all cursor-pointer overflow-hidden">
                <img
                  src={`https://i.pravatar.cc/150?u=${user?.email}`}
                  alt="Avatar"
                  className="w-full h-full rounded-lg object-cover"
                />
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 lg:p-12">{children}</main>
        <Footer className="px-12" />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-99 md:hidden">
          <div 
            className="absolute inset-0 bg-background/90 backdrop-blur-lg animate-in fade-in duration-300" 
            onClick={() => setMobileOpen(false)}
          ></div>
          <aside className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-surface/95 border-r border-white/5 p-6 flex flex-col z-50 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
              <BrandLogo collapsed={false} subtitle="Admin Panel" subtitleClassName="text-[#00CFFF]" />
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-3 -mr-3 bg-white/5 rounded-full text-text-muted hover:text-text-primary active:bg-white/10 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto pb-4 scrollbar-hide">
              <SidebarItem to="/admin/dashboard" icon={LayoutGrid} label="Dashboard" collapsed={false} />
              
              <div className="py-6">
                <div className="h-px bg-white/5"></div>
              </div>
              <p className="px-4 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans mb-3">
                Administration
              </p>

              <SidebarItem to="/admin/clients" icon={Users} label="Clients" collapsed={collapsed} />
              <SidebarItem to="/admin/team" icon={UserCheck} label="Internal Team" collapsed={collapsed} />
              <SidebarItem to="/admin/users" icon={Shield} label="Users Control" collapsed={collapsed} />
              
              <div className="py-6">
                <div className="h-px bg-white/5"></div>
              </div>
              <p className="px-4 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans mb-3">
                Projects
              </p>

              <SidebarItem to="/admin/projects" icon={Briefcase} label="Portfolio Management" collapsed={false} />
              <SidebarItem to="/admin/analysis" icon={BarChart3} label="Project Analysis" collapsed={false} />
              <SidebarItem to="/admin/messages" icon={MessageSquare} label="Communications" collapsed={false} badge={5} />
              <SidebarItem to="/admin/invoices" icon={Banknote} label="Invoices & Billing" collapsed={false} />
              
              <div className="py-6">
                <div className="h-px bg-white/5"></div>
              </div>
              <p className="px-4 text-[10px] text-text-muted uppercase font-black tracking-widest font-sans mb-3">
                Support
              </p>

              <SidebarItem to="/admin/tickets" icon={LifeBuoy} label="Support Tickets" collapsed={false} badge={2} />
              <SidebarItem to="/admin/meetings" icon={Video} label="Meetings" collapsed={false} />
              <SidebarItem to="/admin/policies" icon={BookOpen} label="Policies" collapsed={false} />
              <SidebarItem to="/admin/settings" icon={Settings} label="Settings" collapsed={false} />
            </nav>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <Link 
                to="/admin/settings" 
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 active:bg-white/10 transition-colors"
              >
                <img src={`https://i.pravatar.cc/150?u=${user?.email}`} className="w-12 h-12 rounded-full border-2 border-[#00CFFF]/20 object-cover" alt="" />
                <div>
                  <p className="text-text-primary font-bold text-sm uppercase tracking-wider leading-none truncate">{user?.name || 'Architect'}</p>
                  <span className="text-[10px] text-[#00CFFF] mt-2 flex uppercase font-bold tracking-widest">Platform Architect</span>
                </div>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://codevertex.solutions/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-3.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-primary active:scale-95 transition-all text-center"
                >
                  <Globe size={14} className="text-[#00CFFF] shrink-0" />
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

export default AdminLayout;
