import { ShieldCheck, Users, HardDrive, CreditCard, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Admin() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Command Authority</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Neural <span className="neon-text italic">Control</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Global orchestration of neural resources, fiscal logic gating, and system integrity.</p>
        </div>
        <div className="flex items-center gap-4">
           <Badge className="bg-amber-500/20 text-amber-500 py-2 px-6 text-[10px] font-bold tracking-[0.3em] uppercase border border-amber-500/30">
              High Priority Session
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AdminStat icon={<Users className="w-6 h-6" />} label="Identities Managed" value="1,284" />
        <AdminStat icon={<Activity className="w-6 h-6" />} label="Neural Load" value="12%" />
        <AdminStat icon={<HardDrive className="w-6 h-6" />} label="Exabyte Storage" value="4.2 TB" />
      </div>

      <Card className="glass-card rounded-[32px] border-amber-500/20 bg-amber-500/[0.02] shadow-2xl shadow-amber-500/5">
        <CardHeader className="p-10 pb-2">
          <p className="panel-title text-amber-500 opacity-80">Protocol Gating</p>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[28px] bg-black/40 border border-white/5 transition-all group hover:border-amber-500/30">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[20px] bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-xl group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight mb-1">Fiscal Paywall Protocol</p>
                <div className="flex items-center gap-3">
                   <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">Current State:</p>
                   <span className="status-pill text-[9px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">Operational (Unlocked / Free)</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-amber-500/40 text-amber-500 hover:bg-amber-500 focus:text-black uppercase tracking-[0.3em] text-[10px] font-bold transition-all">
              Initialize Paywall
            </Button>
          </div>

          <div className="p-8 rounded-[24px] bg-amber-500/5 border border-amber-500/10 flex gap-6">
            <AlertTriangle className="w-8 h-8 text-amber-500 shrink-0 mt-1 animate-bounce" />
            <div className="space-y-2">
              <p className="text-[12px] uppercase font-bold tracking-[0.2em] text-amber-200">Critical Warning</p>
              <p className="text-sm text-amber-200/60 leading-relaxed font-medium italic">
                Activating subscription protocol will instantaneously lock features for users without Nexus authorization. Verify global fiscal links before execution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <Card className="glass-card rounded-[32px] border-white/5 bg-white/[0.02] hover:border-primary/30 transition-all duration-500 group">
      <CardContent className="p-10 flex flex-col gap-6">
        <div className="w-16 h-16 rounded-[20px] bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-xl">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-[11px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-60">{label}</p>
          <p className="text-5xl font-bold tracking-tighter group-hover:text-primary transition-colors">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
