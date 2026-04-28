import { useState, useMemo, useEffect } from "react";
import { 
  Package, Search, Plus, Filter, MoreHorizontal, ArrowUpDown, 
  AlertTriangle, Edit, Trash2, History, Layers, TrendingUp, 
  Clock, FileDown, Smartphone, Tablet, Watch, Loader2
} from "lucide-react";
 import { ProductForm } from "./ProductForm";
 import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
 
  export function StockList() {
    const { user } = useAuth();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [localProducts, setLocalProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewTab, setViewTab] = useState("all");

    useEffect(() => {
      if (!user?.id) return;
      setLoading(true);
      (async () => {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) toast.error("Erro ao carregar produtos: " + error.message);
        // Adapta campos do banco para o shape usado na UI
        const rows = (data ?? []).map((p: any) => ({
          ...p,
          stock: p.stock_quantity ?? 0,
        }));
        setLocalProducts(rows);
        setLoading(false);
      })();
    }, [user?.id]);

    const stats = useMemo(() => {
      const totalValue = localProducts.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
      const lowStock = localProducts.filter(p => (p.stock || 0) <= 3 && (p.stock || 0) > 0).length;
      const outOfStock = localProducts.filter(p => (p.stock || 0) === 0).length;
      return { totalValue, lowStock, outOfStock, totalItems: localProducts.length };
    }, [localProducts]);
 
   const filteredProducts = useMemo(() => {
     return localProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (product.imei?.includes(searchTerm));
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      
       if (viewTab === "low") return matchesSearch && matchesCategory && (product.stock || 0) <= 3 && (product.stock || 0) > 0;
       if (viewTab === "out") return matchesSearch && matchesCategory && (product.stock || 0) === 0;
      
      return matchesSearch && matchesCategory;
    });
   }, [searchTerm, filterCategory, viewTab, localProducts]);

   const handleAddProduct = async (data: any) => {
     if (!user?.id) return;
     const payload: any = {
       user_id: user.id,
       name: data.name,
       sku: data.sku ?? data.reference ?? null,
       category: data.category ?? null,
       price: Number(data.price ?? 0),
       cost_price: Number(data.cost_price ?? 0),
       stock_quantity: Number(data.stock ?? data.stock_quantity ?? 0),
       min_stock: Number(data.min_stock ?? 0),
       image_url: data.image ?? data.image_url ?? null,
       description: data.description ?? null,
     };
     const { data: row, error } = await supabase.from("products").insert(payload).select().single();
     if (error) return toast.error("Erro ao criar: " + error.message);
     setLocalProducts((prev) => [{ ...row, stock: row.stock_quantity }, ...prev]);
     toast.success("Produto criado!");
   };

   const handleUpdateProduct = async (data: any) => {
     if (!editingProduct) return;
     const payload: any = {
       name: data.name,
       sku: data.sku ?? data.reference ?? null,
       category: data.category ?? null,
       price: Number(data.price ?? 0),
       cost_price: Number(data.cost_price ?? 0),
       stock_quantity: Number(data.stock ?? data.stock_quantity ?? 0),
       min_stock: Number(data.min_stock ?? 0),
       image_url: data.image ?? data.image_url ?? null,
       description: data.description ?? null,
     };
     const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
     if (error) return toast.error("Erro ao salvar: " + error.message);
     setLocalProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...payload, stock: payload.stock_quantity } : p));
     toast.success("Produto atualizado!");
   };

   const handleDeleteProduct = async (id: string) => {
     if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
     const { error } = await supabase.from("products").delete().eq("id", id);
     if (error) return toast.error("Erro ao excluir: " + error.message);
     setLocalProducts((prev) => prev.filter((p) => p.id !== id));
     toast.success("Produto excluído.");
   };

   return (
     <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-sidebar-border bg-sidebar/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Total de Itens</p>
              <h3 className="text-xl font-bold">{stats.totalItems}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sidebar-border bg-sidebar/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Valor em Estoque</p>
              <h3 className="text-xl font-bold">{stats.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sidebar-border bg-sidebar/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Estoque Baixo</p>
              <h3 className="text-xl font-bold">{stats.lowStock}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-sidebar-border bg-sidebar/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Esgotados</p>
              <h3 className="text-xl font-bold">{stats.outOfStock}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
        <Tabs value={viewTab} onValueChange={setViewTab} className="w-full xl:w-auto">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="low" className="text-orange-500">Estoque Baixo</TabsTrigger>
            <TabsTrigger value="out" className="text-destructive">Esgotados</TabsTrigger>
          </TabsList>
        </Tabs>

         <div className="flex items-center gap-3">
           <div className="relative flex-1 md:w-80">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <input 
               placeholder="Buscar por nome, categoria ou IMEI..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
             />
           </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card border-border">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Categoria" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Smartphones">Smartphones</SelectItem>
              <SelectItem value="Acessórios">Acessórios</SelectItem>
            </SelectContent>
          </Select>
         </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-medium hover:bg-muted transition flex items-center gap-2">
            <FileDown className="h-4 w-4" /> Exportar
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
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Produto / Referência</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">NCM / EAN</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">Estoque Atual</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Preço Venda</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover shrink-0 border border-border" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted grid place-items-center shrink-0 border border-border">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-foreground leading-none mb-1">{product.name}</div>
                          <div className="flex items-center gap-2">
                            {product.reference && <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground font-medium">REF: {product.reference}</span>}
                            {product.brand && <span className="text-[10px] text-muted-foreground">{product.brand}</span>}
                            {product.imei && <div className="text-[10px] text-muted-foreground font-mono">IMEI: {product.imei}</div>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded leading-none">{product.ncm || '---'}</span>
                        <span className="text-[10px] font-mono text-muted-foreground leading-none">{product.ean || '---'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded bg-muted font-medium">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${(product.stock || 0) <= 3 ? 'text-destructive' : 'text-foreground'}`}>
                            {product.stock || 0}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">{product.unit || 'un'}</span>
                        </div>
                        <div className="w-16 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${ (product.stock || 0) <= 3 ? 'bg-destructive' : 'bg-primary' }`}
                            style={{ width: `${Math.min(((product.stock || 0) / 10) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">
                        {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${(product.stock || 0) > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {(product.stock || 0) > 0 ? 'EM ESTOQUE' : 'ESGOTADO'}
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
                           <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="gap-2 text-destructive focus:text-destructive">
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
         {loading && (
           <div className="p-12 grid place-items-center">
             <Loader2 className="h-6 w-6 animate-spin text-primary" />
           </div>
         )}
         {!loading && filteredProducts.length === 0 && (
           <div className="p-16 text-center">
             <div className="h-14 w-14 rounded-full bg-muted grid place-items-center mx-auto mb-3">
               <Package className="h-7 w-7 text-muted-foreground/40" />
             </div>
             <h3 className="text-base font-bold">Nenhum produto cadastrado</h3>
             <p className="text-sm text-muted-foreground mt-1">Clique em "Novo Produto" para começar.</p>
           </div>
         )}
       </div>

        <ProductForm open={isAddOpen} onOpenChange={setIsAddOpen} onSave={handleAddProduct} />
        <ProductForm 
          open={!!editingProduct} 
          onOpenChange={(open) => !open && setEditingProduct(null)} 
          product={editingProduct}
          onSave={handleUpdateProduct}
        />
     </div>
   );
 }