import React, { useEffect, useState } from 'react';
import { 
  Video, 
  Music, 
  Mic2, 
  Megaphone, 
  MessageSquare, 
  Download, 
  Trash2, 
  Copy, 
  ExternalLink,
  Search,
  Filter,
  History as HistoryIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Play,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType, calculateProjectProgress } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn, handleDownload } from '@/lib/utils';
import MediaPlayer from '../components/media/MediaPlayer';

export default function History() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
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
    });

    return () => unsubscribe();
  }, [user]);

  // Background status update simulation
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

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success("Project purged from archives.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const handleDuplicate = async (project: any) => {
    try {
      const { id, createdAt, updatedAt, ...rest } = project;
      await addDoc(collection(db, 'projects'), {
        ...rest,
        title: `${rest.title} (COPY)`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'processing' // Restart generation for the duplicate
      });
      toast.success("Project logic duplicated.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'tiktok': return <Video className="w-5 h-5" />;
      case 'music': return <Music className="w-5 h-5" />;
      case 'voice': return <Mic2 className="w-5 h-5" />;
      case 'ad': return <Megaphone className="w-5 h-5" />;
      case 'chat': return <MessageSquare className="w-5 h-5" />;
      case 'meeting': return <Briefcase className="w-5 h-5" />;
      default: return <HistoryIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-4">
          <p className="status-pill border-primary/20 bg-primary/5 text-primary tracking-[0.2em] uppercase text-[9px] font-bold">Archives & Logic Vault</p>
          <h1 className="text-5xl font-bold tracking-tight">Project <span className="neon-text italic">History</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Manage your autonomous AI generations, re-draft assets, and monitor spectral progress.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="SEARCH ARCHIVES (VIDEO, MUSIC, AD...)" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'video', 'tiktok', 'music', 'voice', 'ad', 'meeting'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap",
                filter === f ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,242,255,0.2)]" : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10"
              )}
            >
              {f === 'tiktok' ? 'REELS' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onPlay={() => setSelectedMedia(project)}
              icon={getIcon(project.type)}
            />
          ))}
        </AnimatePresence>
        
        {!loading && filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto">
               <HistoryIcon className="w-10 h-10 text-muted-foreground opacity-20" />
            </div>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">Archives are empty</p>
          </div>
        )}
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

function ProjectCard({ project, onDelete, onDuplicate, onPlay, icon }: { project: any, onDelete: (id: string) => void, onDuplicate: (p: any) => void, onPlay: () => void, icon: React.ReactNode }) {
  const { progress, isCompleted } = calculateProjectProgress(project.createdAt, project.type);
  const displayProgress = project.status === 'completed' ? 100 : progress;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="group"
    >
      <Card 
        onClick={() => project.status === 'completed' && onPlay()}
        className={cn(
          "glass-card rounded-[32px] overflow-hidden border-white/5 transition-all hover:border-primary/30 group-hover:shadow-[0_0_40px_rgba(0,242,255,0.05)] bg-white/[0.02] flex flex-col h-full",
          project.status === 'completed' && "cursor-pointer"
        )}
      >
        <div className="relative h-48 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 opacity-10 blur-3xl bg-primary animate-pulse" />
           {project.status === 'completed' ? (
             <Play className="w-12 h-12 text-primary opacity-50 group-hover:scale-125 group-hover:opacity-100 transition-all duration-500" />
           ) : (
             <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 animate-spin border-t-primary" />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-primary">{displayProgress}%</span>
             </div>
           )}
           <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-primary">{icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{project.type}</span>
           </div>
           
           {project.status === 'processing' && (
             <div className="absolute bottom-0 inset-x-0 h-1 bg-white/5">
                <motion.div 
                  className="h-full bg-primary" 
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                />
             </div>
           )}
        </div>

        <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{project.title || "Untitled Project"}</h3>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                {project.createdAt?.toDate().toLocaleDateString()} · {project.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-xl border transition-all",
              project.status === 'completed' ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-muted-foreground"
            )}>
              {project.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 animate-pulse" />}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-60 flex-1">
            {project.prompt || project.productDesc || "Spectral data analysis in progress..."}
          </p>

          <div className="flex gap-2 pt-4">
             <Button 
               size="sm" 
               onClick={(e) => {
                 e.stopPropagation();
                 handleDownload(project.url, `${project.title || 'project'}.mp4`);
               }}
               className={cn(
                 "flex-1 h-11 rounded-xl uppercase tracking-widest text-[9px] font-bold transition-all",
                 project.status === 'completed' ? "bg-primary text-black hover:bg-secondary" : "bg-white/5 text-muted-foreground cursor-wait"
               )}
               disabled={project.status !== 'completed'}
             >
               <Download className="w-3.5 h-3.5 mr-2" />
               Download
             </Button>
             <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 rounded-xl border-white/10 hover:bg-white/5 hover:text-primary transition-all"
                  onClick={() => onDuplicate(project)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-11 w-11 rounded-xl border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all"
                  onClick={() => onDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
