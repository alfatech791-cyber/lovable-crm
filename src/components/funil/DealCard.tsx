 import { formatDistanceToNow } from "date-fns";
 import { ptBR } from "date-fns/locale";
   import { Trash2, Phone, Calendar, DollarSign, GripVertical, Instagram, MessageCircle, MessageSquare, Clock, AlertCircle, ExternalLink, User } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { motion } from "framer-motion";
 
 interface DealCardProps {
   deal: any;
   onRemove: (id: string) => void;
   onDragStart: (id: string) => void;
   onDragEnd: () => void;
   onClick?: () => void;
 }
 
 export function DealCard({ deal, onRemove, onDragStart, onDragEnd, onClick }: DealCardProps) {
   const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
   
    // Check if the deal is "stale" (no message in 24h)
    const isStale = deal.last_message_at && (new Date().getTime() - new Date(deal.last_message_at).getTime() > 24 * 60 * 60 * 1000);
    const isNewFromUser = deal.last_message_role === 'user';
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        draggable
        onDragStart={() => onDragStart(deal.id)}
        onDragEnd={onDragEnd}
        onClick={onClick}
         className={cn(
           "bg-card border border-border/60 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-accent/5 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden active:scale-[0.99] flex flex-col gap-3",
           isStale && "border-l-4 border-l-amber-500",
           isNewFromUser && "ring-2 ring-green-500/30 bg-green-500/[0.03]"
         )}
       >
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Lead Avatar */}
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                {deal.lead?.avatar_url ? (
                  <img src={deal.lead.avatar_url} alt={deal.lead.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-primary/40" />
                )}
              </div>
              {deal.lead?.source === 'whatsapp' && (
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-background flex items-center justify-center shadow-sm">
                  <MessageCircle className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className="text-[15px] font-black truncate text-foreground group-hover:text-primary transition-colors duration-300">
                {deal.lead?.name ?? "Lead sem nome"}
              </div>
              <div className="flex items-center gap-1.5">
                {deal.lead?.phone && (
                  <span className="text-[11px] text-muted-foreground/80 font-bold bg-muted/50 px-1.5 py-0.5 rounded-md">
                    {deal.lead.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(deal.id); }} 
              className="opacity-0 group-hover:opacity-100 h-8 w-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
 
        {/* Preview da última mensagem - agora mais proeminente */}
         <div 
           className={cn(
             "mb-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer group/msg relative",
             isNewFromUser ? "bg-green-500/10 border-green-500/30 ring-1 ring-green-500/20" : "bg-muted/20 border-border/30 hover:bg-muted/40"
           )}
           title="Clique para abrir a conversa"
         >
           <div className="flex items-center gap-1.5 mb-2">
             <div className={cn(
               "h-5 w-5 rounded-full flex items-center justify-center",
               isNewFromUser ? "bg-green-500 text-white" : "bg-primary/10 text-primary"
             )}>
               <MessageSquare className="h-2.5 w-2.5" />
             </div>
             <span className={cn("text-[9px] font-black uppercase tracking-widest", isNewFromUser ? "text-green-600" : "text-muted-foreground/70")}>
               {isNewFromUser ? "WhatsApp: Nova Mensagem" : "Última Mensagem"}
             </span>
           {deal.last_message_at && (
             <span className="text-[9px] text-muted-foreground/60 ml-auto flex items-center gap-1">
               <Clock className="h-2.5 w-2.5" />
               {formatDistanceToNow(new Date(deal.last_message_at), { addSuffix: true, locale: ptBR })}
             </span>
           )}
         </div>
           <div className="flex flex-col gap-1">
             <p className={cn(
               "text-[11px] leading-relaxed font-medium",
               isNewFromUser ? "text-foreground font-bold line-clamp-3" : "text-foreground/70 italic line-clamp-2"
             )}>
               {deal.last_message ? deal.last_message : "Inicie uma conversa no WhatsApp..."}
             </p>
             
             <div className="flex items-center gap-1 mt-1 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Abrir Chat Completo</span>
                <ExternalLink className="h-2 w-2 text-primary" />
             </div>
           </div>
           
           {isNewFromUser && (
             <div className="absolute -top-1 -right-1">
               <div className="h-3 w-3 rounded-full bg-green-500 animate-ping opacity-75" />
               <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
             </div>
           )}

          {isStale && !isNewFromUser && (
            <div className="absolute -top-1 -right-1">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" title="Sem resposta há mais de 24h" />
            </div>
          )}
       </div>
 
       <div className="flex items-center justify-between pt-2.5 border-t border-border/50">
         <div className="flex flex-col">
           <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-tighter leading-none mb-1">Valor do Negócio</span>
           <div className="flex items-center gap-1 text-[13px] font-black text-primary">
             <DollarSign className="h-3 w-3 -mt-0.5" />
             <span>{fmt(Number(deal.deal_value ?? 0))}</span>
           </div>
         </div>
         
         <div className="flex flex-col items-end">
           {deal.priority === 'high' ? (
             <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[9px] font-black uppercase tracking-wider">
               <AlertCircle className="h-2.5 w-2.5" />
               URGENTE
             </div>
           ) : (
             <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/5 text-primary/60 text-[9px] font-black uppercase tracking-wider">
                {deal.lead?.source || 'Geral'}
              </div>
            )}
            
            {isNewFromUser && (
              <div className="flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-wider animate-pulse">
                RESPONDER
              </div>
            )}
            
           <div className="text-[9px] text-muted-foreground/60 mt-1 font-bold">
             {deal.created_at ? new Date(deal.created_at).toLocaleDateString('pt-BR') : ""}
           </div>
         </div>
       </div>
      </motion.div>
    );
  }