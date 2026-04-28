import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
 import { Smartphone, Tag, DollarSign, Layers, Hash, Info, History, CheckCircle2, Plus, Cpu, Upload, Image as ImageIcon, Truck, FileText, Globe, ShoppingBag, Percent, BarChart3, Settings2, Receipt, Info as InfoIcon, Zap, Copy, Box, ClipboardList, ShieldCheck, Warehouse, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const [isSmartphone, setIsSmartphone] = useState(product?.category === "Smartphones");

  useEffect(() => {
    if (product) {
      setIsSmartphone(product.category === "Smartphones");
    }
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-sidebar-border bg-background backdrop-blur-xl max-h-[90vh] flex flex-col shadow-elegant">
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
               {/* Identificação e Visibilidade */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <section className="lg:col-span-8 bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                       <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                         <Tag className="h-3 w-3" /> Identificação Básica
                       </h3>
                       
                        <div className="grid gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                            <div className="md:col-span-8 grid gap-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1 flex items-center gap-2">
                                Nome do Produto
                                <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-primary/20 text-primary">Obrigatório</Badge>
                              </Label>
                              <Input id="name" defaultValue={product?.name} placeholder="Ex: Apple iPhone 15 Pro Max 256GB" className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" />
                            </div>
                            <div className="md:col-span-4 grid gap-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Código Interno / SKU</Label>
                              <Input placeholder="AUTO-GEN-001" className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="grid gap-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Categoria</Label>
                              <Select defaultValue={product?.category || "Acessórios"} onValueChange={(v) => setIsSmartphone(v === "Smartphones")}>
                                <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                                <SelectContent className="border-border shadow-elegant">
                                  <SelectItem value="Smartphones">Smartphones</SelectItem>
                                  <SelectItem value="Tablets">Tablets</SelectItem>
                                  <SelectItem value="Watch">Smartwatches</SelectItem>
                                  <SelectItem value="Acessórios">Acessórios</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Fabricante / Marca</Label>
                              <Select defaultValue="apple">
                                <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                                <SelectContent className="border-border shadow-elegant">
                                  <SelectItem value="apple">Apple</SelectItem>
                                  <SelectItem value="samsung">Samsung</SelectItem>
                                  <SelectItem value="xiaomi">Xiaomi</SelectItem>
                                  <SelectItem value="motorola">Motorola</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Fornecedor</Label>
                              <Select defaultValue="padrao">
                                <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                                <SelectContent className="border-border shadow-elegant">
                                  <SelectItem value="padrao">Principal</SelectItem>
                                  <SelectItem value="dist">Distribuidora</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Modelo / Referência</Label>
                              <Input placeholder="iPhone 15 Pro Max" className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 text-sm font-bold transition-all" />
                  </div>
                </div>
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
                              <Select defaultValue="ativo">
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
                           <textarea className="w-full bg-muted/20 border border-border rounded-xl p-3 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 min-h-[120px] custom-scrollbar transition-all leading-relaxed" placeholder="Diferenciais competitivos..." />
                        </section>

                        <section className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                             <ClipboardList className="h-3 w-3" /> Ficha Técnica / Spec
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="grid gap-1.5">
                                <Label className="text-[9px] font-bold uppercase opacity-60">Processador</Label>
                                <Input className="h-9 text-xs bg-muted/10 border-border" placeholder="Ex: A17 Pro" />
                              </div>
                              <div className="grid gap-1.5">
                                <Label className="text-[9px] font-bold uppercase opacity-60">Memória RAM</Label>
                                <Input className="h-9 text-xs bg-muted/10 border-border" placeholder="Ex: 8GB" />
                              </div>
                              <div className="grid gap-1.5">
                                <Label className="text-[9px] font-bold uppercase opacity-60">Display</Label>
                                <Input className="h-9 text-xs bg-muted/10 border-border" placeholder="Ex: 6.7 OLED" />
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
                             <div className="aspect-square border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary/[0.02] hover:border-primary/40 transition-all cursor-pointer group bg-muted/10">
                               <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-glow">
                                 <Upload className="h-5 w-5" />
                               </div>
                               <div className="text-center px-4">
                                  <span className="text-[10px] font-black text-primary uppercase tracking-widest block">Upload Principal</span>
                                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">PNG, JPG até 5MB</span>
                               </div>
                             </div>
                             <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <div key={i} className="aspect-square border border-dashed border-border rounded-xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                                     <Plus className="h-3 w-3 text-muted-foreground/40" />
                                  </div>
                                ))}
                             </div>
                           </div>
                        </section>
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
                      <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Venda Final</Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-primary text-primary-foreground font-black text-[10px] rounded-l-xl shadow-glow">R$</div>
                        <Input id="price" type="number" defaultValue={product?.price} className="bg-card h-12 border-primary/20 focus:ring-4 focus:ring-primary/5 text-lg font-black text-primary transition-all pl-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço Atacado</Label>
                        <Input type="number" className="bg-card h-9 border-border text-xs font-bold" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-wider">Custo Médio</Label>
                        <Input type="number" className="bg-card h-9 border-border text-xs font-bold" />
                      </div>
                    </div>
                   </div>
                 </section>

                 <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Warehouse className="h-3.5 w-3.5" /> Controle de Estoque
                   </h5>
                   <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Saldo Atual</Label>
                        <Input id="stock" type="number" defaultValue={product?.stock} className="bg-card h-12 border-border font-black text-lg text-center focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Estoque Mín.</Label>
                        <Input id="min_stock" type="number" defaultValue={product?.min_stock || 2} className="bg-card h-12 border-border text-center text-warning font-black text-lg focus:ring-4 focus:ring-warning/5 transition-all" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-muted-foreground/60 block">Reservado</span>
                        <span className="text-xs font-black">0 un</span>
                      </div>
                      <Box className="h-4 w-4 text-muted-foreground/30" />
                    </div>
                   </div>
                 </section>

                 <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <MapPin className="h-3.5 w-3.5" /> Armazenamento
                   </h5>
                   <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Localização (Gôndola/Box)</Label>
                      <Input placeholder="Ex: A-12-04" className="bg-card h-10 border-border text-sm font-mono font-black" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Unidade de Medida</Label>
                      <Select defaultValue="un">
                        <SelectTrigger className="bg-card h-10 border-border text-xs font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="un">Unidade (UN)</SelectItem>
                          <SelectItem value="cx">Caixa (CX)</SelectItem>
                          <SelectItem value="jg">Jogo (JG)</SelectItem>
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
                      <Input placeholder="GER-100234" className="bg-muted/10 h-11 border-border text-xs font-bold font-mono tracking-widest" />
                    </div>
                    {isSmartphone && (
                      <div className="grid gap-2">
                         <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">IMEI Principal (SIM 1)</Label>
                         <Input id="imei" defaultValue={product?.imei} placeholder="Ex: 356789..." className="bg-muted/10 h-12 border-border font-mono text-sm tracking-[0.2em] font-black focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
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
                        <Input placeholder="Ex: Titânio Natural" className="bg-muted/10 h-10 border-border text-xs font-bold" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Capacidade</Label>
                        <Input placeholder="Ex: 256GB" className="bg-muted/10 h-10 border-border text-xs font-bold" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

               {/* Dados Fiscais, Logística e Extras */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-border/50">
                 <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Percent className="h-3 w-3" /> Fiscal & Tributário
                   </h5>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="grid gap-1.5">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">NCM</Label>
                       <Input placeholder="8517.13.00" className="bg-card h-9 border-border text-[10px] font-mono" />
                     </div>
                     <div className="grid gap-1.5">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">CEST</Label>
                       <Input placeholder="21.053.01" className="bg-card h-9 border-border text-[10px] font-mono" />
                     </div>
                     <div className="grid gap-1.5">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">ICMS %</Label>
                       <Input placeholder="18" className="bg-card h-9 border-border text-[10px]" />
                     </div>
                     <div className="grid gap-1.5">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">IPI %</Label>
                       <Input placeholder="5" className="bg-card h-9 border-border text-[10px]" />
                     </div>
                   </div>
                 </section>

                 <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Globe className="h-3 w-3" /> Logística & Dimensões
                   </h5>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="grid gap-1.5 col-span-2">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Peso Bruto (kg)</Label>
                       <Input type="number" step="0.001" placeholder="0.250" className="bg-card h-9 border-border text-[10px]" />
                     </div>
                     <div className="grid gap-1.5">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Largura (cm)</Label>
                       <Input type="number" placeholder="10" className="bg-card h-9 border-border text-[10px]" />
                     </div>
                     <div className="grid gap-1.5">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">Altura (cm)</Label>
                       <Input type="number" placeholder="5" className="bg-card h-9 border-border text-[10px]" />
                     </div>
                   </div>
                 </section>

                 <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Settings2 className="h-3 w-3" /> Configurações Extras
                   </h5>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
                       <div className="space-y-0.5">
                         <Label className="text-[10px] font-black uppercase opacity-70">Sincronizar</Label>
                         <p className="text-[8px] text-muted-foreground">Marketplaces</p>
                       </div>
                       <Switch className="scale-75" defaultChecked />
                     </div>
                     <div className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border">
                       <div className="space-y-0.5">
                         <Label className="text-[10px] font-black uppercase opacity-70">Notificar</Label>
                         <p className="text-[8px] text-muted-foreground">Estoque Baixo</p>
                       </div>
                       <Switch className="scale-75" defaultChecked />
                     </div>
                   </div>
                 </section>
               </div>
            </div>
        </div>

        <DialogFooter className="p-6 gap-4 bg-muted/30 border-t border-border shrink-0">
          <div className="mr-auto hidden md:flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
             <InfoIcon className="h-3.5 w-3.5 text-primary/60" /> Verifique todos os dados antes de salvar o registro
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive transition-all">Descartar</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-gradient-primary shadow-glow gap-3 px-10 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest group">
            {product ? <CheckCircle2 className="h-4 w-4 group-hover:scale-110 transition-transform" /> : <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />}
            {product ? "Salvar Registro" : "Concluir Cadastro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
