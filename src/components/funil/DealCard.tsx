import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
 import { Trash2, Phone, Calendar, DollarSign, GripVertical, Instagram, MessageCircle } from "lucide-react";
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
 
   return (
     <div
       draggable
       onDragStart={() => onDragStart(deal.id)}
       onDragEnd={onDragEnd}
       onClick={onClick}
       className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden active:scale-[0.98]"
     >
       {/* Indicador de prioridade opcional */}
       {deal.priority === 'high' && <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />}
       
        <div className="flex items-start justify-between mb-1">
         <div className="flex items-center gap-2 flex-1 min-w-0">
           <GripVertical className="h-3 w-3 text-muted-foreground/30 shrink-0" />
           <div className="text-sm font-bold truncate text-foreground/90">{deal.lead?.name ?? "Lead sem nome"}</div>
         </div>
          <div className="flex items-center gap-1">
            {deal.lead?.source === 'whatsapp' && <MessageCircle className="h-3.5 w-3.5 text-green-500" />}
            {deal.lead?.source === 'instagram' && <Instagram className="h-3.5 w-3.5 text-pink-500" />}
         <button 
           onClick={(e) => { e.stopPropagation(); onRemove(deal.id); }} 
           className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
         >
           <Trash2 className="h-3.5 w-3.5" />
         </button>
          </div>
       </div>

        {/* Preview da última mensagem */}
        <div className="mb-3 px-2 py-1.5 bg-muted/30 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[9px] font-bold uppercase text-muted-foreground/70">Última interação:</span>
            {deal.last_message_at && (
              <span className="text-[9px] text-muted-foreground ml-auto">{formatDistanceToNow(new Date(deal.last_message_at), { addSuffix: true, locale: ptBR })}</span>
            )}
          </div>
          <p className="text-[10px] text-foreground/80 line-clamp-2 leading-relaxed">
            {deal.last_message || "Aguardando primeira mensagem..."}
          </p>
        </div>
 
       <div className="space-y-1.5 mb-3">
         {deal.lead?.phone && (
           <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
             <Phone className="h-3 w-3" />
             <span>{deal.lead.phone}</span>
           </div>
         )}
         <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
           <Calendar className="h-3 w-3" />
           <span>{deal.created_at ? new Date(deal.created_at).toLocaleDateString('pt-BR') : "Data indisponível"}</span>
         </div>
       </div>
 
       <div className="flex items-center justify-between pt-2 border-t border-border/50">
         <div className="flex items-center gap-1 text-[12px] font-bold text-primary">
           <DollarSign className="h-3 w-3" />
           <span>{fmt(Number(deal.deal_value ?? 0))}</span>
         </div>
         
         {deal.lead?.source && (
           <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium uppercase tracking-tight">
             {deal.lead.source}
           </span>
         )}
       </div>
     </div>
   );
 }