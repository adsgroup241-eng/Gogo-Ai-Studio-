import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  Copy, 
  BrainCircuit,
  Lightbulb,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Markdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are GoGo AI Studio Assistant, an expert in AI multimedia creation (Video, Voice, Music). Help the user with: ${input}` }] }
        ],
        config: {
          systemInstruction: "You are a futuristic, helpful, and creative AI multimedia assistant. You help users generate scripts, song lyrics, video prompts, and ad copies. Keep your tone professional yet inspiring."
        }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || "I'm sorry, I couldn't generate a response." 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat AI failed', error);
      toast.error("Process interrupted. Check neural link.");
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.info("Workspace cache purged.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-6xl mx-auto selection:bg-primary/30 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-white/10 mb-8">
        <div className="space-y-2">
          <p className="text-[12px] uppercase tracking-[0.4em] text-primary font-bold opacity-80">Strategic Intelligence</p>
          <h1 className="text-5xl font-bold tracking-[-0.04em]">Creative <span className="neon-text italic">Oracle</span></h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearChat}
          className="rounded-xl border-white/10 hover:bg-white/5 uppercase tracking-[0.2em] text-[10px] font-bold px-6 py-4 h-auto"
        >
          <Trash2 className="w-4 h-4 mr-3" />
          Purge Cache
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden relative glass-card rounded-[32px] border-white/5 mb-8 shadow-2xl shadow-black/40">
        <ScrollArea className="h-full p-8 md:p-12">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-12 pt-20">
                <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse border border-primary/30 relative">
                  <div className="absolute inset-0 bg-primary blur-2xl opacity-20" />
                  <Bot className="w-12 h-12 text-primary relative z-10" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold tracking-tighter">Awaiting Logic Input</h2>
                  <p className="text-muted-foreground max-w-md mx-auto font-medium italic text-lg leading-relaxed">
                    Deploy your requirements for script synthesis, lyric architecture, or strategic ad logic.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                  <SuggestionCard
                    icon={<BrainCircuit className="w-5 h-5" />}
                    title="Lyric Architect"
                    text="Synthesis of Hindi soul-pop lyrics"
                    onClick={() => setInput("Synthesize a soul-pop Hindi song about digital loneliness")}
                  />
                  <SuggestionCard
                    icon={<Lightbulb className="w-5 h-5" />}
                    title="Strategic Ideation"
                    text="5 viral concepts for tech hardware"
                    onClick={() => setInput("Ideate 5 high-impact viral concepts for futuristic hardware")}
                  />
                  <SuggestionCard
                    icon={<Zap className="w-5 h-5" />}
                    title="Protocol Copy"
                    text="3 professional ad variants"
                    onClick={() => setInput("Execute 3 professional ad copy variants for GoGo Studio")}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-10 pb-12">
                {messages.map((message, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "flex gap-6 max-w-[90%]",
                      message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <Avatar className={cn(
                      "w-12 h-12 border border-white/10 shrink-0 shadow-xl",
                      message.role === 'assistant' ? "bg-black ring-2 ring-primary/20" : ""
                    )}>
                      {message.role === 'assistant' ? (
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <Sparkles className="w-6 h-6 fill-primary" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={userProfile?.photoURL} />
                          <AvatarFallback className="font-bold">{userProfile?.displayName?.[0]}</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div className={cn(
                      "p-6 md:p-8 rounded-[32px] relative group transition-all duration-300",
                      message.role === 'user' 
                        ? "bg-primary text-black rounded-tr-none font-bold shadow-2xl shadow-primary/20" 
                        : "bg-white/5 border border-white/5 text-white/90 rounded-tl-none prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 backdrop-blur-xl"
                    )}>
                      {message.role === 'assistant' ? (
                        <div className="markdown-body">
                          <Markdown>{message.content}</Markdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed italic">{message.content}</p>
                      )}
                      
                      {message.role === 'assistant' && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(message.content);
                            toast.success("Manifest copied to clipboard.");
                          }}
                          className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 p-2 hover:text-primary transition-all flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Duplicate logic
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/40">
                      <Sparkles className="w-6 h-6 text-primary fill-primary animate-pulse" />
                    </div>
                    <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary opacity-60">Oracle Processing...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-[32px] opacity-0 group-focus-within:opacity-30 transition-opacity duration-700" />
        <Card className="glass-card border-white/10 overflow-hidden relative z-10 rounded-[28px] border-2 group-focus-within:border-primary/50 transition-all duration-300">
          <CardContent className="p-4 flex items-end gap-2">
            <Textarea
              rows={1}
              placeholder="TRANSMIT PARAMETERS TO ORACLE..."
              className="min-h-[72px] border-0 bg-transparent focus-visible:ring-0 text-lg py-5 pl-6 pr-4 resize-none placeholder:opacity-20 placeholder:font-bold placeholder:tracking-[0.2em] font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              size="icon" 
              className={cn(
                "h-14 w-14 rounded-2xl mb-1 mr-1 shrink-0 transition-all duration-500 relative overflow-hidden group/btn",
                input.trim() ? "bg-primary text-black opacity-100 translate-y-0" : "bg-white/10 opacity-30 translate-y-1"
              )}
              disabled={!input.trim() || isTyping}
              onClick={handleSendMessage}
            >
              <Send className="w-6 h-6 relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SuggestionCard({ icon, title, text, onClick }: { icon: React.ReactNode, title: string, text: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-[28px] glass-card border border-white/5 hover:border-primary/50 transition-all flex flex-col items-start gap-4 text-left group"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shadow-xl group-hover:shadow-primary/20">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{title}</p>
        <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors leading-relaxed opacity-60 group-hover:opacity-100">{text}</span>
      </div>
    </button>
  );
}
