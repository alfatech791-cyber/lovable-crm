import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
 import { Trash2, Phone, Calendar, DollarSign, GripVertical, Instagram, MessageCircle, MessageSquare, Clock, AlertCircle } from "lucide-react";
 import { cn } from "@/lib/utils";
 
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
 
   return (
     <div
       draggable
       onDragStart={() => onDragStart(deal.id)}
       onDragEnd={onDragEnd}
       onClick={onClick}
       className={cn(
         "bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden active:scale-[0.98]",
         isStale && "border-l-4 border-l-amber-400"
       )}
     >
       {/* Indicador de prioridade opcional */}
       {deal.priority === 'high' && <div className="absolute top-0 right-0 w-20 h-20 bg-destructive/5 rounded-bl-full -mr-10 -mt-10" />}
       
       <div className="flex items-start justify-between mb-2">
         <div className="flex items-center gap-2 flex-1 min-w-0">
           <div className="bg-muted p-1 rounded-md group-hover:bg-primary/10 transition-colors">
             <GripVertical className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary/50 shrink-0" />
           </div>
           <div className="flex flex-col min-w-0">
             <div className="text-sm font-black truncate text-foreground/90 leading-none mb-0.5">{deal.lead?.name ?? "Lead sem nome"}</div>
             <div className="flex items-center gap-1">
               {deal.lead?.phone && <span className="text-[10px] text-muted-foreground font-medium">{deal.lead.phone}</span>}
             </div>
           </div>
         </div>
         
         <div className="flex items-center gap-1 shrink-0">
           {deal.lead?.source === 'whatsapp' && (
             <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center" title="WhatsApp">
               <MessageCircle className="h-3.5 w-3.5 text-green-500" />
             </div>
           )}
           {deal.lead?.source === 'instagram' && (
             <div className="h-6 w-6 rounded-full bg-pink-500/10 flex items-center justify-center" title="Instagram">
               <Instagram className="h-3.5 w-3.5 text-pink-500" />
             </div>
           )}
           <button 
             onClick={(e) => { e.stopPropagation(); onRemove(deal.id); }} 
             className="opacity-0 group-hover:opacity-100 h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
           >
             <Trash2 className="h-3.5 w-3.5" />
           </button>
         </div>
       </div>
 
       {/* Preview da última mensagem - agora mais proeminente */}
       <div className="mb-3 px-3 py-2 bg-muted/20 rounded-xl border border-border/30 hover:bg-muted/40 transition-all cursor-pointer group/msg relative">
         <div className="flex items-center gap-1.5 mb-1.5">
           <MessageSquare className="h-3 w-3 text-primary/60" />
           <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/70">Interação</span>
           {deal.last_message_at && (
             <span className="text-[9px] text-muted-foreground/60 ml-auto flex items-center gap-1">
               <Clock className="h-2.5 w-2.5" />
               {formatDistanceToNow(new Date(deal.last_message_at), { addSuffix: true, locale: ptBR })}
             </span>
           )}
         </div>
         <p className="text-[11px] text-foreground/70 line-clamp-2 leading-snug italic font-medium">
           "{deal.last_message || "Aguardando primeira mensagem..."}"
         </p>
         
         {isStale && (
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
           <div className="text-[9px] text-muted-foreground/60 mt-1 font-bold">
             {deal.created_at ? new Date(deal.created_at).toLocaleDateString('pt-BR') : ""}
           </div>
         </div>
       </div>
     </div>
   );
 }