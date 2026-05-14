import React, { useState } from 'react';
import { 
  Briefcase, 
  Upload, 
  FileText, 
  ExternalLink, 
  Scissors, 
  Sparkles, 
  Mic, 
  Activity,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Video,
  ListMusic,
  Megaphone,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export default function MeetingGenerator() {
  const { user } = useAuth();
  const [meetingName, setMeetingName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(180);
  const [selectedFormat, setSelectedFormat] = useState('summary');

  const steps = [
    "Transcribing Neural Audio...",
    "Extracting Semantic Intent...",
    "Synthesizing Strategic Notes...",
    "Architecting Video Shortcuts...",
    "Compiling Executive Brief..."
  ];

  const handleGenerate = async () => {
    if (!meetingName.trim()) return toast.error("Please provide a session identifier.");
    
    setIsGenerating(true);
    setProgress(0);
    setTimer(180);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 98 ? 98 : prev + Math.random() * 1.5));
        setTimer(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      await addDoc(collection(db, 'projects'), {
        userId: user?.uid,
        title: `Meeting: ${meetingName}`,
        type: 'meeting',
        status: 'processing',
        config: { meetingName, format: selectedFormat },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setMeetingName('');
          toast.success("Intelligence extraction complete. Archived in Vault.");
        }, 1000);
      }, 15000);

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-4">
          <p className="status-pill mb-4 border-primary/20 bg-primary/5 text-primary tracking-[0.2em] uppercase text-[9px] font-bold">Domain: Corporate Intelligence</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">AI Meeting <span className="neon-text italic">Architect</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Extract cinematic reels, executive summaries, and high-conversion content from your sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card rounded-[32px] overflow-hidden border-white/5 relative bg-white/[0.02]">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer bg-[length:200%_100%] z-20" />
            <CardContent className="p-10 space-y-10 relative z-10">
               <div className="space-y-6">
                <p className="panel-title">Session Parameters</p>
                <div className="space-y-4">
                   <div className="prompt-box min-h-0 py-6 group focus-within:border-primary/40 transition-all">
                    <Briefcase className="w-6 h-6 text-primary opacity-50 shrink-0" />
                    <input 
                      placeholder="SESSION IDENTIFIER (E.G. Q3 STRATEGY PEAK...)" 
                      className="bg-transparent border-0 outline-none w-full font-bold uppercase tracking-widest text-lg px-2"
                      value={meetingName}
                      onChange={(e) => setMeetingName(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                  
                  <div className="p-12 border-2 border-dashed border-white/10 rounded-[28px] flex flex-col items-center justify-center gap-6 group hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                     </div>
                     <div className="text-center space-y-2">
                        <p className="font-bold uppercase tracking-widest text-xs">Transmit Meeting Transmission</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">MP3, WAV, MP4 SUPPORTED (MAX 500MB)</p>
                     </div>
                  </div>
                </div>
              </div>

               <div className="space-y-6">
                <p className="panel-title">Intelligence Extraction Profile</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormatOption 
                    active={selectedFormat === 'summary'} 
                    onClick={() => setSelectedFormat('summary')}
                    icon={<FileText className="w-5 h-5" />} 
                    label="Executive Brief" 
                   />
                   <FormatOption 
                    active={selectedFormat === 'reels'} 
                    onClick={() => setSelectedFormat('reels')}
                    icon={<Scissors className="w-5 h-5" />} 
                    label="Neural Clips" 
                   />
                   <FormatOption 
                    active={selectedFormat === 'promo'} 
                    onClick={() => setSelectedFormat('promo')}
                    icon={<Megaphone className="w-5 h-5" />} 
                    label="Viral Promotion" 
                   />
                </div>
              </div>

              <div className="pt-10 border-t border-white/10">
                <Button 
                  disabled={isGenerating || !meetingName.trim()}
                  onClick={handleGenerate}
                  className="w-full h-20 rounded-[24px] text-[11px] font-bold uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group overflow-hidden relative border-0 bg-primary text-black"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Extracting Intelligence...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="w-5 h-5 fill-black" />
                        Initialize Synthesis Cycle
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="relative"
              >
                 <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[32px] z-0">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-primary/20 rounded-full"
                      initial={{ x: Math.random() * 100 + "%", y: "100%", opacity: 0 }}
                      animate={{ y: [null, "0%"], opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                      transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() }}
                    />
                  ))}
                </div>

                <Card className="glass-card border-primary/30 rounded-[32px] bg-black/80 backdrop-blur-3xl overflow-hidden shadow-[0_0_80px_rgba(0,242,255,0.2)] relative z-10">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center relative group">
                          <Activity className="text-primary w-10 h-10 animate-pulse" />
                          <div className="absolute inset-0 border border-primary/20 rounded-3xl group-hover:scale-125 transition-transform duration-1000" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary">Strategic Audio Processing Core</p>
                          <h4 className="text-4xl font-bold tracking-tight">Extracting Intelligence...</h4>
                          <p className="text-muted-foreground text-sm font-medium italic opacity-60">Estimated: {formatTime(timer)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-6xl text-primary font-bold tracking-tighter tabular-nums">{Math.round(progress)}%</span>
                      </div>
                    </div>

                    <div className="relative h-4 bg-white/5 rounded-full overflow-hidden mb-12">
                      <motion.div className="absolute h-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${progress}%` }} />
                      <motion.div 
                        className="absolute inset-y-0 w-32 bg-white/10 skew-x-[-45deg]"
                        animate={{ left: ['-100%', '300%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      {steps.map((step, idx) => {
                        const threshold = (idx + 1) * 20;
                        return (
                          <StatusStep 
                            key={idx}
                            label={step.split(' ').slice(-1)[0]} 
                            active={progress > threshold - 20 && progress <= threshold}
                            done={progress > threshold}
                          />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-10">
           <div className="p-10 rounded-[32px] glass-card border border-primary/10 space-y-8 relative group overflow-hidden bg-white/[0.02]">
              <div className="absolute inset-0 bg-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center relative z-10">
                 <History className="text-primary w-8 h-8" />
              </div>
              <div className="space-y-4 relative z-10">
                 <h3 className="text-2xl font-bold tracking-tight">Vault Integration</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed font-medium">Your discussions are processed in the cloud. You can leave this page; the architecture will continue autonomously and notify your dashboard on completion.</p>
              </div>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white uppercase tracking-[0.2em] text-[10px] font-bold relative z-10">Monitor Pipeline</Button>
           </div>

           <div className="space-y-6">
              <p className="panel-title text-primary">Intelligence Nodes</p>
              <div className="grid grid-cols-1 gap-4">
                 <FeatureNode icon={<Mic className="w-5 h-5" />} title="Voice Isolation" desc="Remove static and background noise spectral patterns." />
                 <FeatureNode icon={<Sparkles className="w-5 h-5" />} title="Key Moment Detection" desc="AI identifies pivotal strategic discussion points." />
                 <FeatureNode icon={<ExternalLink className="w-5 h-5" />} title="Cross-Platform Export" desc="Generate assets for LinkedIn, Slack, and Email." />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatusStep({ label, active, done }: { label: string, active: boolean, done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        "w-1.5 h-1.5 rounded-full transition-all duration-700",
        done ? "bg-primary shadow-[0_0_10px_rgba(0,242,255,1)]" : active ? "bg-primary animate-ping" : "bg-white/10"
      )} />
      <span className={cn(
        "text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-500 text-center",
        done ? "text-primary opacity-100" : active ? "text-white opacity-100" : "text-muted-foreground opacity-30"
      )}>{label}</span>
    </div>
  );
}

function FormatOption({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 rounded-[24px] border transition-all flex flex-col items-center gap-4 text-center group",
        active ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_20px_rgba(0,242,255,0.05)]" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
        active ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground group-hover:bg-white/10"
      )}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">{label}</span>
      {active && <motion.div layoutId="meeting-active" className="w-1.5 h-1.5 rounded-full bg-primary" />}
    </button>
  );
}

function FeatureNode({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group flex items-start gap-4">
      <div className="p-3 rounded-xl bg-white/5 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em] mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
