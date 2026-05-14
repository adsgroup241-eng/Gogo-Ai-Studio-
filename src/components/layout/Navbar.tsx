import { Bell, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { userProfile } = useAuth();

  return (
    <header className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-96 max-w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
          <input 
            type="text" 
            placeholder="SEARCH PROJECTS OR ASSETS..." 
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold tracking-[0.2em] focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all uppercase"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-2xl hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
        </Button>
        
        <div className="h-10 w-[1px] bg-white/10" />

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-1 leading-none">{userProfile?.displayName || 'STUDIO USER'}</p>
            <div className="flex items-center justify-end gap-2">
              <span className="status-pill leading-none">{userProfile?.plan || 'BETA'} PLAN</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-md opacity-20 rounded-full group-hover:opacity-40 transition-opacity" />
            <Avatar className="w-10 h-10 border border-white/10 shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-300">
              <AvatarImage src={userProfile?.photoURL} />
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {userProfile?.displayName ? userProfile.displayName.charAt(0) : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
