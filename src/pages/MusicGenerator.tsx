import { useState } from 'react';
import { 
  Music, 
  Sparkles, 
  Wand2, 
  Mic2, 
  Disc, 
  AudioWaveform, 
  Play, 
  Download,
  Clock,
  Heart,
  Loader2
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

export default function MusicGenerator() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(90);

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please provide architectural audio descriptors.");
    
    setIsGenerating(true);
    setProgress(0);
    setTimer(90);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 98 ? 98 : prev + Math.random() * 3));
        setTimer(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      await addDoc(collection(db, 'projects'), {
        userId: user?.uid,
        title: prompt.slice(0, 30) + '...',
        type: 'music',
        status: 'processing',
        prompt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setPrompt('');
          toast.success("Composition synthesized. Available in Studio Library.");
        }, 1000);
      }, 8000);

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
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Neural Audio Synthesis</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Music <span className="neon-text italic">Composer</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Engineer original algorithmic compositions and rhythmic logic. Synchronized for the next era of media.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-2xl h-14 px-8 border-white/10 hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] font-bold">
            <Clock className="mr-3 w-4 h-4" />
            History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card rounded-[32px] overflow-hidden border-white/5 relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse z-20" />
            <CardContent className="p-10 space-y-10 relative z-10">
              <div className="space-y-6">
                <p className="panel-title">Acoustic Parameters</p>
                <div className="prompt-box min-h-[200px] items-start transition-all focus-within:border-primary/40 group">
                  <AudioWaveform className="w-6 h-6 text-primary mt-1 shrink-0 group-focus-within:animate-pulse" />
                  <textarea 
                    placeholder="DEFINE SONIC SPACE: A HIGH-TEMPO NEURAL SYNTHWAVE TRACK, HEAVY SIDECHAIN, ANALOG WARMTH, HINDI FUTURISTIC LYRICS..." 
                    className="flex-1 bg-transparent border-0 outline-none text-xl font-medium min-h-[160px] resize-none placeholder:opacity-30 placeholder:uppercase placeholder:tracking-widest"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="panel-title">Genre Matrix</p>
                  <div className="flex flex-wrap gap-2">
                    {['Lofi', 'Neural Rap', 'Ambient', 'Synthwave', 'EDM', 'Vocalic'].map(genre => (
                      <button key={genre} className="px-5 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-muted-foreground hover:text-white">
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="panel-title mb-0">Tempo Sync</p>
                    <span className="text-[10px] font-bold font-mono text-primary tracking-widest">128 BPM</span>
                  </div>
                  <Slider defaultValue={[120]} max={200} min={60} step={1} className="py-4" />
                </div>
              </div>

              <div className="pt-10 border-t border-white/10">
                <Button 
                  disabled={isGenerating || !prompt.trim()}
                  onClick={handleGenerate}
                  className="w-full h-20 rounded-[20px] text-xs font-bold uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] group overflow-hidden relative border-0"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isGenerating ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" />
                         Synthesizing Harmonics...
                       </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Execute Strategic Composition
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-primary group-hover:bg-secondary transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
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
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full"
                      initial={{ x: Math.random() * 100 + "%", y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: [0, 1, 0] }}
                      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
                    />
                  ))}
                </div>

                <Card className="glass-card border-primary/40 rounded-[32px] bg-black/60 backdrop-blur-3xl overflow-hidden shadow-[0_0_60px_rgba(0,242,255,0.15)] relative z-10">
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center relative group">
                          <AudioWaveform className="text-primary w-8 h-8 animate-pulse" />
                          <motion.div className="absolute inset-0 bg-primary/10" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary">Neural Harmonic Analysis</p>
                          <h4 className="text-3xl font-bold tracking-tight">Synthesizing AI Song...</h4>
                          <p className="text-muted-foreground text-sm font-medium italic opacity-60">Wait time: {formatTime(timer)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-5xl text-primary font-bold tracking-tighter tabular-nums">{Math.round(progress)}%</span>
                      </div>
                    </div>

                    <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-12">
                      <motion.div className="absolute h-full bg-primary" animate={{ width: `${progress}%` }} />
                      <motion.div 
                        className="absolute inset-y-0 w-24 bg-white/20 skew-x-[-30deg]"
                        animate={{ left: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                       <StatusStep label="Structure" active={progress <= 25} done={progress > 25} />
                       <StatusStep label="Melody Gen" active={progress > 25 && progress <= 50} done={progress > 50} />
                       <StatusStep label="Atmosphere" active={progress > 50 && progress <= 75} done={progress > 75} />
                       <StatusStep label="Mastering" active={progress > 75} done={progress >= 100} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <p className="panel-title">Archives</p>
            <div className="space-y-3">
              <SongItem title="Cyberpunk Drift" artist="Neural Unit 01" duration="3:24" />
              <SongItem title="Monsoon Rain" artist="Neural Unit 01" duration="2:45" />
              <SongItem title="Midnight Seoul" artist="Neural Unit 02" duration="4:02" />
            </div>
          </div>

          <div className="p-8 rounded-[24px] bg-secondary/5 border border-secondary/10 flex gap-5">
            <Heart className="w-6 h-6 text-secondary shrink-0 mt-1 fill-secondary animate-pulse" />
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Synchronized State</p>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                Our AI automatically synchronizes music beats with scene transitions when coupled with the Video Architect.
              </p>
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

function SongItem({ title, artist, duration }: { title: string, artist: string, duration: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all shadow-xl">
          <Play className="w-5 h-5 fill-white group-hover:fill-black text-transparent" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight mb-0.5">{title}</p>
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-50">{artist}</p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <span className="text-[10px] font-bold font-mono text-muted-foreground opacity-30">{duration}</span>
        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 rounded-xl">
          <Download className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
