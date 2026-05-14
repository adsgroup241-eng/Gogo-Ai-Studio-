import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Settings, 
  X,
  RotateCcw,
  SkipForward,
  SkipBack,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn, handleDownload } from '@/lib/utils';

interface MediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  title: string;
  type: 'video' | 'music' | 'voice' | 'tiktok' | 'meeting';
  thumbnail?: string;
  metadata?: any;
}

export default function MediaPlayer({ isOpen, onClose, mediaUrl, title, type, thumbnail, metadata }: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('4K');
  const [isQualityOpen, setIsQualityOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAudio = type === 'music' || type === 'voice' || type === 'meeting';

  const qualities = ['720p', '1080p', '2K', '4K'];

  const onDownload = () => {
    handleDownload(mediaUrl, `${title}-${selectedQuality}.mp4`);
  };

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    } else {
      setIsPlaying(false);
      if (videoRef.current) videoRef.current.pause();
    }
  }, [isOpen]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skip = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onMouseMove={handleMouseMove}
        >
          <div className="absolute top-8 right-8 z-50">
             <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-14 h-14 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                <X className="w-6 h-6" />
             </Button>
          </div>

          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-6xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,242,255,0.15)] ring-1 ring-white/10"
          >
            {/* Media Content */}
            <div className="absolute inset-0 flex items-center justify-center">
               {isAudio ? (
                 <div className="flex flex-col items-center gap-12 w-full px-20">
                    <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden group">
                       <img src={thumbnail || "https://images.unsplash.com/photo-1614728263952-84ea256f9679"} className="w-full h-full object-cover transition-transform duration-[10s] ease-linear rotate-infinite" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} />
                       <div className="absolute inset-0 bg-primary/20 mix-blend-overlay animate-pulse" />
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                             <Play className="w-6 h-6 text-primary fill-primary" />
                          </div>
                       </div>
                    </div>
                    <div className="text-center space-y-4">
                       <h2 className="text-4xl md:text-6xl font-bold tracking-tight neon-text">{title}</h2>
                       <p className="text-primary font-mono tracking-[0.4em] uppercase text-xs opacity-60">Neural Audio Stream · 48khz Hi-Fi</p>
                    </div>
                 </div>
               ) : (
                 <video 
                   ref={videoRef}
                   src={mediaUrl || "https://player.vimeo.com/external/494252666.hd.mp4?s=2f5c15039f993d0d8504a9d70c446540c11d279d&profile_id=175"} 
                   className="w-full h-full object-contain"
                   onTimeUpdate={handleTimeUpdate}
                   onLoadedMetadata={handleLoadedMetadata}
                   onPlay={() => setIsPlaying(true)}
                   onPause={() => setIsPlaying(false)}
                 />
               )}
            </div>

            {/* Overlays */}
            <AnimatePresence>
               {showControls && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-8 flex flex-col justify-between"
                 >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-xl bg-primary/20 text-primary border border-primary/20", type === 'tiktok' && "bg-secondary/20 text-secondary border-secondary/20")}>
                             <Monitor className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-xl text-white tracking-tight">{title}</h4>
                             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{type} System Rendering</p>
                          </div>
                       </div>
                       <div className="flex gap-2 relative">
                          <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden h-12">
                             {qualities.map(q => (
                               <button 
                                 key={q}
                                 onClick={() => setSelectedQuality(q)}
                                 className={cn(
                                   "px-4 text-[9px] font-bold tracking-widest transition-all border-r border-white/10 last:border-0",
                                   selectedQuality === q ? "bg-primary text-black" : "text-white/40 hover:bg-white/5"
                                 )}
                               >
                                 {q}
                               </button>
                             ))}
                          </div>
                          <Button 
                            onClick={onDownload}
                            className="rounded-xl bg-primary text-black hover:bg-secondary uppercase tracking-widest text-[10px] font-bold h-12 px-6"
                          >
                             <Download className="w-4 h-4 mr-3" />
                             Export
                          </Button>
                       </div>
                    </div>

                    <div className="space-y-6">
                       {/* Timeline */}
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest text-white/40">
                             <span>{formatTime(currentTime)}</span>
                             <span>{formatTime(duration)}</span>
                          </div>
                          <Slider 
                             value={[currentTime]} 
                             max={duration} 
                             step={0.1} 
                             onValueChange={([val]) => {
                                if (videoRef.current) videoRef.current.currentTime = val;
                             }}
                             className="py-1 [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/10 [&_[role=slider]]:bg-primary [&_[role=slider]]:w-4 [&_[role=slider]]:h-4" 
                          />
                       </div>

                       {/* Footer Controls */}
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-8">
                             <div className="flex items-center gap-4">
                                <button onClick={() => skip(-10)} className="text-white/40 hover:text-white transition-colors"><SkipBack className="w-6 h-6" /></button>
                                <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                                   {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black" />}
                                </button>
                                <button onClick={() => skip(10)} className="text-white/40 hover:text-white transition-colors"><SkipForward className="w-6 h-6" /></button>
                             </div>

                             <div className="flex items-center gap-4 group">
                                <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white transition-colors">
                                   {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                                </button>
                                <div className="w-24 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Slider 
                                      value={[isMuted ? 0 : volume]} 
                                      max={100} 
                                      onValueChange={([v]) => {
                                         setVolume(v);
                                         if (videoRef.current) videoRef.current.volume = v / 100;
                                      }}
                                      className="[&>span:first-child]:h-1 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
                                   />
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-6">
                             <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                {[0.5, 1, 1.5, 2].map(rate => (
                                  <button 
                                    key={rate}
                                    onClick={() => {
                                       setPlaybackRate(rate);
                                       if (videoRef.current) videoRef.current.playbackRate = rate;
                                    }}
                                    className={cn(
                                       "px-4 py-2 text-[10px] font-bold tracking-widest transition-all",
                                       playbackRate === rate ? "bg-primary text-black" : "text-white/40 hover:bg-white/5"
                                    )}
                                  >
                                     {rate}x
                                  </button>
                                ))}
                             </div>
                             <button className="text-white/40 hover:text-white transition-colors"><Maximize className="w-6 h-6" /></button>
                             <button className="text-white/40 hover:text-white transition-colors"><Settings className="w-6 h-6" /></button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
