import { LayoutTemplate, Sparkles, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const templates = [
  { title: "Sad Hindi Cinematic Reel", category: "Video", prompt: "Create a sad cinematic breakup reel in Hindi with rain and emotional lighting." },
  { title: "Futuristic Gadget Ad", category: "Ad", prompt: "Modern minimal technical ad for a high-end headphone brand." },
  { title: "Lofi Study Beats", category: "Music", prompt: "Relaxing lofi beats for studying, smooth piano and vinyl crackle." },
  { title: "Corporate Presentation Voice", category: "Voice", prompt: "Professional calm male voice for a corporate tech presentation." },
  { title: "YouTube Shorts Viral Intro", category: "Video", prompt: "High energy fast paced intro for a tech review YouTube short." },
  { title: "Romantic Urdu Poem", category: "Voice", prompt: "Emotional female narration for a romantic Urdu poem." }
];

export default function Templates() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10">
        <div className="space-y-2">
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Logic Blueprints</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Prompt <span className="neon-text italic">Manifest</span></h1>
          <p className="text-muted-foreground text-lg max-w-xl font-medium">Strategic starting points for autonomous multimedia synthesis.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-xl h-12 px-6 border-white/10 hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] font-bold">
            <Filter className="mr-3 w-4 h-4" />
            Filter Archive
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((t, i) => (
          <Card key={i} className="glass-card rounded-[32px] border-white/5 hover:border-primary/50 transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col h-full bg-white/[0.02]">
            <div className="p-8 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <span className="status-pill text-[9px] border-white/10 opacity-60 group-hover:opacity-100 transition-all">{t.category}</span>
                <Sparkles className="w-5 h-5 text-primary opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-primary transition-colors">{t.title}</h3>
                <p className="text-muted-foreground font-medium italic leading-relaxed line-clamp-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  "{t.prompt}"
                </p>
              </div>
            </div>
            <div className="p-4 pt-0">
               <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:text-black hover:border-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-all">
                 Execute Blueprint
               </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
