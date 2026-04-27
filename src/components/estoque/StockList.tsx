 import { useState } from "react";
 import { Package, Search, Plus, Filter, MoreHorizontal, ArrowUpDown, AlertTriangle, Edit, Trash2, History } from "lucide-react";
 import { products } from "@/lib/mock";
 import { ProductForm } from "./ProductForm";
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
 
 export function StockList() {
   const [isAddOpen, setIsAddOpen] = useState(false);
   const [editingProduct, setEditingProduct] = useState<any>(null);

   return (
     <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input 
               placeholder="Buscar por nome, categoria ou IMEI..." 
               className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
             />
           </div>
           <button className="h-10 px-4 rounded-xl border border-border bg-card flex items-center gap-2 text-sm font-medium hover:bg-muted transition">
             <Filter className="h-4 w-4" /> Categorias
           </button>
         </div>
         <div className="flex items-center gap-2">
           <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition">
             Exportar CSV
           </button>
            <button onClick={() => setIsAddOpen(true)} className="h-10 px-5 rounded-xl bg-gradient-primary text-white flex items-center gap-2 text-sm font-bold shadow-glow hover:opacity-95 transition">
             <Plus className="h-4 w-4" /> Novo Produto
           </button>
         </div>
       </div>
 
       <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
         <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-border bg-muted/30">
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Produto</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoria</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Estoque</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Preço Venda</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                 <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
               {products.map((product) => (
                 <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0">
                         <Package className="h-5 w-5 text-muted-foreground" />
                       </div>
                       <div>
                         <div className="font-semibold text-sm">{product.name}</div>
                         {product.imei && <div className="text-[10px] text-muted-foreground font-mono">IMEI: {product.imei}</div>}
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-xs px-2 py-1 rounded bg-muted font-medium">{product.category}</span>
                   </td>
                   <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <span className={`text-sm font-bold ${product.stock <= 3 ? 'text-destructive' : ''}`}>{product.stock} un</span>
                       {product.stock <= 3 && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span className="text-sm font-bold text-primary">
                       {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                     </span>
                   </td>
                   <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${product.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                       {product.stock > 0 ? 'EM ESTOQUE' : 'ESGOTADO'}
                     </span>
                   </td>
                   <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 rounded-lg hover:bg-muted transition">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setEditingProduct(product)} className="gap-2">
                            <Edit className="h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <History className="h-4 w-4" /> Movimentação
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" /> Excluir
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

       <ProductForm open={isAddOpen} onOpenChange={setIsAddOpen} />
       <ProductForm 
         open={!!editingProduct} 
         onOpenChange={(open) => !open && setEditingProduct(null)} 
         product={editingProduct} 
       />
     </div>
   );
 }