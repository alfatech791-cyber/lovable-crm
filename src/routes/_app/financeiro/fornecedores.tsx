 import { Topbar } from "@/components/layout/Topbar";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Building2, Plus, Phone, Mail, Globe, Search } from "lucide-react";
 
 export default function FinanceFornecedoresPage() {
   const suppliers = [
     { id: 1, name: "Mega Distribuidora S.A", category: "Peças & Telas", contact: "(11) 98888-7777", email: "comercial@mega.com" },
     { id: 2, name: "Apple Brasil", category: "Aparelhos", contact: "0800-761-0880", email: "apple@apple.com" },
     { id: 3, name: "Tech Solutions", category: "Acessórios", contact: "(21) 3333-2222", email: "vendas@tech.com.br" },
   ];
 
   return (
     <div className="flex flex-col h-full bg-background">
       <Topbar title="Fornecedores" />
       <main className="flex-1 overflow-y-auto p-6">
         <div className="flex justify-between items-center mb-8">
           <div className="relative w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input placeholder="Buscar fornecedor..." className="w-full h-11 pl-10 rounded-2xl bg-card border border-border outline-none focus:ring-2 focus:ring-primary/20 transition" />
           </div>
           <Button className="bg-gradient-primary shadow-glow h-11 rounded-xl font-bold">
             <Plus className="h-5 w-5 mr-2" /> Adicionar Fornecedor
           </Button>
         </div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {suppliers.map(s => (
             <Card key={s.id} className="p-6 border-border/50 hover:shadow-card transition-all group overflow-hidden relative">
               <div className="absolute top-0 right-0 h-1.5 w-full bg-primary/20" />
               <div className="flex items-start gap-4 mb-6">
                 <div className="h-12 w-12 rounded-xl bg-muted/50 grid place-items-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                   <Building2 className="h-6 w-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{s.name}</h3>
                   <p className="text-xs text-muted-foreground mt-1 uppercase font-black tracking-widest">{s.category}</p>
                 </div>
               </div>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                   <Phone className="h-4 w-4 text-primary/60" /> {s.contact}
                 </div>
                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                   <Mail className="h-4 w-4 text-primary/60" /> {s.email}
                 </div>
                 <div className="flex items-center gap-3 text-sm text-muted-foreground">
                   <Globe className="h-4 w-4 text-primary/60" /> www.website.com.br
                 </div>
               </div>
 
               <div className="mt-6 pt-6 border-t border-border/50 flex gap-2">
                 <Button variant="ghost" className="flex-1 h-9 text-xs">Histórico Compra</Button>
                 <Button variant="outline" className="flex-1 h-9 text-xs">Ver Detalhes</Button>
               </div>
             </Card>
           ))}
         </div>
       </main>
     </div>
   );
 }