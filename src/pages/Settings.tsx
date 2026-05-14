import { Settings as SettingsIcon, Bell, Shield, Wallet, Languages, Moon, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Workspace Orchestration</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">System <span className="neon-text italic">Matrix</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Configure neural environment parameters and authorization layers.</p>
        </div>
      </div>

      <div className="space-y-10">
        <Card className="glass-card rounded-[32px] border-white/5 bg-white/[0.02]">
          <CardHeader className="p-10 pb-2">
            <p className="panel-title">Neural Preferences</p>
          </CardHeader>
          <CardContent className="p-10 space-y-2">
            <SettingRow 
              icon={<Moon className="w-5 h-5" />} 
              title="Chromesthesia Mode" 
              desc="High-contrast darkness synchronized with retinal efficiency." 
              checked={true} 
              disabled={true}
            />
            <SettingRow 
              icon={<Bell className="w-5 h-5" />} 
              title="Logic completion alerts" 
              desc="Acknowledge completion of autonomous synthesis cycles via neural mail." 
              checked={true} 
            />
            <SettingRow 
              icon={<Cpu className="w-5 h-5" />} 
              title="Quantum Acceleration" 
              desc="Optimize processing throughput for real-time visualization." 
              checked={false} 
            />
          </CardContent>
        </Card>

        <Card className="glass-card rounded-[32px] border-white/5 bg-white/[0.02]">
          <CardHeader className="p-10 pb-2">
            <p className="panel-title">Neural Integrations</p>
          </CardHeader>
          <CardContent className="p-10 space-y-8">
            <APIKeyInput label="OpenAI API" value="sk-••••••••••••••••" />
            <APIKeyInput label="Runway Gen-3 Alpha" value="••••••••••••••••" />
            <APIKeyInput label="ElevenLabs Neural" value="••••••••••••••••" />
            <APIKeyInput label="Suno Algorithmic" value="••••••••••••••••" />
            <APIKeyInput label="Pika Laboratory" value="••••••••••••••••" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function APIKeyInput({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
        <span className="text-[9px] font-bold text-primary tracking-widest uppercase">Connected</span>
      </div>
      <div className="relative group">
        <input 
          type="password" 
          value={value} 
          readOnly 
          className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-sm font-mono tracking-widest focus:outline-none focus:border-primary/40 transition-all" 
        />
        <Button variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white/10">Configure</Button>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, desc, checked, disabled }: { icon: React.ReactNode, title: string, desc: string, checked?: boolean, disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between py-6 group">
      <div className="flex gap-6">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0 group-hover:border-primary/30 transition-all duration-500">
          <div className="text-white/40 group-hover:text-primary transition-colors">{icon}</div>
        </div>
        <div className="space-y-1">
          <p className="text-xl font-bold tracking-tight">{title}</p>
          <p className="text-sm text-muted-foreground font-medium italic opacity-60 leading-relaxed">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} disabled={disabled} className="data-[state=checked]:bg-primary" />
    </div>
  );
}
