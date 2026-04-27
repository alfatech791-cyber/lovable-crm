 import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet, Building2, Receipt } from "lucide-react";
 
 export function FinanceDashboard() {
   return (
     <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <div className="h-10 w-10 rounded-lg bg-green-50 text-green-600 grid place-items-center">
               <ArrowUpRight className="h-5 w-5" />
             </div>
             <span className="text-xs font-bold text-green-600">+15.2% vs mês ant.</span>
           </div>
           <div className="text-sm text-muted-foreground font-medium">Receitas (Mês)</div>
           <div className="text-2xl font-black mt-1">R$ 42.850,00</div>
         </div>
 
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <div className="h-10 w-10 rounded-lg bg-red-50 text-red-600 grid place-items-center">
               <ArrowDownRight className="h-5 w-5" />
             </div>
             <span className="text-xs font-bold text-red-600">-2.4% vs mês ant.</span>
           </div>
           <div className="text-sm text-muted-foreground font-medium">Despesas (Mês)</div>
           <div className="text-2xl font-black mt-1">R$ 18.230,00</div>
         </div>
 
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
           <div className="flex items-center justify-between mb-4">
             <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
               <DollarSign className="h-5 w-5" />
             </div>
           </div>
           <div className="text-sm text-muted-foreground font-medium">Saldo Projetado</div>
           <div className="text-2xl font-black mt-1 text-primary">R$ 24.620,00</div>
         </div>
       </div>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
           <h3 className="font-bold mb-4 flex items-center gap-2">
             <Wallet className="h-4 w-4 text-primary" /> Contas e Bancos
           </h3>
           <div className="space-y-4">
             {[
               { name: "Caixa Loja", type: "Dinheiro", balance: "R$ 1.250,00", icon: Wallet },
               { name: "Banco Itaú", type: "Corrente", balance: "R$ 12.800,00", icon: Building2 },
               { name: "Nubank", type: "Corrente", balance: "R$ 8.420,00", icon: Building2 },
             ].map(account => (
               <div key={account.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition cursor-pointer">
                 <div className="flex items-center gap-3">
                   <div className="h-9 w-9 rounded-lg bg-muted grid place-items-center">
                     <account.icon className="h-4.5 w-4.5 text-muted-foreground" />
                   </div>
                   <div>
                     <div className="text-sm font-semibold">{account.name}</div>
                     <div className="text-[11px] text-muted-foreground">{account.type}</div>
                   </div>
                 </div>
                 <div className="text-sm font-bold">{account.balance}</div>
               </div>
             ))}
           </div>
         </div>
 
         <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
           <h3 className="font-bold mb-4 flex items-center gap-2">
             <Receipt className="h-4 w-4 text-primary" /> Últimas Movimentações
           </h3>
           <div className="space-y-4">
             {[
               { desc: "Venda iPhone 13 #V123", cat: "Receita Vendas", value: "+ R$ 4.200,00", type: "in" },
               { desc: "Fornecedor Apple Parts", cat: "Compras", value: "- R$ 2.150,00", type: "out" },
               { desc: "Aluguel Loja", cat: "Custo Fixo", value: "- R$ 1.500,00", type: "out" },
               { desc: "Serviço Troca Tela #OS1003", cat: "Serviços", value: "+ R$ 350,00", type: "in" },
             ].map((move, i) => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border transition">
                 <div>
                   <div className="text-sm font-medium">{move.desc}</div>
                   <div className="text-[11px] text-muted-foreground">{move.cat}</div>
                 </div>
                 <div className={`text-sm font-bold ${move.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                   {move.value}
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>
   );
 }