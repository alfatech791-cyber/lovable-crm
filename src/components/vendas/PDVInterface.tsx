 import { useState, useMemo } from "react";
 import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, QrCode, User, Package, ChevronRight } from "lucide-react";
 import { products, Product } from "@/lib/mock";
 
 interface CartItem extends Product {
   quantity: number;
 }
 
 export function PDVInterface() {
   const [cart, setCart] = useState<CartItem[]>([]);
   const [search, setSearch] = useState("");
   const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
 
   const filteredProducts = useMemo(() => {
     if (!search) return [];
     return products.filter(p => 
       p.name.toLowerCase().includes(search.toLowerCase()) || 
       p.imei?.includes(search)
     );
   }, [search]);
 
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
   const discount = 0; // Mock discount
   const total = subtotal - discount;
 
   return (
     <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 h-[calc(100vh-180px)]">
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
 
         {/* Categories / Quick Actions */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-2">
           {['Smartphones', 'Acessórios', 'Peças', 'Serviços'].map(cat => (
             <button key={cat} className="h-24 rounded-2xl border border-border bg-card hover:bg-muted transition flex flex-col items-center justify-center gap-2 font-medium">
               <Package className="h-6 w-6 text-muted-foreground" />
               {cat}
             </button>
           ))}
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
             <span className="text-muted-foreground">Desconto</span>
             <span className="text-success font-medium">- R$ 0,00</span>
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
             className="w-full h-14 bg-gradient-primary text-white rounded-xl font-bold text-lg shadow-glow hover:opacity-95 transition disabled:opacity-50 disabled:shadow-none"
           >
             Finalizar Venda
           </button>
 
           <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
             <User className="h-3 w-3" />
             Cliente Final (Consumidor)
             <ChevronRight className="h-3 w-3" />
           </div>
         </div>
       </div>
     </div>
   );
 }