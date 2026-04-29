 import { useState, useMemo, useEffect, useCallback } from "react";
 import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, QrCode, User, Package, ChevronRight, X, UserPlus, Info, Loader2 } from "lucide-react";
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
   const [loadingProducts, setLoadingProducts] = useState(false);
   const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
   const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
   const [customersList, setCustomersList] = useState<{ id: string; full_name: string }[]>([]);
   const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
   const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
   const [receivedAmount, setReceivedAmount] = useState<string>("");
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
 
   const filteredProducts = useMemo(() => {
     if (!search) return [];
     const s = search.toLowerCase();
     return allProducts.filter(p => 
       p.name.toLowerCase().includes(s) || 
       p.category.toLowerCase().includes(s)
     );
   }, [search, allProducts]);
 
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
 
   return (
     <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 h-[calc(100vh-160px)]">
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
             <Button variant="outline" onClick={() => setIsCheckoutModalOpen(false)}>Voltar</Button>
             <Button 
               className="bg-primary hover:bg-primary/90 min-w-[150px]" 
               onClick={handleFinishSale}
               disabled={!receivedAmount || parseFloat(receivedAmount) < total}
             >
               Confirmar Recebimento
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
               <Input placeholder="Buscar cliente por nome ou CPF..." className="pl-9" />
             </div>
             <ScrollArea className="h-[200px] rounded-md border p-4">
               <div className="space-y-2">
                 {['João Silva', 'Maria Oliveira', 'Pedro Santos'].map((name, i) => (
                   <button
                     key={i}
                     onClick={() => {
                       setSelectedCustomer({ id: String(i), name });
                       setIsCustomerModalOpen(false);
                       toast.info(`Cliente ${name} vinculado.`);
                     }}
                     className="w-full text-left p-3 hover:bg-muted rounded-lg border border-transparent hover:border-border transition flex items-center justify-between group"
                   >
                     <div className="font-medium">{name}</div>
                     <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                   </button>
                 ))}
               </div>
             </ScrollArea>
             <Button variant="secondary" className="w-full gap-2">
               <UserPlus className="h-4 w-4" /> Cadastrar Novo Cliente
             </Button>
           </div>
         </DialogContent>
       </Dialog>
 
       {/* Left Side: Product Selection */}
       <div className="flex flex-col gap-6 overflow-hidden">
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <input
               type="text"
               placeholder="Buscar por nome, código ou IMEI..."
               className="w-full h-14 pl-12 pr-4 rounded-xl bg-muted/50 border-none focus:ring-2 focus:ring-primary text-lg outline-none transition"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               autoFocus
             />
           </div>
 
           {search && (
             <div className="mt-4 border border-border rounded-xl overflow-hidden max-h-[400px] overflow-y-auto">
               {filteredProducts.length > 0 ? (
                 filteredProducts.map(product => (
                   <button
                     key={product.id}
                     onClick={() => addToCart(product)}
                     className="w-full flex items-center gap-4 p-4 hover:bg-muted transition text-left border-b border-border last:border-none"
                   >
                     <div className="h-12 w-12 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                       <Package className="h-6 w-6 text-primary" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="font-semibold truncate">{product.name}</div>
                       <div className="text-sm text-muted-foreground">
                         {product.category} • Estoque: {product.stock}
                         {product.imei && ` • IMEI: ${product.imei}`}
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="font-bold text-primary">
                         {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                       </div>
                     </div>
                   </button>
                 ))
               ) : (
                 <div className="p-8 text-center text-muted-foreground">Nenhum produto encontrado.</div>
               )}
             </div>
           )}
         </div>
 
          <div className="flex-1 flex flex-col min-h-0">
            <Tabs defaultValue="all" className="w-full h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 bg-muted/30">
                <TabsTrigger value="all">Tudo</TabsTrigger>
                <TabsTrigger value="phones">Aparelhos</TabsTrigger>
                <TabsTrigger value="acc">Acessórios</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-1 mt-4">
                <TabsContent value="all" className="m-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {['Smartphones', 'Acessórios', 'Peças', 'Serviços', 'Películas', 'Cabos', 'Fones', 'Carregadores'].map(cat => (
                      <button key={cat} className="h-28 rounded-2xl border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition flex flex-col items-center justify-center gap-2 font-medium group">
                        <div className="h-10 w-10 rounded-full bg-muted group-hover:bg-primary/10 grid place-items-center transition"><Package className="h-5 w-5 text-muted-foreground group-hover:text-primary" /></div>
                        <span className="text-sm">{cat}</span>
                      </button>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
         </div>
       </div>
 
       {/* Right Side: Cart & Checkout */}
       <div className="bg-card border border-border rounded-2xl flex flex-col shadow-card overflow-hidden">
         <div className="p-5 border-b border-border flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-lg">
             <ShoppingCart className="h-5 w-5 text-primary" />
             Carrinho
           </div>
           <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
             {cart.length} itens
           </span>
         </div>
 
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {cart.length > 0 ? (
             cart.map(item => (
               <div key={item.id} className="flex gap-3">
                 <div className="flex-1 min-w-0">
                   <div className="text-sm font-semibold truncate">{item.name}</div>
                   <div className="text-xs text-muted-foreground">
                     {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="flex items-center bg-muted rounded-lg border border-border px-1">
                     <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary transition"><Minus className="h-3 w-3" /></button>
                     <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary transition"><Plus className="h-3 w-3" /></button>
                   </div>
                   <button onClick={() => removeFromCart(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition">
                     <Trash2 className="h-4 w-4" />
                   </button>
                 </div>
               </div>
             ))
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-8">
               <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
               <p>Seu carrinho está vazio</p>
               <p className="text-xs">Busque produtos acima para começar</p>
             </div>
           )}
         </div>
 
         <div className="p-6 bg-muted/30 border-t border-border space-y-4">
           <div className="flex items-center justify-between text-sm">
             <span className="text-muted-foreground">Subtotal</span>
             <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
           </div>
           <div className="flex items-center justify-between text-sm">
              <button 
                onClick={() => {
                  const val = prompt("Valor do desconto (R$):", "0");
                  if (val) setDiscountValue(parseFloat(val));
                }}
                className="text-muted-foreground hover:text-primary underline underline-offset-4 decoration-dotted transition"
              >
                Aplicar Desconto
              </button>
              <span className="text-success font-medium">
                - {discountValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
           </div>
           <div className="flex items-center justify-between text-xl font-black pt-2">
             <span>Total</span>
             <span className="text-primary">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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
 
           <button 
             disabled={cart.length === 0 || !paymentMethod}
              onClick={() => setIsCheckoutModalOpen(true)}
             className="w-full h-14 bg-gradient-primary text-white rounded-xl font-bold text-lg shadow-glow hover:opacity-95 transition disabled:opacity-50 disabled:shadow-none"
           >
             Finalizar Venda
           </button>
 
            <button 
              onClick={() => setIsCustomerModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition py-1"
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
   );
 }