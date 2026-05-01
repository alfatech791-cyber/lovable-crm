 import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, QrCode, User, Package, ChevronRight, X, UserPlus, Info, Loader2, ArrowLeft, History, Calculator, Percent, Tag, ReceiptText } from "lucide-react";
 import { Product } from "@/lib/mock";
 import { toast } from "sonner";
 import { supabase } from "@/integrations/supabase/client";
 import { useAuth } from "@/contexts/AuthContext";
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
 import { ScrollArea } from "@/components/ui/scroll-area";
 import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
 
 interface CartItem extends Product {
   quantity: number;
 }
 
 export function PDVInterface() {
   const { user } = useAuth();
   const [cart, setCart] = useState<CartItem[]>([]);
   const [search, setSearch] = useState("");
   const [allProducts, setAllProducts] = useState<Product[]>([]);
   const [loadingProducts, setLoadingProducts] = useState(true);
   const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
   const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
   const [customersList, setCustomersList] = useState<{ id: string; full_name: string }[]>([]);
   const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
   const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
   const [newCustomerName, setNewCustomerName] = useState("");
   const [newCustomerPhone, setNewCustomerPhone] = useState("");
   const [receivedAmount, setReceivedAmount] = useState<string>("");
   const [barcode, setBarcode] = useState("");
   const [vendedorId, setVendedorId] = useState<string>("");
   const [obs, setObs] = useState("");
   const [discountValue, setDiscountValue] = useState<number>(0);
   const [isFinishing, setIsFinishing] = useState(false);
 
   const fetchProducts = useCallback(async () => {
     if (!user?.id) return;
     setLoadingProducts(true);
     try {
       const { data, error } = await supabase
         .from("products")
         .select("*")
         .eq("user_id", user.id);
       
       if (error) throw error;
       
       const formattedProducts: Product[] = (data || []).map(p => ({
         id: p.id,
         name: p.name,
         category: p.category || "Geral",
         price: p.price || 0,
         stock: p.stock_quantity || 0,
         description: p.description || "",
         image: p.image_url || undefined
       }));
       
       setAllProducts(formattedProducts);
     } catch (error) {
       console.error("Erro ao carregar produtos:", error);
       toast.error("Erro ao carregar catálogo de produtos.");
     } finally {
       setLoadingProducts(false);
     }
   }, [user?.id]);
 
   const fetchCustomers = useCallback(async () => {
     if (!user?.id) return;
     try {
       const { data, error } = await supabase
         .from("customers")
         .select("id, full_name")
         .eq("user_id", user.id)
         .limit(50);
       
       if (error) throw error;
       setCustomersList(data || []);
     } catch (error) {
       console.error("Erro ao carregar clientes:", error);
     }
   }, [user?.id]);
 
   useEffect(() => {
     fetchProducts();
     fetchCustomers();
   }, [fetchProducts, fetchCustomers]);
 
   const [activeCategory, setActiveCategory] = useState("all");
   const [customerSearch, setCustomerSearch] = useState("");
 
   const filteredProducts = useMemo(() => {
     let filtered = allProducts;
     
     if (activeCategory !== "all") {
       const catMap: Record<string, string[]> = {
         "phones": ["Smartphones", "Celulares", "Aparelhos"],
         "acc": ["Acessórios", "Películas", "Cabos", "Fones", "Carregadores"],
         "services": ["Serviços", "Mão de Obra"]
       };
       const allowedCats = catMap[activeCategory] || [];
       filtered = filtered.filter(p => allowedCats.some(c => p.category.includes(c)));
     }
 
     if (!search) return filtered;
     const s = search.toLowerCase();
     return filtered.filter(p => 
       p.name.toLowerCase().includes(s) || 
       p.category.toLowerCase().includes(s)
     );
   }, [search, allProducts, activeCategory]);
 
   const filteredCustomers = useMemo(() => {
     if (!customerSearch) return customersList;
     const s = customerSearch.toLowerCase();
     return customersList.filter(c => c.full_name.toLowerCase().includes(s));
   }, [customerSearch, customersList]);
 
   const handleBarcodeSearch = (code: string) => {
     const product = allProducts.find(p => p.id === code || p.name.includes(code));
     if (product) {
       addToCart(product);
       setBarcode("");
     }
   };
 
   const addToCart = (product: Product) => {
     setCart(current => {
       const existing = current.find(item => item.id === product.id);
       if (existing) {
         return current.map(item => 
           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
         );
       }
       return [...current, { ...product, quantity: 1 }];
     });
     setSearch("");
   };
 
   const updateQuantity = (id: string, delta: number) => {
     setCart(current => current.map(item => {
       if (item.id === id) {
         const newQty = Math.max(1, item.quantity + delta);
         return { ...item, quantity: newQty };
       }
       return item;
     }));
   };
 
   const removeFromCart = (id: string) => {
     setCart(current => current.filter(item => item.id !== id));
   };
 
   const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
   const total = subtotal - discountValue;
   
   const change = receivedAmount ? Math.max(0, parseFloat(receivedAmount) - total) : 0;
 
   const handleFinishSale = async () => {
     if (!user?.id) return;
     setIsFinishing(true);
     try {
       // 1. Criar a ordem de venda
       const { data: sale, error: saleError } = await supabase
         .from("sales_orders")
         .insert({
           user_id: user.id,
           customer_id: selectedCustomer?.id || null,
           total_amount: total,
           discount_amount: discountValue,
           payment_method: paymentMethod,
           status: "concluded"
         })
         .select()
         .single();
 
       if (saleError) throw saleError;
 
       // 2. Atualizar estoque dos produtos
       for (const item of cart) {
         const product = allProducts.find(p => p.id === item.id);
         if (product) {
           const newStock = Math.max(0, product.stock - item.quantity);
           await supabase
             .from("products")
             .update({ stock_quantity: newStock })
             .eq("id", item.id);
         }
       }
 
       // 3. Registrar no financeiro (Fluxo de Caixa)
       await supabase
         .from("finance_transactions")
         .insert({
           user_id: user.id,
           type: "income",
           amount: total,
           description: `Venda PDV - #${sale.id.slice(0, 8)}`,
           category: "Vendas",
           status: "paid",
           payment_date: new Date().toISOString()
         });
 
       toast.success("Venda finalizada com sucesso!", {
         description: `Total de ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em ${paymentMethod?.toUpperCase()}`,
       });
 
         setCart([]);
         setPaymentMethod(null);
         setSelectedCustomer(null);
         setIsCheckoutModalOpen(false);
         setReceivedAmount("");
         setDiscountValue(0);
       fetchProducts(); // Atualiza estoque na interface
     } catch (error) {
       console.error("Erro ao finalizar venda:", error);
       toast.error("Erro ao processar a venda. Tente novamente.");
     } finally {
       setIsFinishing(false);
     }
   };
 
   const handleCreateCustomer = async () => {
     if (!user?.id || !newCustomerName) return;
     try {
       const { data, error } = await supabase
         .from("customers")
         .insert({
           user_id: user.id,
           full_name: newCustomerName,
           phone: newCustomerPhone,
         })
         .select()
         .single();

       if (error) throw error;

       toast.success("Cliente cadastrado com sucesso!");
       setSelectedCustomer({ id: data.id, name: data.full_name });
       setIsNewCustomerModalOpen(false);
       setIsCustomerModalOpen(false);
       fetchCustomers();
     } catch (error: any) {
       console.error("Erro ao criar cliente:", error);
       toast.error("Erro ao cadastrar cliente.");
     }
   };

    return (
      <div className="flex flex-col gap-4 h-[calc(100vh-140px)] animate-in fade-in duration-500">
        {/* Header de Ações Rápidas */}
        <div className="flex items-center justify-between bg-card p-4 border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full xl:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Frente de Caixa
                <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-primary/5">Operacional</Badge>
              </h2>
              <p className="text-xs text-muted-foreground">Terminal 01 • Atendente: {user?.email?.split('@')[0] || 'Usuário'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <History className="h-4 w-4" /> Histórico
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
              <Calculator className="h-4 w-4" /> Calculadora
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 flex-1 overflow-hidden">
          <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
           <DialogHeader>
             <DialogTitle>Finalizar Venda</DialogTitle>
           </DialogHeader>
           <div className="space-y-6 py-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Total a Pagar</Label>
                 <div className="text-2xl font-black text-primary">
                   {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </div>
               </div>
               <div className="space-y-2 text-right">
                 <Label>Troco</Label>
                 <div className="text-2xl font-black text-success">
                   {change.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </div>
               </div>
             </div>
 
             <div className="space-y-4">
               <div className="space-y-2">
                 <Label>Valor Recebido</Label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                   <Input 
                     type="number" 
                     placeholder="0,00" 
                     className="pl-10 h-12 text-lg font-bold"
                     value={receivedAmount}
                     onChange={(e) => setReceivedAmount(e.target.value)}
                     autoFocus
                   />
                 </div>
               </div>
 
               <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-border">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Forma de Pagamento:</span>
                   <span className="font-bold uppercase text-primary flex items-center gap-2">
                     {paymentMethod === 'money' && <Banknote className="h-4 w-4" />}
                     {paymentMethod === 'card' && <CreditCard className="h-4 w-4" />}
                     {paymentMethod === 'pix' && <QrCode className="h-4 w-4" />}
                     {paymentMethod}
                   </span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Cliente:</span>
                   <span className="font-bold">{selectedCustomer?.name || 'Consumidor Final'}</span>
                 </div>
               </div>
             </div>
           </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCheckoutModalOpen(false)} disabled={isFinishing}>Voltar</Button>
              <Button 
                className="bg-primary hover:bg-primary/90 min-w-[150px]" 
                onClick={handleFinishSale}
                disabled={!receivedAmount || parseFloat(receivedAmount) < total || isFinishing}
              >
                {isFinishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Recebimento"
                )}
              </Button>
            </DialogFooter>
         </DialogContent>
       </Dialog>
 
       <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Vincular Cliente</DialogTitle>
           </DialogHeader>
           <div className="space-y-4 py-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Buscar cliente por nome..." 
                 className="pl-9" 
                 value={customerSearch}
                 onChange={(e) => setCustomerSearch(e.target.value)}
               />
             </div>
             <ScrollArea className="h-[250px] rounded-md border p-4">
                <div className="space-y-2">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                       <button
                         key={customer.id}
                         onClick={() => {
                           setSelectedCustomer({ id: customer.id, name: customer.full_name });
                           setIsCustomerModalOpen(false);
                           toast.info(`Cliente ${customer.full_name} vinculado.`);
                         }}
                         className="w-full text-left p-3 hover:bg-muted rounded-lg border border-transparent hover:border-border transition flex items-center justify-between group"
                       >
                         <div className="font-medium">{customer.full_name}</div>
                         <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                       </button>
                     ))
                   ) : (
                     <div className="text-center py-4 text-muted-foreground text-sm">
                       Nenhum cliente encontrado.
                     </div>
                   )}
                 </div>
              </ScrollArea>
              <Button 
                variant="secondary" 
                className="w-full gap-2"
                onClick={() => {
                  setIsNewCustomerModalOpen(true);
                  setNewCustomerName(customerSearch);
                }}
              >
                <UserPlus className="h-4 w-4" /> Cadastrar Novo Cliente
              </Button>
           </div>
         </DialogContent>
       </Dialog>

        <Dialog open={isNewCustomerModalOpen} onOpenChange={setIsNewCustomerModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  placeholder="Ex: João Silva" 
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input 
                  placeholder="Ex: 11999999999" 
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-primary" 
                onClick={handleCreateCustomer}
                disabled={!newCustomerName}
              >
                Salvar e Vincular
              </Button>
            </div>
          </DialogContent>
        </Dialog>
 
         {/* Lado Esquerdo: Seleção de Produtos e Campos de Venda */}
         <div className="flex flex-col gap-4 overflow-hidden animate-in slide-in-from-left duration-500">
           {/* Barra Superior de Busca e Campos */}
           <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-card border border-border rounded-2xl p-4 shadow-sm">
             <div className="md:col-span-3 space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Código / EAN</Label>
               <div className="relative">
                 <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                 <Input 
                   placeholder="Código de barras" 
                   className="pl-9 h-11 bg-muted/20"
                   value={barcode}
                   onChange={(e) => setBarcode(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch(barcode)}
                 />
               </div>
             </div>
 
             <div className="md:col-span-5 space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Descrição do Produto (F2)</Label>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                 <Input 
                   placeholder="Digite o nome do produto..." 
                   className="pl-9 h-11 bg-muted/20"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   autoFocus
                 />
                 {(search || loadingProducts) && (
                   <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 border border-border rounded-xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto bg-card">
                     {loadingProducts ? (
                       <div className="p-8 flex flex-col items-center justify-center gap-2">
                         <Loader2 className="h-6 w-6 animate-spin text-primary" />
                       </div>
                     ) : filteredProducts.map(product => (
                       <button
                         key={product.id}
                         onClick={() => addToCart(product)}
                         className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 transition text-left border-b border-border last:border-none"
                       >
                         <div className="flex-1 min-w-0">
                           <div className="font-bold text-sm truncate">{product.name}</div>
                           <div className="text-[10px] text-muted-foreground">Estoque: {product.stock}</div>
                         </div>
                         <div className="font-black text-sm text-primary">
                           {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                         </div>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             </div>
 
             <div className="md:col-span-4 space-y-1.5">
               <Label className="text-[10px] font-bold uppercase text-muted-foreground">Vendedor (F4)</Label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                 <select 
                   className="w-full h-11 pl-9 pr-3 rounded-md bg-muted/20 border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                   value={vendedorId}
                   onChange={(e) => setVendedorId(e.target.value)}
                 >
                   <option value="">Selecione um vendedor</option>
                   <option value="1">Vendedor Padrão</option>
                   <option value={user?.id}>Eu ({user?.email?.split('@')[0]})</option>
                 </select>
                 <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90 pointer-events-none" />
               </div>
             </div>
           </div>
 
           {/* Observações da Venda */}
           <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
             <Label className="text-[10px] font-bold uppercase text-muted-foreground mb-1.5 block">Observações / Instruções</Label>
             <textarea 
               className="w-full h-20 bg-muted/10 border border-input rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-muted-foreground/50"
               placeholder="Ex: Entrega agendada, embalagem para presente..."
               value={obs}
               onChange={(e) => setObs(e.target.value)}
             />
           </div>
 
           <div className="flex-1 flex flex-col min-h-0">
             <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full h-full flex flex-col">
               <TabsList className="grid w-full grid-cols-4 bg-muted/30">
                 <TabsTrigger value="all">Tudo</TabsTrigger>
                 <TabsTrigger value="phones">Aparelhos</TabsTrigger>
                 <TabsTrigger value="acc">Acessórios</TabsTrigger>
                 <TabsTrigger value="services">Serviços</TabsTrigger>
               </TabsList>
               <ScrollArea className="flex-1 mt-4">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                   {allProducts
                     .filter(p => activeCategory === "all" || 
                       (activeCategory === "phones" && ["Smartphones", "Celulares", "Aparelhos"].some(c => p.category.includes(c))) ||
                       (activeCategory === "acc" && ["Acessórios", "Películas", "Cabos", "Fones", "Carregadores"].some(c => p.category.includes(c))) ||
                       (activeCategory === "services" && ["Serviços", "Mão de Obra"].some(c => p.category.includes(c)))
                     )
                     .slice(0, 12)
                     .map(product => (
                       <button
                         key={product.id}
                         onClick={() => addToCart(product)}
                         disabled={product.stock <= 0}
                         className={`h-28 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition flex flex-col items-center justify-center gap-2 font-medium group relative ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                       >
                         <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-primary/10 grid place-items-center transition">
                           <Package className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                         </div>
                         <span className="text-xs text-center px-2 line-clamp-2">{product.name}</span>
                         <div className="flex flex-col items-center">
                           <span className="text-[10px] font-bold text-primary">
                             {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                           </span>
                           <span className={`text-[8px] uppercase font-bold ${product.stock <= 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                             Estoque: {product.stock}
                           </span>
                         </div>
                         {product.stock <= 0 && (
                           <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-2xl">
                             <span className="bg-destructive text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Esgotado</span>
                           </div>
                         )}
                       </button>
                     ))}
                 </div>
               </ScrollArea>
             </Tabs>
          </div>
       </div>
 
        {/* Lado Direito: Carrinho e Checkout */}
        <div className="bg-card border border-border rounded-2xl flex flex-col shadow-xl overflow-hidden animate-in slide-in-from-right duration-500">
          <div className="p-5 border-b border-border bg-muted/20 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <span>Carrinho</span>
           </div>
            <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest">
             {cart.length} itens
           </span>
         </div>
 
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-3">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.id} className="group relative bg-card border border-border/40 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300">
                    <div className="flex gap-4">
                      {/* Avatar do Produto ou Ícone */}
                      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                        <Package className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Unitário</span>
                            <span className="text-sm font-semibold text-primary">
                              {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Seletor de Quantidade Moderno */}
                            <div className="flex items-center bg-muted/40 rounded-full border border-border/30 p-1 ring-1 ring-transparent group-hover:ring-primary/10 transition-all">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-background hover:text-primary hover:shadow-sm transition-all active:scale-90"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-background hover:text-primary hover:shadow-sm transition-all active:scale-90"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Total do Item */}
                            <div className="flex flex-col items-end min-w-[70px]">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight text-right">Subtotal</span>
                              <span className="text-sm font-black text-foreground">
                                {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-center animate-in fade-in zoom-in duration-500">
                  <div className="relative mb-4">
                    <ShoppingCart className="h-16 w-16 opacity-10" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary/20 rounded-full animate-ping" />
                  </div>
                  <p className="font-bold text-base text-foreground/70">Carrinho Vazio</p>
                  <p className="text-xs max-w-[180px] mt-1 leading-relaxed">Selecione produtos ao lado para iniciar uma nova venda</p>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="mt-4 text-primary font-bold"
                    onClick={() => document.querySelector('input')?.focus()}
                  >
                    Pesquisar agora (F2)
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
 
          <div className="p-5 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.04)] space-y-4 relative z-10">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                  <ReceiptText className="h-3 w-3" /> Subtotal Bruto
                </span>
                <span className="font-bold text-foreground/80">{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> Desconto Aplicado
                  </span>
                  <button 
                    onClick={() => {
                      const val = prompt("Valor do desconto (R$):", "0");
                      if (val !== null) setDiscountValue(Math.max(0, parseFloat(val) || 0));
                    }}
                    className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-black hover:bg-success/20 transition-colors"
                  >
                    EDITAR
                  </button>
                </div>
                <span className={`font-black ${discountValue > 0 ? 'text-success' : 'text-muted-foreground/50'}`}>
                  - {discountValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <div className="relative pt-4 mt-2 border-t border-dashed border-border">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-card px-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  Total a Receber
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-foreground/60 uppercase">Total</span>
                  <span className="text-3xl font-black text-primary tracking-tight">
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>
 
           <div className="grid grid-cols-3 gap-2 py-2">
             {[
               { id: 'money', icon: Banknote, label: 'Dinheiro' },
               { id: 'card', icon: CreditCard, label: 'Cartão' },
               { id: 'pix', icon: QrCode, label: 'PIX' },
             ].map(method => (
               <button
                 key={method.id}
                 onClick={() => setPaymentMethod(method.id)}
                 className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-[11px] font-bold uppercase
                   ${paymentMethod === method.id 
                     ? 'border-primary bg-primary/5 text-primary' 
                     : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted'
                   }`}
               >
                 <method.icon className="h-5 w-5" />
                 {method.label}
               </button>
             ))}
           </div>
 
            <Button 
              disabled={cart.length === 0 || !paymentMethod}
              onClick={() => setIsCheckoutModalOpen(true)}
              className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              FINALIZAR (F10)
            </Button>
 
            <button 
              onClick={() => setIsCustomerModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground hover:text-primary transition-all py-2 border border-dashed border-border rounded-xl hover:border-primary/50"
            >
             <User className="h-3 w-3" />
              {selectedCustomer ? (
                <span className="font-bold text-primary">{selectedCustomer.name}</span>
              ) : (
                "Identificar Cliente (Opcional)"
              )}
             <ChevronRight className="h-3 w-3" />
            </button>
         </div>
       </div>
     </div>
      </div>
   );
 }