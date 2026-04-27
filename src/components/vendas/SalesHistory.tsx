 import { Search, Filter, Download, MoreHorizontal, ShoppingBag, Eye, Printer, Calendar } from "lucide-react";
 
 const mockSales = [
   { id: "V1001", customer: "João Silva", date: "2024-03-27 14:30", total: 7899.00, method: "Cartão de Crédito", status: "Concluída", items: 1 },
   { id: "V1002", customer: "Maria Oliveira", date: "2024-03-27 12:15", total: 149.90, method: "PIX", status: "Concluída", items: 2 },
   { id: "V1003", customer: "Pedro Santos", date: "2024-03-26 16:45", total: 6599.00, method: "Dinheiro", status: "Cancelada", items: 1 },
   { id: "V1004", customer: "Ana Souza", date: "2024-03-26 10:20", total: 259.80, method: "Cartão de Débito", status: "Concluída", items: 3 },
 ];
 
 export function SalesHistory() {
   return (
     <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input 
               placeholder="Buscar por ID, cliente ou status..." 
               className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
             />
           </div>
           <button className="h-10 px-4 rounded-xl border border-border bg-card flex items-center gap-2 text-sm font-medium hover:bg-muted transition">
             <Calendar className="h-4 w-4" /> Período
           </button>
         </div>
         <div className="flex items-center gap-2">
           <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition flex items-center gap-2">
             <Download className="h-4 w-4" /> Exportar
           </button>
         </div>
       </div>
 
       <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border bg-muted/30">
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">ID Venda</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Cliente</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Data/Hora</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Itens</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Pagamento</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {mockSales.map((sale) => (
                 <tr key={sale.id} className="hover:bg-muted/30 transition-colors group">
                   <td className="px-6 py-4">
                     <span className="font-mono text-xs font-bold text-primary">{sale.id}</span>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-sm font-semibold">{sale.customer}</div>
                   </td>
                   <td className="px-6 py-4 text-xs text-muted-foreground">
                     {sale.date}
                   </td>
                   <td className="px-6 py-4 text-sm">
                     {sale.items}
                   </td>
                   <td className="px-6 py-4 text-xs">
                     <span className="bg-muted px-2 py-1 rounded font-medium">{sale.method}</span>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-sm font-bold">
                       {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                     </span>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${
                       sale.status === 'Concluída' 
                         ? 'bg-green-50 text-green-700 border-green-200' 
                         : 'bg-red-50 text-red-700 border-red-200'
                     }`}>
                       {sale.status.toUpperCase()}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition"><Eye className="h-4 w-4" /></button>
                       <button className="p-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition"><Printer className="h-4 w-4" /></button>
                       <button className="p-1.5 rounded-lg hover:bg-muted transition"><MoreHorizontal className="h-4 w-4" /></button>
                     </div>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     </div>
   );
 }