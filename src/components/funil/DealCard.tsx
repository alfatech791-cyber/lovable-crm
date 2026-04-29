 import { Trash2, Phone, Calendar, DollarSign, GripVertical } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface DealCardProps {
   deal: any;
   onRemove: (id: string) => void;
   onDragStart: (id: string) => void;
   onDragEnd: () => void;
 }
 
 export function DealCard({ deal, onRemove, onDragStart, onDragEnd }: DealCardProps) {
   const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
 
   return (
     <div
       draggable
       onDragStart={() => onDragStart(deal.id)}
       onDragEnd={onDragEnd}
       className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
     >
       {/* Indicador de prioridade opcional */}
       {deal.priority === 'high' && <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />}
       
       <div className="flex items-start justify-between mb-2">
         <div className="flex items-center gap-2 flex-1 min-w-0">
           <GripVertical className="h-3 w-3 text-muted-foreground/30 shrink-0" />
           <div className="text-sm font-bold truncate text-foreground/90">{deal.lead?.name ?? "Lead sem nome"}</div>
         </div>
         <button 
           onClick={(e) => { e.stopPropagation(); onRemove(deal.id); }} 
           className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
         >
           <Trash2 className="h-3.5 w-3.5" />
         </button>
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
           <span>{new Date(deal.created_at).toLocaleDateString('pt-BR')}</span>
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