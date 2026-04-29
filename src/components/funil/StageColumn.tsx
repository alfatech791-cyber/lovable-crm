 import { Plus, MoreVertical, TrendingUp } from "lucide-react";
 import { DealCard } from "./DealCard";
 import { cn } from "@/lib/utils";
 
 interface StageColumnProps {
   stage: any;
   deals: any[];
   onAddDeal: (stageId: string) => void;
   onRemoveDeal: (id: string) => void;
   onMoveDeal: (dealId: string, newStageId: string) => void;
   dragId: string | null;
   setDragId: (id: string | null) => void;
 }
 
 export function StageColumn({ stage, deals, onAddDeal, onRemoveDeal, onMoveDeal, dragId, setDragId }: StageColumnProps) {
   const total = deals.reduce((s, d) => s + Number(d.deal_value ?? 0), 0);
   const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
 
   return (
     <div
       onDragOver={(e) => e.preventDefault()}
       onDrop={() => { if (dragId) onMoveDeal(dragId, stage.id); setDragId(null); }}
       className="w-[300px] shrink-0 flex flex-col h-full rounded-2xl bg-muted/30 border border-transparent hover:border-border/50 transition-colors"
     >
       {/* Header da Coluna */}
       <div className="p-4 flex flex-col gap-1 relative group">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="h-2.5 w-2.5 rounded-full shadow-sm" style={{ backgroundColor: stage.color ?? "#888" }} />
             <h3 className="text-xs font-black uppercase tracking-widest text-foreground/80">{stage.name}</h3>
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50 text-muted-foreground">
               {deals.length}
             </span>
             <button className="text-muted-foreground hover:text-foreground transition p-0.5">
               <MoreVertical className="h-3.5 w-3.5" />
             </button>
           </div>
         </div>
         
         <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-muted-foreground">
           <TrendingUp className="h-3 w-3" />
           {fmt(total)}
         </div>
         
         {/* Linha colorida de destaque no topo */}
         <div 
           className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-70" 
           style={{ backgroundColor: stage.color ?? "#888" }} 
         />
       </div>
 
       {/* Botão de Adição Rápida */}
       <div className="px-4 pb-2">
         <button
           onClick={() => onAddDeal(stage.id)}
           className="w-full py-2.5 rounded-xl border-2 border-dashed border-border/60 text-[11px] font-bold text-muted-foreground hover:bg-background/80 hover:text-primary hover:border-primary/40 hover:shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
         >
           <Plus className="h-4 w-4" /> NOVO NEGÓCIO
         </button>
       </div>
 
       {/* Lista de Cards */}
       <div className={cn(
         "flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-hide min-h-[150px] transition-colors",
         dragId && "bg-primary/5 rounded-b-2xl"
       )}>
         {deals.map((d) => (
           <DealCard
             key={d.id}
             deal={d}
             onRemove={onRemoveDeal}
             onDragStart={setDragId}
             onDragEnd={() => setDragId(null)}
           />
         ))}
         
         {deals.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center pt-10 opacity-30">
             <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground mb-2" />
             <p className="text-[10px] font-medium uppercase tracking-widest text-center">Solte aqui</p>
           </div>
         )}
       </div>
     </div>
   );
 }