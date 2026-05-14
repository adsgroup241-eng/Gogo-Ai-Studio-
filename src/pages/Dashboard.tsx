import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Video, 
  Music, 
  Mic2, 
  History, 
  TrendingUp, 
  Play,
  MoreVertical,
  Plus,
  Loader2,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, calculateProjectProgress } from '../lib/firebase';
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import MediaPlayer from '../components/media/MediaPlayer';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Background status update simulation for the dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      projects.forEach(project => {
        if (project.status === 'processing') {
          const { isCompleted } = calculateProjectProgress(project.createdAt, project.type);
          if (isCompleted) {
             updateDoc(doc(db, 'projects', project.id), {
               status: 'completed',
               updatedAt: serverTimestamp()
             }).catch(e => console.error("Error auto-completing project:", e));
          }
        }
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [projects]);

  const stats = {
    visual: projects.filter(p => p.type === 'video').length,
    audio: projects.filter(p => p.type === 'music').length,
    vocal: projects.filter(p => p.type === 'voice').length,
    marketing: projects.filter(p => p.type === 'ad').length,
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Workspace Dashboard</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Welcome back, <span className="neon-text italic">{userProfile?.displayName?.split(' ')[0] || 'User'}</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Your strategic creative suite is initialized. Select a tool to begin building your next masterpiece.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/video">
            <Button size="lg" className="rounded-2xl h-14 px-8 font-bold uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/10 transition-all hover:scale-105 active:scale-95 bg-primary text-black border-0">
              <Plus className="mr-3 w-5 h-5" />
              Initialize Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats / Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatsCard 
          icon={<Video className="w-5 h-5" />}
          label="Visual Assets"
          value={stats.visual.toString()}
          change="+ NEW"
        />
        <StatsCard 
          icon={<Music className="w-5 h-5" />}
          label="Audio Streams"
          value={stats.audio.toString()}
          change="+ NEW"
        />
        <StatsCard 
          icon={<Megaphone className="w-5 h-5" />}
          label="Marketing Logic"
          value={stats.marketing.toString()}
          change="+ NEW"
        />
        <StatsCard 
          icon={<History className="w-5 h-5" />}
          label="Uptime State"
          value="99.9%"
          change="OPTIMAL"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 glass-card border-white/5 rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
            <div>
              <p className="panel-title">Active Deployments</p>
              <CardTitle className="text-2xl font-bold tracking-tight">Recent Archives</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl border-white/10 hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold px-4">Browse Repository</Button>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin opacity-20" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                <p className="text-muted-foreground italic font-medium">No projects archived yet. Start a generation to build your repository.</p>
              </div>
            ) : (
              projects.map(project => (
                <ProjectItem 
                  key={project.id}
                  thumbnail={project.thumbnailUrl || (project.type === 'video' ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" : project.type === 'music' ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" : "https://images.unsplash.com/photo-1614728263952-84ea256f9679")}
                  title={project.title}
                  type={project.type.toUpperCase()}
                  status={project.status === 'completed' ? 'Optimized' : 'Spectraling'}
                  date={new Date(project.createdAt?.seconds * 1000).toLocaleDateString()}
                  project={project}
                  onPlay={() => setSelectedMedia(project)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Upgrade / Recommendation */}
        <div className="space-y-12">
          <Card className="neon-gradient text-black border-0 rounded-3xl overflow-hidden relative group p-8 shadow-2xl shadow-primary/20">
            <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Status: Beta Tier</p>
              <h3 className="text-3xl font-bold tracking-tighter leading-none italic">Unleash Full Capability</h3>
              <p className="text-sm font-medium opacity-80 leading-relaxed italic">Upgrade to Studio Pro for high-bitrate exports, custom neural training, and priority rendering.</p>
              <Button variant="outline" className="w-full h-14 font-bold uppercase tracking-[0.2em] text-[10px] bg-black/10 border-black/20 hover:bg-black/20 transition-all rounded-2xl border-2">
                Accelerate To Pro
              </Button>
            </div>
            <Sparkles className="absolute -bottom-12 -right-12 w-48 h-48 opacity-10 rotate-12 transition-transform duration-1000 group-hover:rotate-45" />
          </Card>

          <div className="space-y-6">
            <p className="panel-title">trending modules</p>
            <div className="space-y-4">
              <TrendingItem label="HYPER-SYNC REEL ENGINE" count="2.4K SESSIONS" />
              <TrendingItem label="NEURAL VOICE CLONING" count="1.1K SESSIONS" />
              <TrendingItem label="LYRIC ARCHITECT AI" count="890 SESSIONS" />
            </div>
          </div>
        </div>
      </div>

      <MediaPlayer 
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        mediaUrl={selectedMedia?.url || ""}
        title={selectedMedia?.title || ""}
        type={selectedMedia?.type || "video"}
        thumbnail={selectedMedia?.thumbnailUrl}
        metadata={selectedMedia?.metadata}
      />
    </div>
  );
}

function StatsCard({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string, change: string }) {
  return (
    <Card className="glass-card rounded-3xl border-white/5 transition-all hover:bg-white/5 group">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-primary group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          <span className="status-pill">{change}</span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground opacity-50">{label}</p>
          <p className="text-4xl font-bold tracking-tighter leading-none">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectItem({ thumbnail, title, type, status, date, project, onPlay }: { thumbnail: string, title: string, type: string, status: string, date: string, project: any, onPlay: () => void }) {
  const { progress } = calculateProjectProgress(project.createdAt, project.type);
  const showProgress = project.status === 'processing';
  const displayProgress = showProgress ? progress : 100;
  return (
    <div 
      onClick={() => project.status === 'completed' && onPlay()}
      className={cn(
        "flex items-center gap-6 group border-b border-white/5 pb-8 last:border-0 last:pb-0",
        project.status === 'completed' ? "cursor-pointer" : "cursor-wait"
      )}
    >
      <div className="relative w-28 h-18 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-xl transition-transform group-hover:scale-105 duration-500">
        <img src={thumbnail} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
          <Play className="w-6 h-6 fill-primary text-primary" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary/80">{type}</span>
          <span className="text-[10px] text-muted-foreground opacity-30">•</span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{date}</span>
        </div>
        <h4 className="font-bold text-lg tracking-tight truncate group-hover:neon-text transition-all duration-300">{title}</h4>
      </div>
      <div className="text-right flex flex-col items-end gap-3">
        <span className={status === 'Optimized' ? "status-pill" : "status-pill bg-blue-500/10 text-blue-500 border-blue-500/20"}>
          {status}
        </span>
        {showProgress && (
          <div className="w-32 space-y-2">
            <Progress value={displayProgress} className="h-1 bg-white/5" />
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{displayProgress}% READY</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TrendingItem({ label, count }: { label: string, count: string }) {
  return (
    <div className="flex items-center justify-between group p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
        <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground group-hover:text-white transition-colors">{label}</span>
      </div>
      <span className="text-[10px] text-muted-foreground font-bold opacity-30 group-hover:opacity-100">{count}</span>
    </div>
  );
}
