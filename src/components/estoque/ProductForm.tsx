import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tag, DollarSign, History, CheckCircle2, Plus, Cpu, Upload, Image as ImageIcon, Hash, Settings2, Info as InfoIcon, Zap, Box, ClipboardList, Warehouse, MapPin, Percent, Globe, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ProductFormData {
  name: string;
  sku?: string;
  ean?: string;
  ncm?: string;
  reference?: string;
  category: string;
  brand?: string;
  supplier?: string;
  model?: string;
  price: number;
  wholesale_price?: number;
  cost_price?: number;
  stock: number;
  min_stock?: number;
  unit: string;
  weight?: number;
  location?: string;
  store?: string;
   imei?: string;
   imei2?: string;
  color?: string;
  capacity?: string;
  description?: string;
   processor?: string;
   ram?: string;
   display?: string;
   image_url?: string;
   margin?: number;
   markup?: number;
   battery_health?: string;
   observations?: string;
 }

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  onSave?: (data: ProductFormData) => void;
}

export function ProductForm({ open, onOpenChange, product, onSave }: ProductFormProps) {
  const [existingBrands, setExistingBrands] = useState<string[]>([]);
  const [existingSuppliers, setExistingSuppliers] = useState<string[]>([]);

  useEffect(() => {
    const fetchExistingData = async () => {
      const { data: brandsData } = await (window as any).supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .neq('brand', '');
      
      const { data: suppliersData } = await (window as any).supabase
        .from('products')
        .select('supplier')
        .not('supplier', 'is', null)
        .neq('supplier', '');

      if (brandsData) {
        const uniqueBrands = Array.from(new Set(brandsData.map((b: any) => b.brand)));
        setExistingBrands(uniqueBrands as string[]);
      }
      if (suppliersData) {
        const uniqueSuppliers = Array.from(new Set(suppliersData.map((s: any) => s.supplier)));
        setExistingSuppliers(uniqueSuppliers as string[]);
      }
    };

    if (open) {
      fetchExistingData();
    }
  }, [open]);
  const [isSmartphone, setIsSmartphone] = useState(product?.category === "Smartphones");
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    sku: product?.sku || "",
    ean: product?.ean || "",
    ncm: product?.ncm || "",
    reference: product?.reference || "",
    category: product?.category || "Acessórios",
    brand: product?.brand || "apple",
    supplier: product?.supplier || "padrao",
    model: product?.model || "",
    price: product?.price || 0,
    wholesale_price: product?.wholesale_price || 0,
    cost_price: product?.cost_price || 0,
    stock: product?.stock || 0,
    min_stock: product?.min_stock || 2,
    unit: product?.unit || "un",
    weight: product?.weight || 0,
    location: product?.location || "",
    store: product?.store || "matriz",
      imei: product?.imei || "",
      imei2: product?.imei2 || "",
    color: product?.color || "",
    capacity: product?.capacity || "",
    description: product?.description || "",
     image_url: product?.image_url || "",
      processor: product?.processor || "",
      ram: product?.ram || "",
      display: product?.display || "",
      battery_health: product?.battery_health || "",
      observations: product?.observations || "",
      margin: 0,
      markup: 0,
    });

  useEffect(() => {
    if (product) {
      setIsSmartphone(product.category === "Smartphones");
      const { margin, markup } = calculateFromPrice(product.price || 0, product.cost_price);
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        ean: product.ean || "",
        ncm: product.ncm || "",
        reference: product.reference || "",
        category: product.category || "Acessórios",
        brand: product.brand || "apple",
        supplier: product.supplier || "padrao",
        model: product.model || "",
        price: product.price || 0,
        wholesale_price: product.wholesale_price || 0,
        cost_price: product.cost_price || 0,
        stock: product.stock || 0,
        min_stock: product.min_stock || 2,
        unit: product.unit || "un",
        weight: product.weight || 0,
        location: product.location || "",
        store: product.store || "matriz",
         imei: product.imei || "",
         imei2: product.imei2 || "",
        color: product.color || "",
        capacity: product.capacity || "",
        description: product.description || "",
        image_url: product.image_url || "",
         processor: product.processor || "",
         ram: product.ram || "",
         display: product.display || "",
         battery_health: product.battery_health || "",
         observations: product.observations || "",
         margin,
         markup,
       });
    }
  }, [product]);

    const calculateFromPrice = (price: number, cost: number | undefined) => {
      if (!cost || !price) return { margin: 0, markup: 0 };
     const grossProfit = price - cost;
     const margin = (grossProfit / price) * 100;
     const markup = (grossProfit / cost) * 100;
     return { margin: Math.max(0, margin), markup: Math.max(0, markup) };
   };

   const calculateFromMargin = (margin: number, cost: number) => {
     if (!cost) return 0;
     if (margin >= 100) return cost * 10; // Avoid division by zero
     return cost / (1 - margin / 100);
   };

   const calculateFromMarkup = (markup: number, cost: number) => {
     if (!cost) return 0;
     return cost * (1 + markup / 100);
   };

   const handleChange = (field: keyof ProductFormData, value: any) => {
     setFormData(prev => {
       const newData = { ...prev, [field]: value };
       
        if (field === "price" || field === "cost_price") {
          const p = field === "price" ? (typeof value === 'number' ? value : parseFloat(value) || 0) : prev.price;
          const c = field === "cost_price" ? (typeof value === 'number' ? value : parseFloat(value) || 0) : prev.cost_price;
          const { margin, markup } = calculateFromPrice(p, c);
         newData.margin = margin;
         newData.markup = markup;
       } else if (field === "margin") {
         newData.price = calculateFromMargin(value, prev.cost_price || 0);
         const { markup } = calculateFromPrice(newData.price, prev.cost_price || 0);
         newData.markup = markup;
       } else if (field === "markup") {
         newData.price = calculateFromMarkup(value, prev.cost_price || 0);
         const { margin } = calculateFromPrice(newData.price, prev.cost_price || 0);
         newData.margin = margin;
       }
       
       return newData;
     });
     
     if (field === "category") {
       setIsSmartphone(value === "Smartphones");
     }
   };

   const grossProfit = (formData.price || 0) - (formData.cost_price || 0);

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1400px] p-0 overflow-hidden border-sidebar-border bg-background backdrop-blur-xl h-[95vh] flex flex-col shadow-elegant">
        <DialogHeader className="p-6 pb-4 bg-muted/20">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
              {product ? <History className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-2xl font-black tracking-tight">{product ? "Editar Registro" : "Novo Cadastro"}</DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                 {product ? "Atualização de estoque e metadados" : "Todos os dados concentrados em uma única página"}
                 <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] uppercase font-bold py-0 h-4">Fluxo Unificado</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-muted/5">
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
               <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                     <section className="lg:col-span-8 bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                         <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <Tag className="h-3 w-3" /> Identificação Básica & Marca
                         </h3>
                         
                         <div className="grid gap-5">
                         <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                           <div className="md:col-span-8 grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1 flex items-center gap-2">
                               Nome do Produto
                               <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-primary/20 text-primary">Obrigatório</Badge>
                             </Label>
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={(e) => handleChange("name", e.target.value)}
                          placeholder="Ex: Apple iPhone 15 Pro Max 256GB" 
                          className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" 
                          required
                        />
                           </div>
                           <div className="md:col-span-4 grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Código Interno / SKU</Label>
                              <Input 
                                value={formData.sku}
                                onChange={(e) => handleChange("sku", e.target.value)}
                                placeholder="AUTO-GEN-001" 
                                className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" 
                              />
                           </div>
                         </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                           <div className="md:col-span-3 grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">EAN / Código de Barras</Label>
                             <Input 
                               value={formData.ean}
                               onChange={(e) => handleChange("ean", e.target.value)}
                               placeholder="789..." 
                               className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" 
                             />
                           </div>
                           <div className="md:col-span-3 grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Código NCM</Label>
                             <Input 
                               value={formData.ncm}
                               onChange={(e) => handleChange("ncm", e.target.value)}
                               placeholder="8517.13.00" 
                               className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" 
                             />
                           </div>
                           <div className="md:col-span-3 grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Referência do Fabricante</Label>
                             <Input 
                               value={formData.reference}
                               onChange={(e) => handleChange("reference", e.target.value)}
                               placeholder="REF-123" 
                               className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" 
                             />
                           </div>
                          <div className="md:col-span-3 grid gap-2">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1 flex items-center gap-2">
                              Tipo do Produto
                              <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-primary/20 text-primary">Estoque</Badge>
                            </Label>
                            <Select defaultValue="simples">
                              <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="simples">Produto Simples</SelectItem>
                                <SelectItem value="composto">Produto Composto</SelectItem>
                                <SelectItem value="servico">Serviço</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                           <div className="grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Categoria</Label>
                             <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                               <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                               <SelectContent className="border-border shadow-elegant">
                                 <SelectItem value="Smartphones">Smartphones</SelectItem>
                                 <SelectItem value="Tablets">Tablets</SelectItem>
                                 <SelectItem value="Watch">Smartwatches</SelectItem>
                                 <SelectItem value="Acessórios">Acessórios</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                           <div className="grid gap-2 relative">
                               <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Fabricante / Marca</Label>
                               <div className="relative group">
                                 <Input 
                                   value={formData.brand}
                                   onChange={(e) => handleChange("brand", e.target.value)}
                                   placeholder="Ex: Apple, Samsung..." 
                                   className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all pr-10" 
                                 />
                                 {existingBrands.length > 0 && (
                                   <Select onValueChange={(v) => handleChange("brand", v)}>
                                     <SelectTrigger className="absolute right-0 top-0 h-11 w-10 border-none bg-transparent shadow-none focus:ring-0">
                                       <span className="sr-only">Selecionar existente</span>
                                     </SelectTrigger>
                                     <SelectContent>
                                       {existingBrands.map(brand => (
                                         <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 )}
                               </div>
                             </div>
                            <div className="grid gap-2 relative">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Fornecedor</Label>
                              <div className="relative group">
                                <Input 
                                  value={formData.supplier}
                                  onChange={(e) => handleChange("supplier", e.target.value)}
                                  placeholder="Ex: Apple Brasil, Fornecedor X..." 
                                  className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all pr-10" 
                                />
                                {existingSuppliers.length > 0 && (
                                  <Select onValueChange={(v) => handleChange("supplier", v)}>
                                    <SelectTrigger className="absolute right-0 top-0 h-11 w-10 border-none bg-transparent shadow-none focus:ring-0">
                                      <span className="sr-only">Selecionar existente</span>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {existingSuppliers.map(supplier => (
                                        <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                            </div>
                           <div className="grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Modelo / Referência</Label>
                             <Input 
                               value={formData.model}
                               onChange={(e) => handleChange("model", e.target.value)}
                               placeholder="iPhone 15 Pro Max" 
                               className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" 
                             />
                           </div>
                         </div>
                       </div>
                     </section>

                     <section className="lg:col-span-4 bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <Settings2 className="h-3 w-3" /> Visibilidade & Status
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-card border border-sidebar-border/30">
                               <Label className="text-[9px] font-bold uppercase opacity-60">Status do Produto</Label>
                               <Select value={formData.location === "indisponivel" ? "indisponivel" : (formData.location === "rascunho" ? "rascunho" : "ativo")} onValueChange={(v) => handleChange("location", v)}>
                                  <SelectTrigger className="h-7 text-[10px] bg-transparent border-none p-0 focus:ring-0 shadow-none font-bold"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                     <SelectItem value="ativo">Disponível para Venda</SelectItem>
                                     <SelectItem value="rascunho">Aguardando Revisão</SelectItem>
                                     <SelectItem value="indisponivel">Indisponível</SelectItem>
                                  </SelectContent>
                               </Select>
                            </div>
                           <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-sidebar-border/30">
                              <div className="space-y-0.5">
                                <Label className="text-[9px] font-bold uppercase opacity-60">Destaque na Home</Label>
                                <p className="text-[8px] text-muted-foreground">Exibir na vitrine principal</p>
                              </div>
                              <Switch className="scale-75" />
                           </div>
                           <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-sidebar-border/30">
                              <div className="space-y-0.5">
                                <Label className="text-[9px] font-bold uppercase opacity-60">Venda Exclusiva</Label>
                                <p className="text-[8px] text-muted-foreground">Apenas para clientes VIP</p>
                              </div>
                              <Switch className="scale-75" />
                           </div>
                        </div>
                     </section>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                     <div className="lg:col-span-8 space-y-6">
                        <section className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
                           <div className="flex items-center justify-between">
                              <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                                 <InfoIcon className="h-3 w-3" /> Descrição Comercial
                              </h3>
                               <Button variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase gap-1.5 px-3 rounded-lg border-primary/30 text-primary hover:bg-primary/5 shadow-sm"><Zap className="h-3 w-3 fill-current" /> IA</Button>
                            </div>
                           <textarea 
                             value={formData.description}
                             onChange={(e) => handleChange("description", e.target.value)}
                             className="w-full bg-muted/20 border border-border rounded-xl p-3 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 min-h-[120px] custom-scrollbar transition-all leading-relaxed" 
                             placeholder="Diferenciais competitivos..." 
                           />
                        </section>

                        <section className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                             <ClipboardList className="h-3 w-3" /> Ficha Técnica / Spec
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="grid gap-1.5">
                                 <Label className="text-[9px] font-bold uppercase opacity-60">Processador</Label>
                                 <Input 
                                   value={formData.processor}
                                   onChange={(e) => handleChange("processor", e.target.value)}
                                   className="h-9 text-xs bg-muted/10 border-border" 
                                   placeholder="Ex: A17 Pro" 
                                 />
                               </div>
                               <div className="grid gap-1.5">
                                 <Label className="text-[9px] font-bold uppercase opacity-60">Memória RAM</Label>
                                 <Input 
                                   value={formData.ram}
                                   onChange={(e) => handleChange("ram", e.target.value)}
                                   className="h-9 text-xs bg-muted/10 border-border" 
                                   placeholder="Ex: 8GB" 
                                 />
                               </div>
                               <div className="grid gap-1.5">
                                 <Label className="text-[9px] font-bold uppercase opacity-60">Display</Label>
                                 <Input 
                                   value={formData.display}
                                   onChange={(e) => handleChange("display", e.target.value)}
                                   className="h-9 text-xs bg-muted/10 border-border" 
                                   placeholder="Ex: 6.7 OLED" 
                                 />
                               </div>
                           </div>
                        </section>
                     </div>

                     <div className="lg:col-span-4 space-y-6">
                  <section className="bg-card rounded-2xl border border-border p-5 space-y-5 shadow-sm h-full">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> Mídia do Produto
                    </h3>
                    <div className="space-y-4">
                      {formData.image_url ? (
                        <div className="relative aspect-square rounded-3xl overflow-hidden border border-border group">
                          <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => handleChange("image_url", "")}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="aspect-square border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary/[0.02] hover:border-primary/40 transition-all cursor-pointer group bg-muted/10">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-glow">
                            <Upload className="h-5 w-5" />
                          </div>
                          <div className="text-center px-4">
                             <span className="text-[10px] font-black text-primary uppercase tracking-widest block">URL da Imagem</span>
                             <Input 
                               value={formData.image_url}
                               onChange={(e) => handleChange("image_url", e.target.value)}
                               placeholder="https://..."
                               className="mt-2 h-8 text-[10px] bg-transparent border-primary/20"
                             />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Gestão de Estoque, Preço e Localização */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-border/50">
                 <section className="bg-primary/5 rounded-2xl border border-primary/10 p-5 space-y-5">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <DollarSign className="h-3.5 w-3.5" /> Precificação e Venda
                   </h5>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Venda (Varejo)</Label>
                        <div className="relative group">
                           <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-primary text-primary-foreground font-black text-[10px] rounded-l-xl shadow-glow">R$</div>
                           <Input 
                             id="price" 
                             type="number" 
                             value={formData.price}
                             onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                             className="bg-card h-12 border-primary/20 focus:ring-4 focus:ring-primary/5 text-lg font-black text-primary transition-all pl-12" 
                           />
                         </div>
                      </div>
                       <div className="grid gap-4">
                         <div className="grid gap-2">
                           <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Venda (Atacado)</Label>
                           <div className="relative group">
                              <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-muted text-muted-foreground font-black text-[10px] rounded-l-xl border border-r-0 border-border">R$</div>
                              <Input 
                                type="number" 
                                value={formData.wholesale_price}
                                onChange={(e) => handleChange("wholesale_price", parseFloat(e.target.value) || 0)}
                                className="bg-card h-12 border-border focus:ring-4 focus:ring-primary/5 text-lg font-black transition-all pl-12" 
                              />
                            </div>
                         </div>
                         <div className="grid gap-2">
                           <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Custo (Compra)</Label>
                           <div className="relative group">
                              <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-muted text-muted-foreground font-black text-[10px] rounded-l-xl border border-r-0 border-border">R$</div>
                              <Input 
                                type="number" 
                                value={formData.cost_price}
                                onChange={(e) => handleChange("cost_price", parseFloat(e.target.value) || 0)}
                                className="bg-card h-12 border-border focus:ring-4 focus:ring-primary/5 text-lg font-black transition-all pl-12" 
                              />
                            </div>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                         <div className="grid gap-1.5">
                           <div className="flex items-center justify-between">
                             <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Margem (%)</Label>
                             <div className="flex gap-1">
                               <button onClick={() => handleChange("margin", 30)} className="text-[8px] px-1 bg-primary/10 hover:bg-primary/20 rounded transition-colors text-primary font-bold">30%</button>
                               <button onClick={() => handleChange("margin", 50)} className="text-[8px] px-1 bg-primary/10 hover:bg-primary/20 rounded transition-colors text-primary font-bold">50%</button>
                             </div>
                           </div>
                           <div className="relative">
                             <Input 
                               type="number" 
                               value={formData.margin?.toFixed(2)} 
                               onChange={(e) => handleChange("margin", parseFloat(e.target.value) || 0)}
                               className="bg-card h-9 border-border text-xs font-bold pr-7" 
                             />
                             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                           </div>
                         </div>
                         <div className="grid gap-1.5">
                           <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Markup (%)</Label>
                           <div className="relative">
                             <Input 
                               type="number" 
                               value={formData.markup?.toFixed(2)} 
                               onChange={(e) => handleChange("markup", parseFloat(e.target.value) || 0)}
                               className="bg-card h-9 border-border text-xs font-bold pr-7" 
                             />
                             <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                           </div>
                         </div>
                       </div>
                       <div className="pt-2 space-y-3">
                          <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${grossProfit > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-destructive/10 border-destructive/20'}`}>
                             <div className="space-y-0.5">
                                <span className={`text-[9px] font-black uppercase block ${grossProfit > 0 ? 'text-emerald-600' : 'text-destructive'}`}>Lucro Real por Unidade</span>
                                <span className={`text-sm font-black ${grossProfit > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(grossProfit)}
                                </span>
                             </div>
                             <div className={`p-2 rounded-lg ${grossProfit > 0 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-destructive/20 text-destructive'}`}>
                               <Percent className="h-4 w-4" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Warehouse className="h-3.5 w-3.5" /> Estoque & Unidade
                   </h5>
                   <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Estoque Inicial</Label>
                        <Input 
                          id="stock" 
                          type="number" 
                          value={formData.stock}
                          onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
                          className="bg-card h-12 border-border font-black text-lg text-center focus:ring-4 focus:ring-primary/5 transition-all" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Estoque Mínimo</Label>
                        <Input 
                          id="min_stock" 
                          type="number" 
                          value={formData.min_stock}
                          onChange={(e) => handleChange("min_stock", parseInt(e.target.value) || 0)}
                          className="bg-card h-12 border-border text-center text-warning font-black text-lg focus:ring-4 focus:ring-warning/5 transition-all" 
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Unidade de Medida</Label>
                        <Select value={formData.unit} onValueChange={(v) => handleChange("unit", v)}>
                          <SelectTrigger className="bg-card h-11 border-border font-semibold transition-all"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="un">Unidade (UN)</SelectItem>
                            <SelectItem value="cx">Caixa (CX)</SelectItem>
                            <SelectItem value="jg">Jogo (JG)</SelectItem>
                            <SelectItem value="pc">Peça (PC)</SelectItem>
                            <SelectItem value="kit">Kit (KIT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Peso Bruto (kg)</Label>
                        <Input 
                          type="number" 
                          step="0.001" 
                          value={formData.weight}
                          onChange={(e) => handleChange("weight", parseFloat(e.target.value) || 0)}
                          placeholder="0.250" 
                          className="bg-card h-11 border-border text-sm font-bold" 
                        />
                      </div>
                   </div>
                 </section>

                  <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                    <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" /> Armazenamento & Localização
                    </h5>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Localização (Box/Prateleira)</Label>
                        <Input 
                          value={formData.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                          placeholder="Ex: A-12-04" 
                          className="bg-card h-11 border-border text-sm font-mono font-black" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Loja / Depósito</Label>
                        <Select value={formData.store} onValueChange={(v) => handleChange("store", v)}>
                          <SelectTrigger className="bg-card h-11 border-border font-semibold transition-all"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="matriz">Loja Matriz</SelectItem>
                            <SelectItem value="filial1">Filial Centro</SelectItem>
                            <SelectItem value="deposito">Depósito Central</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Status Inicial</Label>
                        <Select value={formData.location || 'ativo'} onValueChange={(v) => handleChange("location", v)}>
                          <SelectTrigger className="bg-card h-11 border-border font-semibold transition-all"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="rascunho">Rascunho</SelectItem>
                            <SelectItem value="indisponivel">Indisponível</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>
               </div>

              {/* Técnico */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-border/50">
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Hash className="h-3 w-3" /> Identificação Técnica
                  </h5>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">SKU / Part Number</Label>
                      <Input 
                        value={formData.sku} 
                        onChange={(e) => handleChange("sku", e.target.value)}
                        placeholder="GER-100234" 
                        className="bg-muted/10 h-11 border-border text-xs font-bold font-mono tracking-widest" 
                      />
                    </div>
                     {isSmartphone && (
                       <>
                         <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">IMEI 1 (SIM 1)</Label>
                            <Input 
                              id="imei" 
                              value={formData.imei} 
                              onChange={(e) => handleChange("imei", e.target.value)}
                              placeholder="Ex: 356789..." 
                              className="bg-muted/10 h-12 border-border font-mono text-sm tracking-[0.2em] font-black focus:ring-4 focus:ring-primary/5 transition-all" 
                            />
                         </div>
                         <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">IMEI 2 (SIM 2)</Label>
                            <Input 
                              id="imei2" 
                              value={formData.imei2} 
                              onChange={(e) => handleChange("imei2", e.target.value)}
                              placeholder="Ex: 356789..." 
                              className="bg-muted/10 h-12 border-border font-mono text-sm tracking-[0.2em] font-black focus:ring-4 focus:ring-primary/5 transition-all" 
                            />
                         </div>
                       </>
                     )}
                  </div>
                </div>

                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Cpu className="h-3 w-3" /> Hardware & Estética
                  </h5>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Cor</Label>
                        <Input 
                          value={formData.color} 
                          onChange={(e) => handleChange("color", e.target.value)} 
                          placeholder="Ex: Titânio Natural" 
                          className="bg-muted/10 h-10 border-border text-xs font-bold" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Capacidade</Label>
                        <Input 
                          value={formData.capacity} 
                          onChange={(e) => handleChange("capacity", e.target.value)} 
                          placeholder="Ex: 256GB" 
                          className="bg-muted/10 h-10 border-border text-xs font-bold" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Saúde da Bateria (%)</Label>
                        <Input 
                          value={formData.battery_health} 
                          onChange={(e) => handleChange("battery_health", e.target.value)} 
                          placeholder="Ex: 100%" 
                          className="bg-muted/10 h-10 border-border text-xs font-bold" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Observações</Label>
                        <textarea 
                          value={formData.observations}
                          onChange={(e) => handleChange("observations", e.target.value)}
                          className="w-full bg-muted/10 border border-border rounded-xl p-3 text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 min-h-[80px] custom-scrollbar transition-all leading-relaxed" 
                          placeholder="Observações internas..." 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
        </div>

        <DialogFooter className="p-6 gap-4 bg-muted/30 border-t border-border shrink-0">
          <div className="mr-auto hidden md:flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
             <InfoIcon className="h-3.5 w-3.5 text-primary/60" /> Verifique todos os dados antes de salvar o registro
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all">Descartar</Button>
          <Button onClick={handleSave} className="bg-gradient-primary shadow-glow gap-3 px-10 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest group">
            {product ? <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" /> : <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />}
            {product ? "Salvar Registro" : "Concluir Cadastro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
