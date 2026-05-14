import { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Wand2, 
  Upload, 
  Clapperboard, 
  History,
  Play,
  Monitor,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Megaphone,
  Zap,
  Stars
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function VideoGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [useSubtitles, setUseSubtitles] = useState(true);
  const [modelType, setModelType] = useState('cinematic');

  const [timer, setTimer] = useState(150); // 2.5 minutes in seconds

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a strategic prompt.");
    
    setIsGenerating(true);
    setProgress(0);
    setTimer(150);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 98 ? 98 : prev + Math.random() * 2));
        setTimer(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      await addDoc(collection(db, 'projects'), {
        userId: user?.uid,
        title: prompt.slice(0, 30) + '...',
        type: modelType === 'reels' ? 'tiktok' : 'video',
        status: 'processing',
        prompt,
        aspectRatio,
        config: { useSubtitles, modelType },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setPrompt('');
          toast.success("Strategic synthesis complete. Project archived in Vault.");
        }, 1000);
      }, 15000);

    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
      setIsGenerating(false);
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
        <div className="space-y-2">
          <p className="status-pill mb-4 border-primary/20 bg-primary/5 text-primary tracking-[0.2em] uppercase text-[9px] font-bold">Neural Core: Video Synthesis</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Universal <span className="neon-text italic">Studio</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Professional grade AI Video, Reels, and Cinematic content architected through advanced semantic logic.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <ModeTab active={modelType === 'cinematic'} label="Cinematic Creator" icon={<Clapperboard className="w-4 h-4" />} onClick={() => setModelType('cinematic')} />
            <ModeTab active={modelType === 'reels'} label="TikTok/Reels Gen" icon={<Smartphone className="w-4 h-4" />} onClick={() => { setModelType('reels'); setAspectRatio('9:16'); }} />
            <ModeTab active={modelType === 'ad'} label="Ad Video Engine" icon={<Megaphone className="w-4 h-4" />} onClick={() => setModelType('ad')} />
          </div>

          <Card className="glass-card rounded-[32px] overflow-hidden border-white/5 relative bg-white/[0.02]">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer bg-[length:200%_100%] z-20" />
            <CardContent className="p-10 space-y-10 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="panel-title">System Prompting</p>
                  <Button variant="ghost" className="text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5">
                    <Wand2 className="w-3.5 h-3.5 mr-2" />
                    Neural Enhance
                  </Button>
                </div>
                <div className="prompt-box min-h-[200px] items-start transition-all focus-within:border-primary/40 group">
                  <Clapperboard className="w-6 h-6 text-primary mt-1 shrink-0 group-focus-within:animate-pulse" />
                  <textarea 
                    placeholder={modelType === 'reels' ? "DESCRIBE YOUR VIRAL TIKTOK/REEL: A FAST-PACED TECH UNBOXING WITH DYNAMIC CAMERA MOVES..." : "DEFINE SYSTEM PARAMETERS: A HYPER-REALISTIC CINEMATIC EXPLOSION IN SLOW MOTION, NEON LIGHTING, 8K RESOLUTION..."} 
                    className="flex-1 bg-transparent border-0 outline-none text-xl font-medium min-h-[160px] resize-none text-lg leading-relaxed"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="panel-title">Resolution Tier</p>
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-muted-foreground">720p</button>
                    <button className="px-5 py-2.5 rounded-xl border-2 border-primary text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary shadow-[0_0_15px_rgba(0,242,255,0.2)]">1080p Ultra</button>
                    <button className="px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest opacity-30 cursor-not-allowed">4K PRO</button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="panel-title mb-0 text-[10px]">Logical Sequence Length</p>
                    <span className="text-[10px] font-bold font-mono text-primary tracking-widest">10 SECONDS</span>
                  </div>
                  <Slider defaultValue={[10]} max={15} step={1} className="py-4" />
                </div>
              </div>

              <div className="flex items-center gap-8 py-6 border-y border-white/5">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setUseSubtitles(!useSubtitles)}>
                   <div className={cn(
                    "w-10 h-6 rounded-full transition-all duration-300 relative border-2",
                    useSubtitles ? "bg-primary border-primary" : "bg-white/5 border-white/10"
                   )}>
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 bg-white",
                        useSubtitles ? "left-[1.125rem]" : "left-0.5"
                      )} />
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">Auto Subtitle Synthesis</span>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  disabled={isGenerating || !prompt.trim()}
                  onClick={handleGenerate}
                  className="w-full h-20 rounded-[28px] text-[11px] font-bold uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group overflow-hidden relative border-0 bg-primary text-black"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Rendering Logic Flow...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-black" />
                        Execute Studio Deployment
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-white/30 skew-x-[-45deg] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700" />
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
                {/* Cinematic Particle Background */}
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
                          <Stars className="text-primary w-10 h-10 animate-pulse" />
                          <div className="absolute inset-0 border border-primary/20 rounded-3xl group-hover:scale-125 transition-transform duration-1000" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary">Neural Rendering Core Active</p>
                          <h4 className="text-4xl font-bold tracking-tight">Generating AI Video...</h4>
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

                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                       <StatusStep label="Scripting" active={progress <= 15} done={progress > 15} />
                       <StatusStep label="Vocalizing" active={progress > 15 && progress <= 30} done={progress > 30} />
                       <StatusStep label="Harmonizing" active={progress > 30 && progress <= 45} done={progress > 45} />
                       <StatusStep label="Rendering" active={progress > 45 && progress <= 75} done={progress > 75} />
                       <StatusStep label="Subtitles" active={progress > 75 && progress <= 90} done={progress > 90} />
                       <StatusStep label="Finalizing" active={progress > 90} done={progress >= 100} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-10">
           <div className="space-y-6">
            <p className="panel-title text-primary">Spatial Geometry</p>
            <div className="grid grid-cols-1 gap-4">
              <RatioButton 
                active={aspectRatio === '16:9'} 
                onClick={() => setAspectRatio('16:9')}
                icon={<Monitor className="w-5 h-5" />}
                label="Full Cinematic"
                ratio="16:9"
              />
              <RatioButton 
                active={aspectRatio === '9:16'} 
                onClick={() => setAspectRatio('9:16')}
                icon={<Smartphone className="w-5 h-5" />}
                label="Reel / TikTok"
                ratio="9:16"
              />
              <RatioButton 
                active={aspectRatio === '1:1'} 
                onClick={() => setAspectRatio('1:1')}
                icon={<Clapperboard className="w-5 h-5" />}
                label="Social Square"
                ratio="1:1"
              />
              <RatioButton 
                active={aspectRatio === '2.39:1'} 
                onClick={() => setAspectRatio('2.39:1')}
                icon={<Monitor className="w-5 h-5" />}
                label="Anamorphic Ultra"
                ratio="2.39:1"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="panel-title text-primary">Style Archetypes</p>
            <div className="space-y-3">
              <StylePreset label="Hyper-Real Cinematic" active />
              <StylePreset label="Futuristic Cyberpunk" />
              <StylePreset label="Vintage 35mm Film" />
              <StylePreset label="Anime Fusion Gear" />
              <StylePreset label="Liquid Motion Art" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeTab({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-8 py-3 rounded-2xl whitespace-nowrap transition-all uppercase tracking-[0.2em] text-[10px] font-bold border",
        active ? "bg-primary text-black border-primary shadow-[0_0_30px_rgba(0,242,255,0.2)]" : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
      )}
    >
      {icon}
      {label}
    </button>
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

function RatioButton({ active, onClick, icon, label, ratio }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, ratio: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl border flex flex-col items-center gap-4 transition-all duration-300",
        active ? "bg-primary/10 border-primary/50 text-white shadow-[0_0_30px_rgba(0,242,255,0.05)]" : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
      )}
    >
      <div className={cn("p-3 rounded-xl transition-colors", active ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground")}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[10px] font-mono opacity-50">{ratio}</p>
      </div>
    </button>
  );
}

function StylePreset({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className={cn(
      "px-6 py-4 rounded-xl border transition-all cursor-pointer group flex items-center justify-between",
      active ? "bg-primary/10 border-primary/30" : "bg-white/5 border-white/5 hover:border-primary/30"
    )}>
      <span className={cn(
        "text-[11px] font-bold uppercase tracking-widest transition-colors",
        active ? "text-white" : "text-muted-foreground group-hover:text-white"
      )}>{label}</span>
      <div className={cn(
        "w-1.5 h-1.5 rounded-full transition-all",
        active ? "bg-primary shadow-[0_0_8px_rgba(0,242,255,0.8)]" : "bg-white/10 group-hover:bg-primary group-hover:shadow-[0_0_8px_rgba(0,242,255,0.8)]"
      )} />
    </div>
  );
}
