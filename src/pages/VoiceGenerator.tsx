import { useState } from 'react';
import { 
  Mic2, 
  Sparkles, 
  User, 
  Volume2, 
  Languages, 
  Play, 
  Download,
  Smile,
  Frown,
  Zap,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function VoiceGenerator() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(45);
  const [selectedVoice, setSelectedVoice] = useState('Sarah (Calm)');

  const handleGenerate = async () => {
    if (!text.trim()) return toast.error("Please enter linguistic parameters for synthesis.");
    
    setIsGenerating(true);
    setProgress(0);
    setTimer(45);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 98 ? 98 : prev + Math.random() * 5));
        setTimer(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      await addDoc(collection(db, 'projects'), {
        userId: user?.uid,
        title: text.slice(0, 30) + '...',
        type: 'voice',
        status: 'processing',
        prompt: text,
        voice: selectedVoice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setText('');
          toast.success("Voiceover synthesis complete.");
        }, 1000);
      }, 6000);

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
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Linguistic Protocols</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Voice <span className="neon-text italic">Lab</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Synthesize high-fidelity multilingual speech with precise spectral emotion control.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card rounded-[32px] overflow-hidden border-white/5 relative">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse z-20" />
            <CardContent className="p-10 space-y-10 relative z-10">
              <div className="space-y-6">
                <p className="panel-title">Source Script</p>
                <div className="prompt-box min-h-[300px] items-start transition-all focus-within:border-primary/40 group">
                  <Volume2 className="w-6 h-6 text-primary mt-1 shrink-0 group-focus-within:animate-pulse" />
                  <textarea 
                    placeholder="TRANSMIT SCRIPT CONTENT... SUPPORTING HINDI, ENGLISH, URDU AND 50+ NEURAL LANGUAGES." 
                    className="flex-1 bg-transparent border-0 outline-none text-xl font-medium min-h-[250px] resize-none placeholder:opacity-30 placeholder:uppercase placeholder:tracking-widest"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isGenerating}
                  />
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Neural Capacity: {text.length} / 5000</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Time Prediction: {Math.ceil(text.length / 15)}s</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="panel-title">Affective State</p>
                  <div className="grid grid-cols-3 gap-3">
                    <EmotionButton icon={<Smile className="w-4 h-4" />} label="Euphoric" active />
                    <EmotionButton icon={<Frown className="w-4 h-4" />} label="Melancholic" />
                    <EmotionButton icon={<Zap className="w-4 h-4" />} label="Hyper-Active" />
                  </div>
                </div>
                <div className="space-y-6">
                  <p className="panel-title">Code Language</p>
                  <div className="flex flex-wrap gap-2">
                    {['Global EN', 'Hindi-V', 'Urdu-N', 'Spanish-X', 'French-S'].map(lang => (
                      <button key={lang} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-muted-foreground hover:text-white">
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/10">
                <Button 
                  disabled={isGenerating || !text.trim()}
                  onClick={handleGenerate}
                  className="w-full h-20 rounded-[20px] text-xs font-bold uppercase tracking-[0.4em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] group overflow-hidden relative border-0"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isGenerating ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" />
                         Spectral Synthesizing...
                       </>
                    ) : (
                      <>
                        <Mic2 className="w-5 h-5" />
                        Execute Neural Synthesis
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
                          <Mic2 className="text-primary w-8 h-8 animate-pulse" />
                          <motion.div className="absolute inset-0 bg-primary/10" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary">Spectral Formant Analysis</p>
                          <h4 className="text-3xl font-bold tracking-tight">Cloning Neural Frequency...</h4>
                          <p className="text-muted-foreground text-sm font-medium italic opacity-60">Estimated: {formatTime(timer)}</p>
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
                       <StatusStep label="Phonetics" active={progress <= 25} done={progress > 25} />
                       <StatusStep label="Prosody" active={progress > 25 && progress <= 50} done={progress > 50} />
                       <StatusStep label="Affective" active={progress > 50 && progress <= 75} done={progress > 75} />
                       <StatusStep label="Rendering" active={progress > 75} done={progress >= 100} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <p className="panel-title">Vocal Identities</p>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <VoiceSelectItem 
                name="SARAH-P" 
                desc="Executive, Cold (US)" 
                active={selectedVoice === 'Sarah (Calm)'}
                onClick={() => setSelectedVoice('Sarah (Calm)')}
              />
              <VoiceSelectItem 
                name="RAHUL-X" 
                desc="Kinetic, Broad (IN)" 
                active={selectedVoice === 'Rahul (Energetic)'}
                onClick={() => setSelectedVoice('Rahul (Energetic)')}
              />
              <VoiceSelectItem 
                name="ANYA-S" 
                desc="Ethereal, Soft (UK)" 
                active={selectedVoice === 'Anya (Soft)'}
                onClick={() => setSelectedVoice('Anya (Soft)')}
              />
              <VoiceSelectItem 
                name="ARJUN-D" 
                desc="Deep, Monolithic (IN)" 
                active={selectedVoice === 'Arjun (Deep)'}
                onClick={() => setSelectedVoice('Arjun (Deep)')}
              />
            </div>
          </div>

          <div className="p-8 rounded-[32px] glass-card border border-primary/20 bg-primary/5">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                 <CheckCircle2 className="w-5 h-5 text-primary" />
               </div>
               <h4 className="font-bold tracking-tight">Identity Cloning</h4>
             </div>
             <p className="text-xs text-muted-foreground leading-relaxed font-medium italic opacity-70">
               Upload a 30-second logic sample to clone any vocal frequency instantly. 
               <span className="text-primary cursor-pointer hover:underline block mt-3 font-bold uppercase tracking-widest">Upgrade to Nexus Plan</span>
             </p>
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

function EmotionButton({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex flex-col items-center justify-center py-4 rounded-2xl border transition-all gap-2",
      active 
        ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10" 
        : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
    )}>
      <div className={active ? "animate-bounce" : ""}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function VoiceSelectItem({ name, desc, active, onClick }: { name: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group",
        active ? "bg-black border-primary shadow-xl" : "bg-white/5 border-transparent hover:border-white/10"
      )}
    >
      <div className="flex items-center gap-5">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
          active ? "bg-primary text-black rotate-12" : "bg-white/5 text-muted-foreground group-hover:text-white"
        )}>
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight mb-0.5">{name}</p>
          <p className="text-[10px] items-center gap-2 flex uppercase font-bold tracking-widest text-muted-foreground opacity-50">
            {desc}
          </p>
        </div>
      </div>
      {active && (
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
      )}
    </div>
  );
}
