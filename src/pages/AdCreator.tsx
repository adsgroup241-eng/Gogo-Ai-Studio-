import { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Target, 
  BarChart3, 
  History,
  Layout,
  MousePointer2,
  Share2,
  Loader2,
  BrainCircuit,
  Stars,
  Zap,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdCreator() {
  const { user } = useAuth();
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [tone, setTone] = useState('professional');
  const [objective, setObjective] = useState('awareness');
  const [duration, setDuration] = useState('30s');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(120);

  const steps = [
    "Analyzing Product DNA...",
    "Defining Audience Psychographics...",
    "Drafting Strategic Hooks...",
    "Compiling Visual Storyboard...",
    "Finalizing High-Conversion Assets..."
  ];

  const handleGenerate = async () => {
    if (!productName.trim() || !productDesc.trim()) {
      return toast.error("Please provide strategic product parameters.");
    }
    
    setIsGenerating(true);
    setProgress(0);
    setTimer(120);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 98 ? 98 : prev + Math.random() * 2));
        setTimer(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      await addDoc(collection(db, 'projects'), {
        userId: user?.uid,
        title: `Ad: ${productName}`,
        type: 'ad',
        status: 'processing',
        config: { productName, productDesc, tone, objective, duration },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setProductName('');
          setProductDesc('');
          toast.success("Marketing Campaign Architected. View in Dashboard.");
        }, 1000);
      }, 12000);

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
          <p className="status-pill mb-4 border-primary/20 bg-primary/5 text-primary tracking-[0.2em] uppercase text-[9px] font-bold">Domain: Strategic Architecture</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">AI Ad <span className="neon-text italic">Architect</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Engineer high-converting marketing frameworks and visual ad logic for global distribution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-card rounded-[32px] overflow-hidden border-white/5 relative bg-white/[0.02]">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer bg-[length:200%_100%] z-20" />
            <CardContent className="p-10 space-y-10 relative z-10">
               <div className="space-y-6">
                <p className="panel-title">Product Identity</p>
                <div className="space-y-4">
                   <div className="prompt-box min-h-0 py-4 focus-within:border-primary/40 transition-all">
                    <Target className="w-5 h-5 text-primary opacity-50" />
                    <input 
                      placeholder="PRODUCT NAME (E.G. NEURAL-WATCH PRO...)" 
                      className="bg-transparent border-0 outline-none w-full font-bold uppercase tracking-widest text-sm"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                  <div className="prompt-box min-h-[150px] items-start focus-within:border-primary/40 transition-all">
                    <BrainCircuit className="w-5 h-5 text-primary opacity-50 mt-1" />
                    <textarea 
                      placeholder="CORE VALUE PROPOSITION, TARGET DEMOGRAPHICS, STRATEGIC COMPETITIVE EDGE..." 
                      className="flex-1 bg-transparent border-0 outline-none font-medium min-h-[120px] resize-none text-lg leading-relaxed"
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <p className="panel-title text-[9px]">Tone Profile</p>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary/40 transition-all appearance-none"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="professional">Strategic / Professional</option>
                    <option value="hype">Hype / Viral</option>
                    <option value="emotional">Emotional / Human</option>
                    <option value="minimal">Tech / Minimal</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <p className="panel-title text-[9px]">Core Objective</p>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary/40 transition-all appearance-none"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                  >
                    <option value="awareness">Brand Dominance</option>
                    <option value="conversion">Direct Conversion</option>
                    <option value="retention">User Loyalty</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <p className="panel-title text-[9px]">Runtime</p>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-primary/40 transition-all appearance-none"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="15s">15s Short-Form</option>
                    <option value="30s">30s Standard</option>
                    <option value="60s">60s Cinematic</option>
                  </select>
                </div>
              </div>

              <div className="pt-10 border-t border-white/10">
                <Button 
                  disabled={isGenerating || !productName.trim() || !productDesc.trim()}
                  onClick={handleGenerate}
                  className="w-full h-20 rounded-[24px] text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group overflow-hidden relative border-0 bg-primary text-black"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Architecting Logic...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-black" />
                        Execute Campaign Deployment
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
                          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary">Strategic Asset Compilation</p>
                          <h4 className="text-4xl font-bold tracking-tight">Deploying AI Campaign...</h4>
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
           <div className="space-y-6">
              <p className="panel-title text-primary">Spatial Templates</p>
              <div className="grid grid-cols-1 gap-4">
                 <TemplateOption icon={<Layout className="w-5 h-6" />} title="Full Frame Cinematic" desc="2.39:1 Anamorphic Experience" />
                 <TemplateOption icon={<Smartphone className="w-5 h-6" />} title="Social Vertical" desc="9:16 Kinetic Flow" />
                 <TemplateOption icon={<MousePointer2 className="w-5 h-6" />} title="Performance Square" desc="1:1 High Engagement" />
              </div>
           </div>

           <div className="p-10 rounded-[32px] glass-card border border-primary/10 space-y-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                 <Share2 className="text-primary w-8 h-8" />
              </div>
              <div className="space-y-2 relative z-10">
                 <h3 className="text-xl font-bold tracking-tight">Omni-Channel Export</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed font-medium">Export optimized variations for Instagram, TikTok, YouTube, and Television in a single synthesis cycle.</p>
              </div>
              <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white uppercase tracking-[0.2em] text-[10px] font-bold relative z-10">Configure Channels</Button>
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

function TemplateOption({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group flex items-start gap-4">
      <div className="p-3 rounded-xl bg-white/5 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">{title}</p>
        <p className="text-[10px] text-muted-foreground font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}
