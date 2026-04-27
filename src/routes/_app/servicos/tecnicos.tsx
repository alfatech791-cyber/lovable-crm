 import { Topbar } from "@/components/layout/Topbar";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { UserPlus, MoreVertical, Star } from "lucide-react";
 
 export default function OSTechniciansPage() {
   const technicians = [
     { id: 1, name: "Carlos Eduardo", role: "Técnico Sênior", rating: 4.8, jobs: 142, status: "Disponível" },
     { id: 2, name: "Ana Paula", role: "Especialista Apple", rating: 4.9, jobs: 89, status: "Em Bancada" },
     { id: 3, name: "Ricardo Santos", role: "Técnico Júnior", rating: 4.5, jobs: 215, status: "Almoço" },
   ];
 
   return (
     <div className="flex flex-col h-full bg-background">
       <Topbar title="Gestão de Técnicos" />
       <main className="flex-1 overflow-y-auto p-6">
         <div className="flex justify-between items-center mb-8">
           <div>
             <h2 className="text-xl font-bold">Equipe Técnica</h2>
             <p className="text-sm text-muted-foreground mt-1">Monitore o desempenho e disponibilidade da sua equipe.</p>
           </div>
           <Button className="bg-gradient-primary shadow-glow">
             <UserPlus className="h-4 w-4 mr-2" /> Novo Técnico
           </Button>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {technicians.map(tech => (
             <Card key={tech.id} className="p-6 border-border/50 hover:shadow-card transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
               
               <div className="flex items-start justify-between mb-4">
                 <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center text-white text-xl font-black shadow-glow">
                   {tech.name.charAt(0)}
                 </div>
                 <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                   <MoreVertical className="h-5 w-5" />
                 </button>
               </div>
 
               <div className="space-y-1">
                 <h3 className="font-bold text-lg">{tech.name}</h3>
                 <p className="text-sm text-muted-foreground">{tech.role}</p>
               </div>
 
               <div className="mt-6 grid grid-cols-2 gap-4">
                 <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                   <div className="flex items-center gap-1.5 text-orange-500 mb-1">
                     <Star className="h-3.5 w-3.5 fill-current" />
                     <span className="text-xs font-bold">{tech.rating}</span>
                   </div>
                   <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Avaliação</div>
                 </div>
                 <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                   <div className="text-sm font-black mb-1">{tech.jobs}</div>
                   <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Serviços</div>
                 </div>
               </div>
 
               <div className="mt-6 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <span className={`h-2 w-2 rounded-full ${tech.status === 'Disponível' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : tech.status === 'Em Bancada' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                   <span className="text-xs font-medium text-muted-foreground">{tech.status}</span>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 text-xs">Ver Perfil</Button>
               </div>
             </Card>
           ))}
         </div>
       </main>
     </div>
   );
 }