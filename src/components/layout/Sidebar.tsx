import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Music, 
  Mic2, 
  MessageSquare, 
  LayoutTemplate, 
  UserCircle, 
  Settings, 
  ShieldCheck,
  Zap,
  LogOut,
  Megaphone,
  History,
  Briefcase,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Control Center', path: '/dashboard' },
  { icon: Video, label: 'Video Gen', path: '/video' },
  { icon: Music, label: 'Music Gen', path: '/music' },
  { icon: Mic2, label: 'Voice Gen', path: '/voice' },
  { icon: Megaphone, label: 'Ad Creator', path: '/ads' },
  { icon: Briefcase, label: 'AI Meeting', path: '/meeting' },
  { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
  { icon: LayoutGrid, label: 'Gallery', path: '/gallery' },
  { icon: History, label: 'Vault', path: '/history' },
  { icon: LayoutTemplate, label: 'Templates', path: '/templates' },
];

const secondaryItems = [
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { userProfile, logout } = useAuth();

  return (
    <aside className="w-64 bg-black/40 border-r border-white/10 flex flex-col h-full z-50 backdrop-blur-xl">
      <div className="p-8">
        <Link to="/dashboard" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(0,242,255,0.3)] border border-white/10">
            G
          </div>
          <span className="text-xl font-bold tracking-[0.2em] uppercase neon-text transition-all duration-500">GoGo</span>
        </Link>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold px-2 mb-4 opacity-50">
          Main Workspace
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/5 text-primary border border-white/10" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary shadow-[0_0_10px_rgba(0,242,255,0.5)]" : "group-hover:text-white")} />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(0,242,255,0.8)]"
                />
              )}
            </Link>
          );
        })}

        <div className="pt-10">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold px-2 mb-4 opacity-50">
            Studio
          </div>
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-white/5 text-primary border border-white/10" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary" : "group-hover:text-white")} />
                <span className="text-[11px] font-bold uppercase tracking-[0.15em]">{item.label}</span>
              </Link>
            );
          })}
          
          {userProfile?.isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                location.pathname === '/admin' 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
