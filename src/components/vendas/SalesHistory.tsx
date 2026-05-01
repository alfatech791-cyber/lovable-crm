 import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Download, MoreHorizontal, ShoppingBag, Eye, Printer, Calendar, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, AlertCircle, Loader2, FileText } from "lucide-react";
 import { Card, CardContent } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { 
   DropdownMenu, 
   DropdownMenuContent, 
   DropdownMenuItem, 
   DropdownMenuTrigger,
   DropdownMenuSeparator
 } from "@/components/ui/dropdown-menu";
 
 const mockSales = [
   { id: "V1001", customer: "João Silva", date: "2024-03-27 14:30", total: 7899.00, method: "Cartão de Crédito", status: "Concluída", items: 1 },
   { id: "V1002", customer: "Maria Oliveira", date: "2024-03-27 12:15", total: 149.90, method: "PIX", status: "Concluída", items: 2 },
   { id: "V1003", customer: "Pedro Santos", date: "2024-03-26 16:45", total: 6599.00, method: "Dinheiro", status: "Cancelada", items: 1 },
   { id: "V1004", customer: "Ana Souza", date: "2024-03-26 10:20", total: 259.80, method: "Cartão de Débito", status: "Concluída", items: 3 },
 ];
 
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { toast } from "sonner";
 import { format } from "date-fns";
 import { ptBR } from "date-fns/locale";
 
 export function SalesHistory() {
   const { user } = useAuth();
   const [sales, setSales] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
 
   const fetchSales = useCallback(async () => {
     if (!user?.id) return;
     setLoading(true);
     try {
       const { data, error } = await supabase
         .from("sales_orders")
         .select(`
           *,
           customers (
             full_name
           )
         `)
         .eq("user_id", user.id)
         .order("created_at", { ascending: false });
 
       if (error) throw error;
       setSales(data || []);
     } catch (error) {
       console.error("Erro ao carregar vendas:", error);
       toast.error("Erro ao carregar histórico de vendas.");
     } finally {
       setLoading(false);
     }
   }, [user?.id]);
 
   useEffect(() => {
     fetchSales();
   }, [fetchSales]);
 
   const filteredSales = sales.filter(sale => {
     const s = searchTerm.toLowerCase();
     return (
       sale.id.toLowerCase().includes(s) ||
       sale.customers?.full_name?.toLowerCase().includes(s) ||
       sale.payment_method?.toLowerCase().includes(s)
     );
   });
 
   const stats = {
     todayTotal: sales
       .filter(s => new Date(s.created_at).toDateString() === new Date().toDateString())
       .reduce((acc, curr) => acc + (curr.total_amount || 0), 0),
     todayCount: sales.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length,
     avgTicket: sales.length > 0 
       ? sales.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) / sales.length 
       : 0,
     canceledCount: sales.filter(s => s.status === 'canceled').length
   };
 
   return (
     <div className="space-y-6">
       {/* Resumo de Vendas */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
           <CardContent className="p-6">
             <div className="flex items-center justify-between space-y-0 pb-2">
               <p className="text-sm font-medium">Vendas Hoje</p>
               <ShoppingBag className="h-4 w-4 text-muted-foreground" />
             </div>
              <div className="text-2xl font-bold">
                {stats.todayTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats.todayCount} vendas concluídas hoje</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-6">
             <div className="flex items-center justify-between space-y-0 pb-2">
               <p className="text-sm font-medium">Ticket Médio</p>
               <div className="h-4 w-4 text-muted-foreground flex items-center justify-center font-bold text-[10px]">R$</div>
             </div>
              <div className="text-2xl font-bold">
                {stats.avgTicket.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
             <p className="text-xs text-muted-foreground mt-1">Baseado em 30 dias</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-6">
             <div className="flex items-center justify-between space-y-0 pb-2">
               <p className="text-sm font-medium">Vendas Canceladas</p>
               <XCircle className="h-4 w-4 text-destructive" />
             </div>
              <div className="text-2xl font-bold text-destructive">{stats.canceledCount}</div>
             <p className="text-xs text-muted-foreground mt-1">Últimos 7 dias</p>
           </CardContent>
         </Card>
         <Card>
           <CardContent className="p-6">
             <div className="flex items-center justify-between space-y-0 pb-2">
               <p className="text-sm font-medium">Aguardando Pagamento</p>
               <AlertCircle className="h-4 w-4 text-warning" />
             </div>
             <div className="text-2xl font-bold text-warning">R$ 1.250,00</div>
             <p className="text-xs text-muted-foreground mt-1">3 orçamentos pendentes</p>
           </CardContent>
         </Card>
       </div>
 
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                placeholder="Buscar por ID, cliente ou status..." 
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                      <p className="text-xs text-muted-foreground mt-2">Carregando histórico...</p>
                    </td>
                  </tr>
                ) : filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-muted-foreground text-sm">
                      Nenhuma venda encontrada.
                    </td>
                  </tr>
                ) : filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] font-bold text-primary">{sale.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold">{sale.customers?.full_name || 'Consumidor Final'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {format(new Date(sale.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      -
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="bg-muted px-2 py-1 rounded font-medium uppercase">{sale.payment_method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold">
                        {(sale.total_amount || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center w-fit gap-1 ${
                        sale.status === 'concluded' 
                           ? 'bg-success/10 text-success border-success/20' 
                           : sale.status === 'pending'
                           ? 'bg-warning/10 text-warning border-warning/20'
                           : 'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        {sale.status === 'concluded' ? <CheckCircle2 className="h-3 w-3" /> : sale.status === 'pending' ? <AlertCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {sale.status === 'concluded' ? 'CONCLUÍDA' : sale.status === 'pending' ? 'PENDENTE' : 'CANCELADA'}
                      </span>
                    </td>
                   <td className="px-6 py-4 text-right">
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8">
                           <MoreHorizontal className="h-4 w-4" />
                         </Button>
                       </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" /> Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Printer className="h-4 w-4" /> Imprimir Comprovante
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <FileText className="h-4 w-4" /> Imprimir Termo de Garantia
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                            <XCircle className="h-4 w-4" /> Cancelar Venda
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
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