 import { createFileRoute } from "@tanstack/react-router";
 import { AppSidebar } from "@/components/layout/Sidebar";
 import { Topbar } from "@/components/layout/Topbar";
 import { Card } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Wallet, ArrowUpCircle, ArrowDownCircle, Search, Filter, MoreHorizontal } from "lucide-react";
 
 export const Route = createFileRoute("/financeiro/caixa")({
   component: FinanceCaixaPage,
 });
 
 function FinanceCaixaPage() {
   const transactions = [
     { id: 1, type: "Entrada", desc: "Venda iPhone 13 #1024", value: 4500.00, date: "2024-03-27 14:20", category: "Vendas" },
     { id: 2, type: "Saída", desc: "Pagamento Fornecedor X", value: 1200.00, date: "2024-03-27 11:15", category: "Compras" },
     { id: 3, type: "Entrada", desc: "OS #1005 - Troca de Tela", value: 350.00, date: "2024-03-27 09:30", category: "Serviços" },
   ];
 
   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <Topbar title="Caixa e Bancos" subtitle="Controle de Saldo" />
         <main className="flex-1 overflow-y-auto p-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-glow">
               <div className="flex justify-between items-start mb-4">
                 <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center backdrop-blur-sm">
                   <ArrowUpCircle className="h-6 w-6" />
                 </div>
                 <span className="text-xs font-bold opacity-80 uppercase tracking-wider">Entradas Hoje</span>
               </div>
               <div className="text-2xl font-black">R$ 4.850,00</div>
             </Card>
             <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white border-none shadow-glow">
               <div className="flex justify-between items-start mb-4">
                 <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center backdrop-blur-sm">
                   <ArrowDownCircle className="h-6 w-6" />
                 </div>
                 <span className="text-xs font-bold opacity-80 uppercase tracking-wider">Saídas Hoje</span>
               </div>
               <div className="text-2xl font-black">R$ 1.200,00</div>
             </Card>
             <Card className="p-6 bg-card border-border shadow-sm">
               <div className="flex justify-between items-start mb-4">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                   <Wallet className="h-6 w-6" />
                 </div>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Saldo Total</span>
               </div>
               <div className="text-2xl font-black text-primary">R$ 124.580,00</div>
             </Card>
           </div>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <div className="flex items-center gap-3">
               <div className="relative flex-1 md:w-80">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <input placeholder="Buscar lançamento..." className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition" />
               </div>
               <Button variant="outline" className="h-10 rounded-xl border-border">
                 <Filter className="h-4 w-4 mr-2" /> Filtros
               </Button>
             </div>
             <div className="flex gap-2">
               <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">Registrar Saída</Button>
               <Button className="bg-gradient-primary shadow-glow">Registrar Entrada</Button>
             </div>
           </div>
           <Card className="border-border shadow-card overflow-hidden">
             <table className="w-full text-left">
               <thead>
                 <tr className="border-b border-border bg-muted/30">
                   <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data / Hora</th>
                   <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Descrição</th>
                   <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoria</th>
                   <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Valor</th>
                   <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {transactions.map(t => (
                   <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                     <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{t.date}</td>
                     <td className="px-6 py-4 font-medium text-sm">{t.desc}</td>
                     <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase">{t.category}</span></td>
                     <td className={`px-6 py-4 text-right font-black text-sm ${t.type === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                       {t.type === 'Entrada' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                     </td>
                     <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </Card>
         </main>
       </div>
     </div>
   );
 }
