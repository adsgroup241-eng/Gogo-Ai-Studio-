import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Video, 
  Mic2, 
  Music, 
  Sparkles, 
  ArrowRight,
  PlayCircle,
  BrainCircuit,
  Rocket
} from 'lucide-react';
import { useEffect } from 'react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Landing() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black selection:bg-primary selection:text-black overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00f2ff]/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7000ff]/10 blur-[160px] rounded-full animate-pulse decoration-infinite" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-10 py-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f2ff] to-[#7000ff] flex items-center justify-center font-bold text-2xl shadow-[0_0_30px_rgba(0,242,255,0.4)] border border-white/20 transition-transform group-hover:scale-110">
            G
          </div>
          <span className="text-2xl font-bold tracking-[0.3em] uppercase neon-text transition-all duration-500">GoGo Studio</span>
        </div>
        <div className="hidden md:flex items-center gap-12">
          {['Features', 'Intelligence', 'Protocol'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all relative group">
              {link}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
          <Button onClick={signInWithGoogle} variant="outline" className="rounded-2xl border-white/10 px-8 py-6 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white/5 transition-all">
            Access Terminal
          </Button>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-40">
        {/* Hero Section */}
        <section className="container mx-auto px-10 text-center max-w-5xl">
          <motion.div 
            {...fadeIn}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-12 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">System Operational: Version 2.0.4 Beta</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-[120px] font-bold tracking-[-0.05em] mb-12 leading-[0.9] text-white"
          >
            Archive the <span className="neon-text italic">Impossible</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/20">Unified Creative Logic</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-medium leading-relaxed"
          >
            Deploy high-fidelity visual and auditory assets using generative intelligence. 
            A singular interface for the modern architect.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button 
              onClick={signInWithGoogle}
              size="lg" 
              className="h-20 px-12 rounded-[24px] text-xs font-bold uppercase tracking-[0.3em] shadow-[0_0_50px_rgba(0,242,255,0.2)] group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-4">
                Initialize Project 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-20 px-12 rounded-[24px] text-xs font-bold uppercase tracking-[0.3em] border-white/10 hover:bg-white/5 transition-all text-white"
            >
              System Overview
              <PlayCircle className="ml-4 w-5 h-5 text-primary" />
            </Button>
          </motion.div>
        </section>

        {/* Intelligence Grid */}
        <section id="features" className="container mx-auto px-10 mt-60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<BrainCircuit className="w-10 h-10 text-primary" />}
              title="Parametric Logic"
              description="Unified generation from abstract thought to professional-grade digital asset output."
            />
            <FeatureCard 
              icon={<Rocket className="w-10 h-10 text-[#7000ff]" />}
              title="Hyper-Drive Pipeline"
              description="Sub-minute rendering latency across distributed secure cloud clusters."
            />
            <FeatureCard 
              icon={<Sparkles className="w-10 h-10 text-white" />}
              title="Neural Precision"
              description="Deterministic controls for high-fidelity content creation across all mediums."
            />
          </div>
        </section>

        {/* Global Vault */}
        <section id="intelligence" className="container mx-auto px-10 mt-60">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <p className="panel-title">Operational Domains</p>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none">The <span className="italic neon-text">Omnisharp</span> Studio</h2>
            </div>
            <p className="text-muted-foreground max-w-md text-lg font-medium">Every strategic module required for modern multimedia dominance, integrated into a single high-performance workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ToolCard 
              icon={<Video className="w-6 h-6" />}
              title="VISUAL CORE"
              tags={["CINEMATIC", "SEQUENCES", "MASTERING"]}
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"
            />
            <ToolCard 
              icon={<Music className="w-6 h-6" />}
              title="AUDIO ENGINE"
              tags={["NEURAL BEATS", "LYRIC LOGIC", "SYNTH"]}
              image="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800"
            />
            <ToolCard 
              icon={<Mic2 className="w-6 h-6" />}
              title="VOCAL SYNTH"
              tags={["CLONING", "EMOTIVE", "MULTILINGUAL"]}
              image="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800"
            />
            <ToolCard 
              icon={<Sparkles className="w-6 h-6" />}
              title="AD ARCHITECT"
              tags={["PROMOTIONS", "STRATEGY", "BETA"]}
              image="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 px-10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-black border border-white/20">G</div>
              <span className="font-bold uppercase tracking-[0.4em] text-xl">GoGo AI Studio</span>
            </div>
            <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
              Engineering the next generation of digital creativity through unified high-performance intelligence protocols.
            </p>
          </div>
          <div className="space-y-6">
            <p className="panel-title">Navigation</p>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Manifesto</a>
              <a href="#" className="hover:text-primary transition-colors">Technology</a>
              <a href="#" className="hover:text-primary transition-colors">Archives</a>
            </div>
          </div>
          <div className="space-y-6">
            <p className="panel-title">Social Matrix</p>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Digital X</a>
              <a href="#" className="hover:text-primary transition-colors">Neural Discord</a>
              <a href="#" className="hover:text-primary transition-colors">System Logs</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-30">© 2026 GOGO AI STUDIO. ALL RIGHTS RESERVED. OPERATIONAL AT SCALE.</p>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.4em] text-muted-foreground opacity-30">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of Engagement</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.05)' }}
      className="p-10 rounded-[32px] glass-card border-white/5 transition-all duration-500 group"
    >
      <div className="mb-10 w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110 duration-500 group-hover:shadow-[0_0_30px_rgba(0,242,255,0.2)]">
        {icon}
      </div>
      <p className="panel-title mb-4">Module Tier 01</p>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
}

function ToolCard({ icon, title, tags, image }: { icon: React.ReactNode, title: string, tags: string[], image: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="group relative h-[500px] rounded-[40px] overflow-hidden border border-white/10 bg-black transition-all duration-700"
    >
      <div className="absolute inset-0 z-0">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-125 opacity-30 group-hover:opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      
      <div className="relative z-10 h-full p-10 flex flex-col justify-end gap-6">
        <div className="w-16 h-16 rounded-[20px] bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 transition-transform group-hover:rotate-12 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {icon}
        </div>
        <div className="space-y-4">
          <h3 className="text-3xl font-bold tracking-tighter text-white">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className="status-pill text-[9px] border-white/20 bg-white/5 group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary transition-all">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
