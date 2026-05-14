import React, { useEffect, useState } from 'react';
import { 
  Grid2X2, 
  List, 
  Search, 
  Filter, 
  Download, 
  Play, 
  Trash2, 
  Share2, 
  Clock, 
  HardDrive,
  CheckCircle2,
  MoreHorizontal,
  LayoutGrid,
  Video,
  Music,
  Mic2,
  Megaphone,
  Briefcase,
  History,
  Star,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn, handleDownload } from '@/lib/utils';
import MediaPlayer from '../components/media/MediaPlayer';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

export default function Gallery() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // We only show completed projects in the Gallery (Media Library)
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid),
      where('status', '==', 'completed'),
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
       // Note: If no index exists yet, we might fallback to client-side filtering 
       // but for this implementation we assume standard composite index
       handleFirestoreError(error, OperationType.LIST, 'projects');
       setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success("Asset decommissioned.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  const storageData = [
    { name: 'Video', value: projects.filter(p => p.type === 'video').length * 25, color: '#00f2ff' },
    { name: 'Audio', value: projects.filter(p => p.type === 'music' || p.type === 'voice').length * 5, color: '#f200ff' },
    { name: 'Other', value: projects.filter(p => p.type !== 'video' && p.type !== 'music' && p.type !== 'voice').length * 2, color: '#ffffff' },
    { name: 'Free', value: 1000 - (projects.length * 5), color: 'rgba(255,255,255,0.05)' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Header & Storage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <LayoutGrid className="w-6 h-6 text-primary" />
             </div>
             <p className="status-pill border-primary/20 bg-primary/5 text-primary tracking-[0.2em] uppercase text-[9px] font-bold">Neural Media Library</p>
          </div>
          <h1 className="text-6xl font-bold tracking-tight">Spectral <span className="neon-text italic">Gallery</span></h1>
          <p className="text-muted-foreground text-xl max-w-2xl font-medium leading-relaxed">Your professional studio cloud. All high-fidelity generations are archived here for HD streaming and direct export.</p>
        </div>

        <div className="glass-card rounded-[32px] p-8 bg-white/[0.02] border-white/5 flex items-center gap-8 relative overflow-hidden group">
           <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="w-32 h-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie 
                      data={storageData} 
                      innerRadius={35} 
                      outerRadius={45} 
                      paddingAngle={5} 
                      dataKey="value"
                      stroke="none"
                    >
                       {storageData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-3">
                 <HardDrive className="w-5 h-5 text-primary" />
                 <span className="text-2xl font-bold tracking-tight">8.4 <span className="text-base text-muted-foreground">GB</span></span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cloud Storage Matrix</p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[9px] font-bold text-white/40 uppercase">Video</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="text-[9px] font-bold text-white/40 uppercase">Audio</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 sticky top-0 z-50 bg-black/60 backdrop-blur-3xl py-4 -mx-4 px-4 rounded-3xl border border-white/5">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="FILTER BY PROJECT ARCHIVE ID OR TAG..." 
            className="w-full bg-white/5 border border-white/10 rounded-[20px] h-16 pl-16 pr-4 text-sm font-bold uppercase tracking-[0.2em] focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[20px]">
          {['all', 'video', 'tiktok', 'music', 'voice', 'ad'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 h-12 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                filter === f ? "bg-primary text-black shadow-[0_0_20px_rgba(0,242,255,0.3)]" : "text-muted-foreground hover:text-white"
              )}
            >
              {f === 'tiktok' ? 'REELS' : f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-[20px]">
           <button onClick={() => setViewMode('grid')} className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", viewMode === 'grid' ? "bg-white text-black" : "text-muted-foreground hover:text-white")}><Grid2X2 className="w-5 h-5" /></button>
           <button onClick={() => setViewMode('list')} className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", viewMode === 'list' ? "bg-white text-black" : "text-muted-foreground hover:text-white")}><List className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Gallery Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           <AnimatePresence mode="popLayout">
           {filteredProjects.map((project) => (
             <GalleryItem 
               key={project.id} 
               project={project} 
               onPlay={() => setSelectedMedia(project)} 
               onDelete={() => handleDelete(project.id)}
             />
           ))}
           </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-4">
           {filteredProjects.map((project) => (
             <ListViewItem 
               key={project.id} 
               project={project} 
               onPlay={() => setSelectedMedia(project)} 
               onDelete={() => handleDelete(project.id)}
             />
           ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
         <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-32 h-32 rounded-[40px] bg-white/5 flex items-center justify-center border border-white/5">
               <History className="w-16 h-16 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-bold tracking-tight">Spectral Silence Detected</p>
               <p className="text-muted-foreground text-sm max-w-sm uppercase tracking-widest font-bold opacity-60">No completed generations found matching your current filter neural parameters.</p>
            </div>
         </div>
      )}

      {/* Media Player Dialog */}
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

function GalleryItem({ project, onPlay, onDelete }: { project: any, onPlay: () => void, onDelete: () => void }) {
  const getMetadata = (p: any) => {
    if (p.metadata) return p.metadata;
    return {
      duration: 120,
      fileSize: '45.2 MB',
      quality: '4K Ultra HD',
      frameRate: '60fps'
    };
  };

  const metadata = getMetadata(project);
  const formattedDuration = `${Math.floor(metadata.duration / 60)}:${(metadata.duration % 60).toString().padStart(2, '0')}`;

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'tiktok': return <Video className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'voice': return <Mic2 className="w-4 h-4" />;
      case 'ad': return <Megaphone className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getThumbnail = (p: any) => {
    if (p.thumbnailUrl) return p.thumbnailUrl;
    if (p.type === 'video' || p.type === 'tiktok') return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe";
    if (p.type === 'music') return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745";
    return "https://images.unsplash.com/photo-1614728263952-84ea256f9679";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group"
    >
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-white/5 border border-white/5 transition-all hover:border-primary/40 hover:shadow-[0_0_40px_rgba(0,242,255,0.1)]">
         <img src={getThumbnail(project)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                     <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <span className="text-primary">{getIcon(project.type)}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">{project.type}</span>
                     </div>
                     <div className="px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 text-primary text-[9px] font-bold tracking-widest uppercase">
                        {metadata.quality.split(' ')[0]}
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 uppercase tracking-widest">
                        {formattedDuration}
                     </div>
                     <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 uppercase tracking-widest">
                        {metadata.fileSize}
                     </div>
                  </div>
               </div>
               <button className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <Star className="w-4 h-4" />
               </button>
            </div>

            <div className="space-y-4">
               <div>
                  <h3 className="font-bold text-xl tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">
                     <Clock className="w-3 h-3" />
                     <span>{project.createdAt?.toDate().toLocaleDateString()}</span>
                     <span>·</span>
                     <span>HD STEREO</span>
                  </div>
               </div>

               <div className="flex gap-2">
                  <Button onClick={onPlay} className="flex-1 rounded-2xl h-14 bg-primary text-black hover:bg-secondary transition-all uppercase tracking-widest text-[10px] font-bold">
                     <Play className="w-4 h-4 mr-2 fill-black" />
                     Stream
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(project.url, `${project.title || 'project'}.mp4`)}
                    className="w-14 h-14 rounded-2xl border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all font-bold"
                  >
                     <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                     variant="outline" 
                     onClick={onDelete}
                     className="w-14 h-14 rounded-2xl border-white/10 bg-black/40 backdrop-blur-md hover:bg-red-500/10 hover:text-red-500 transition-all"
                  >
                     <Trash2 className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function ListViewItem({ project, onPlay, onDelete }: { project: any, onPlay: () => void, onDelete: () => void }) {
  return (
    <div className="flex items-center gap-8 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
       <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10">
          <img src={project.thumbnailUrl || (project.type === 'music' ? "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe")} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
       </div>
       <div className="flex-1 min-w-0">
          <h4 className="font-bold text-lg tracking-tight truncate group-hover:text-primary transition-colors">{project.title}</h4>
          <div className="flex items-center gap-4 mt-1">
             <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{project.type} ARCHIVE</span>
             <span className="text-white/20 text-xs">|</span>
             <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">{project.createdAt?.toDate().toLocaleDateString()}</span>
          </div>
       </div>
       <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
             <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Neural Precision</p>
             <p className="text-sm font-mono font-bold text-white">99.2%</p>
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" onClick={onPlay} className="w-12 h-12 rounded-xl hover:bg-primary hover:text-black transition-all">
                <Play className="w-5 h-5 fill-current" />
             </Button>
             <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-white/5 transition-all text-white/40 hover:text-white">
                <Share2 className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={onDelete} className="w-12 h-12 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-white/40">
                <Trash2 className="w-5 h-5" />
             </Button>
          </div>
       </div>
    </div>
  );
}
