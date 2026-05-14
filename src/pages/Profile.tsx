import { UserCircle, Mail, Calendar, Shield, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Profile() {
  const { userProfile } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col items-center text-center space-y-8 pt-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-1000" />
          <Avatar className="w-48 h-48 border-8 border-white/5 shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105">
            <AvatarImage src={userProfile?.photoURL} />
            <AvatarFallback className="text-6xl font-bold bg-black">{userProfile?.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
            <Badge className="bg-primary text-black py-2 px-6 text-[10px] font-bold tracking-[0.3em] uppercase border-0 shadow-2xl">
              {userProfile?.plan} PROTOCOL
            </Badge>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[12px] uppercase tracking-[0.5em] text-primary font-bold opacity-60">Identity Matrix</p>
          <h1 className="text-6xl font-bold tracking-tighter">{userProfile?.displayName}</h1>
          <p className="text-xl text-muted-foreground font-medium opacity-60 italic">{userProfile?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="glass-card rounded-[32px] border-white/5 bg-white/[0.02]">
          <CardHeader className="pb-2">
            <p className="panel-title">System Credentials</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <InfoItem icon={<Mail className="w-5 h-5" />} label="Digital Mail" value={userProfile?.email} />
            <InfoItem icon={<Calendar className="w-5 h-5" />} label="Manifested" value={userProfile?.createdAt ? new Date(userProfile?.createdAt?.seconds * 1000).toLocaleDateString() : 'INITIAL'} />
            <InfoItem icon={<UserCircle className="w-5 h-5" />} label="Neural ID" value={userProfile?.uid?.slice(0, 12) + '...'} />
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[32px] border-white/5 bg-white/[0.02] flex flex-col">
          <CardHeader className="pb-2">
            <p className="panel-title">Protocol Status</p>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-8">
            <div className="p-10 rounded-[28px] bg-black/40 border border-white/5 flex flex-col items-center text-center gap-6 group hover:border-primary/30 transition-all">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center relative overflow-hidden">
                <Sparkles className="w-10 h-10 text-primary relative z-10 animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-widest">{userProfile?.plan} Tier</h3>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mt-2 opacity-60">Active Session : 2026</p>
              </div>
            </div>
            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] font-bold">Manage Authorization</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 group">
      <div className="flex items-center gap-4 text-muted-foreground group-hover:text-primary transition-colors">
        <div className="text-white/40 group-hover:text-primary transition-colors">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{label}</span>
      </div>
      <span className="text-sm font-bold font-mono tracking-tighter text-white/90 group-hover:text-white transition-colors">{value || 'N/A'}</span>
    </div>
  );
}
