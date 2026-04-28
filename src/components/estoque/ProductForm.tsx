import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Package, Tag, DollarSign, Layers, Hash, Info, History, CheckCircle2, Plus, Box, ShieldCheck, Palette, Cpu, Upload, Image as ImageIcon, X, Truck, FileText, Globe, ShoppingBag, Percent, BarChart3, Settings2, Receipt, Search, Info as InfoIcon, Zap, MoreHorizontal, Copy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <DialogHeader>
          <div className="flex items-center gap-4 p-6 pb-4 bg-muted/20">
            <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-glow shrink-0">
              {product ? <History className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-2xl font-black tracking-tight">{product ? "Editar Registro" : "Novo Cadastro"}</DialogTitle>
              <DialogDescription className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                 {product ? "Atualização de estoque e metadados" : "Preencha os dados técnicos para visibilidade global"}
                 <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] uppercase font-bold py-0 h-4">Beta IA</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar bg-muted/5">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Tag className="h-3 w-3" /> Identificação Básica
                    </h3>
                    
                    <div className="grid gap-5">
                      <div className="grid gap-2.5">
                        <div className="flex items-center justify-between px-1">
                           <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest flex items-center gap-2">
                              Título Comercial do Anúncio
                              <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 border-primary/20 text-primary">Obrigatório</Badge>
                           </Label>
                           <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-tighter">0 / 80 Caracteres</span>
                        </div>
                        <Input id="name" defaultValue={product?.name} placeholder="Ex: Apple iPhone 15 Pro Max 256GB - Titânio Natural" className="bg-card h-14 border-border shadow-sm focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-base font-bold transition-all placeholder:font-medium" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Categoria</Label>
                          <Select defaultValue={product?.category || "Acessórios"} onValueChange={(v) => setIsSmartphone(v === "Smartphones")}>
                            <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                            <SelectContent className="border-border shadow-elegant">
                              <SelectItem value="Smartphones">Smartphones</SelectItem>
                              <SelectItem value="Tablets">Tablets</SelectItem>
                              <SelectItem value="Watch">Smartwatches</SelectItem>
                              <SelectItem value="Acessórios">Acessórios</SelectItem>
                              <SelectItem value="Peças">Peças Técnicas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest px-1">Fabricante</Label>
                          <Select defaultValue="apple">
                            <SelectTrigger className="bg-card h-11 border-border shadow-sm focus:ring-4 focus:ring-primary/5 font-semibold transition-all"><SelectValue /></SelectTrigger>
                            <SelectContent className="border-border shadow-elegant">
                              <SelectItem value="apple">Apple Inc.</SelectItem>
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
                              <SelectItem value="dist">Distribuidora Oficial</SelectItem>
                              <SelectItem value="import">Importação Direta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <Settings2 className="h-3 w-3" /> Visibilidade
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-card/40 border border-sidebar-border/30">
                              <Label className="text-[9px] font-bold uppercase opacity-60">Status</Label>
                              <Select defaultValue="ativo">
                                 <SelectTrigger className="h-7 text-[10px] bg-transparent border-none p-0 focus:ring-0 shadow-none"><SelectValue /></SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="ativo">Disponível</SelectItem>
                                    <SelectItem value="rascunho">Rascunho</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-card/40 border border-sidebar-border/30">
                              <Label className="text-[9px] font-bold uppercase opacity-60">Destaque</Label>
                              <div className="flex items-center justify-between h-7">
                                 <span className="text-[10px] font-medium">Home Page</span>
                                 <Switch className="scale-50 -mr-2" />
                              </div>
                           </div>
                        </div>
                     </section>

                     <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                           <Truck className="h-3 w-3" /> Tipo de Entrega
                        </h3>
                        <div className="flex flex-wrap gap-2">
                           {['Pronta Entrega', 'Retirada', 'Expressa'].map(t => (
                              <Badge key={t} variant="secondary" className="text-[9px] bg-primary/10 text-primary border-none hover:bg-primary/20 cursor-pointer">
                                 {t}
                              </Badge>
                           ))}
                        </div>
                     </section>
                  </div>

                  <section className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                          <InfoIcon className="h-3 w-3" /> Descrição Técnica (E-commerce)
                        </h3>
                        <div className="flex items-center gap-2">
                           <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase gap-1.5 px-3 rounded-lg hover:bg-muted"><Copy className="h-3 w-3" /> Copiar</Button>
                           <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase gap-1.5 px-4 rounded-lg border-primary/30 text-primary hover:bg-primary/5 shadow-sm"><Zap className="h-3 w-3 fill-current" /> Gerar com IA</Button>
                        </div>
                     </div>
                     <textarea className="w-full bg-muted/20 border border-border rounded-xl p-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 min-h-[180px] custom-scrollbar transition-all leading-relaxed" placeholder="Descreva os diferenciais competitivos, especificações e acessórios que acompanham o item..." />
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <section className="bg-card rounded-2xl border border-border p-5 space-y-5 shadow-sm">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> Galeria de Fotos
                    </h3>
                    <div className="space-y-4">
                      <div className="aspect-square border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary/[0.02] hover:border-primary/40 transition-all cursor-pointer group bg-muted/10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-glow">
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest block">Upload Principal</span>
                           <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Drag & drop ou clique</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 grid-rows-2 gap-3 aspect-square">
                         {Array.from({ length: 4 }).map((_, i) => (
                           <div key={i} className="border border-dashed border-border rounded-2xl flex items-center justify-center bg-muted/20 hover:bg-muted/30 hover:border-border/80 transition-all cursor-pointer">
                              <Plus className="h-4 w-4 text-muted-foreground/40" />
                           </div>
                         ))}
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                       <p className="text-[10px] font-medium text-primary leading-snug">
                          <strong className="font-black uppercase tracking-tighter mr-1">Dica Pro:</strong> Fotos com iluminação neutra e fundo limpo elevam o ticket médio em 15%.
                       </p>
                    </div>
                  </section>

                  <section className="bg-primary/5 rounded-2xl border border-primary/10 p-5 space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">Resumo do Registro</h3>
                    <div className="space-y-3">
                       <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">ID Interno</span>
                          <span className="font-mono text-primary">#PROD-{(Math.random()*10000).toFixed(0)}</span>
                       </div>
                       <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Criado por</span>
                          <span className="font-bold">Renato S.</span>
                       </div>
                       <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">Data Registro</span>
                          <span className="font-bold">{new Date().toLocaleDateString('pt-BR')}</span>
                       </div>
                    </div>
                  </section>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stock" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Coluna de Preços */}
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <DollarSign className="h-3 w-3" /> Financeiro
                  </h5>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Venda</Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center bg-primary/10 text-primary font-black text-sm rounded-l-xl border border-r-0 border-border group-focus-within:border-primary/40 transition-colors">R$</div>
                        <Input id="price" type="number" defaultValue={product?.price} className="bg-muted/10 h-14 pl-14 rounded-l-none border-border focus:ring-4 focus:ring-primary/5 text-xl font-black text-primary transition-all" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Custo Unitário</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-xs font-black">R$</span>
                          <Input type="number" className="bg-muted/5 h-11 pl-9 border-border text-sm font-bold" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Margem Bruta</Label>
                        <div className="relative">
                          <Input disabled value="35%" className="bg-success/5 h-11 pr-10 border-success/20 text-sm font-black text-success" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success font-black text-[10px] uppercase">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna de Estoque */}
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Layers className="h-3 w-3" /> Inventário
                  </h5>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Saldo Inicial</Label>
                        <Input id="stock" type="number" defaultValue={product?.stock} className="bg-muted/10 h-14 border-border font-black text-xl text-center focus:ring-4 focus:ring-primary/5 transition-all" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Mínimo (Alerta)</Label>
                        <Input id="min_stock" type="number" defaultValue={product?.min_stock || 2} className="bg-muted/10 h-14 border-border text-center text-warning font-black text-xl focus:ring-4 focus:ring-warning/5 transition-all" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold">Reserva de Segurança</Label>
                          <p className="text-[9px] text-muted-foreground">Bloqueia venda se atingir o mínimo</p>
                        </div>
                        <Switch className="scale-75" />
                      </div>
                      <Separator className="opacity-10" />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold">Permitir Venda sem Estoque</Label>
                          <p className="text-[9px] text-muted-foreground">Útil para encomendas/drop</p>
                        </div>
                        <Switch className="scale-75" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Hash className="h-3 w-3" /> Identificação
                  </h5>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">SKU / Part Number</Label>
                      <Input placeholder="GER-100234" className="bg-muted/10 h-11 border-border text-xs font-bold font-mono tracking-widest" />
                    </div>
                    <div className="grid gap-2">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">IMEI Principal (SIM 1)</Label>
                       <Input id="imei" defaultValue={product?.imei} placeholder="Ex: 356789..." className="bg-muted/10 h-12 border-border font-mono text-sm tracking-[0.2em] font-black focus:ring-4 focus:ring-primary/5 transition-all" />
                    </div>
                    <div className="grid gap-2 opacity-40 grayscale pointer-events-none">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">IMEI Secundário (eSIM)</Label>
                       <Input placeholder="35..." className="bg-muted/5 h-11 border-border font-mono text-xs tracking-widest" />
                    </div>
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
                        <Select defaultValue="natural-titanium">
                          <SelectTrigger className="bg-muted/30 h-10 border-sidebar-border text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="natural-titanium">Titânio Natural</SelectItem>
                            <SelectItem value="black-titanium">Titânio Preto</SelectItem>
                            <SelectItem value="white-titanium">Titânio Branco</SelectItem>
                            <SelectItem value="blue-titanium">Titânio Azul</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Capacidade</Label>
                        <Select defaultValue="256gb">
                          <SelectTrigger className="bg-muted/30 h-10 border-sidebar-border text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="128gb">128 GB</SelectItem>
                            <SelectItem value="256gb">256 GB</SelectItem>
                            <SelectItem value="512gb">512 GB</SelectItem>
                            <SelectItem value="1tb">1 TB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between hover:bg-primary/[0.08] transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <History className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                              <Label className="text-xs font-black text-primary uppercase tracking-[0.05em] italic">Aparelho Seminovo</Label>
                              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">Ativar logs de garantia especial</p>
                            </div>
                          </div>
                          <Switch className="data-[state=checked]:bg-primary" />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest px-1">Saúde Bateria</Label>
                             <div className="relative group">
                                <Input placeholder="100" className="bg-muted/10 h-11 border-border text-sm font-black pr-10 focus:ring-4 focus:ring-primary/5 transition-all" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase">%</span>
                             </div>
                          </div>
                          <div className="grid gap-2">
                             <Label className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest px-1">Garantia Loja</Label>
                             <Select defaultValue="90">
                                <SelectTrigger className="bg-muted/10 h-11 border-border text-sm font-black focus:ring-4 focus:ring-primary/5 transition-all">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-border">
                                   <SelectItem value="30">30 Dias</SelectItem>
                                   <SelectItem value="90">90 Dias</SelectItem>
                                   <SelectItem value="180">180 Dias</SelectItem>
                                   <SelectItem value="365">1 Ano</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-2 mt-4 pt-4 border-t border-sidebar-border/30">
                <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider flex items-center gap-2">
                  <Info className="h-3 w-3" /> Descrição Adicional
                </Label>
                <textarea className="w-full bg-muted/20 border border-sidebar-border rounded-xl p-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 min-h-[80px]" placeholder="Ex: Saúde da bateria 100%, sem riscos na tela, acompanha caixa original..." />
              </div>
            </TabsContent>

            <TabsContent value="fiscal" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bloco Fiscal */}
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Percent className="h-3 w-3" /> Tributação & Fiscal
                  </h5>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">NCM</Label>
                        <Input placeholder="8517.13.00" className="bg-muted/20 h-10 border-sidebar-border text-xs" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">CEST</Label>
                        <Input placeholder="21.053.01" className="bg-muted/20 h-10 border-sidebar-border text-xs" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Origem da Mercadoria</Label>
                      <Select defaultValue="1">
                        <SelectTrigger className="bg-muted/30 h-10 border-sidebar-border text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 - Nacional</SelectItem>
                          <SelectItem value="1">1 - Estrangeira - Importação Direta</SelectItem>
                          <SelectItem value="2">2 - Estrangeira - Adquirida no Mercado Interno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Bloco Tributário */}
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Receipt className="h-3 w-3" /> Regras Tributárias
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">ICMS</Label>
                      <Input placeholder="Alíquota %" className="bg-muted/20 h-10 border-sidebar-border text-xs" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">IPI</Label>
                      <Input placeholder="Alíquota %" className="bg-muted/20 h-10 border-sidebar-border text-xs" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bloco Logística & Canais */}
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Logística & Canais
                  </h5>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Peso (kg)</Label>
                        <Input type="number" step="0.001" placeholder="0.250" className="bg-muted/20 h-10 border-sidebar-border text-xs text-center" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Larg (cm)</Label>
                        <Input type="number" placeholder="10" className="bg-muted/20 h-10 border-sidebar-border text-xs text-center" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider text-center">Alt (cm)</Label>
                        <Input type="number" placeholder="5" className="bg-muted/20 h-10 border-sidebar-border text-xs text-center" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/20 border border-sidebar-border/50">
                      <Label className="text-[10px] font-black uppercase text-muted-foreground/40 mb-1">Canais de Venda Ativos</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-1 px-2 py-1">
                          <ShoppingBag className="h-3 w-3" /> PDV Balcão
                        </Badge>
                        <Badge variant="outline" className="bg-orange-500/5 text-orange-500 border-orange-500/20 gap-1 px-2 py-1 opacity-50">
                          <Globe className="h-3 w-3" /> E-commerce
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/5 text-green-500 border-green-500/20 gap-1 px-2 py-1 opacity-50">
                          <Percent className="h-3 w-3" /> Mercado Livre
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opções de Integração */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-sidebar-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold flex items-center gap-2">
                      <Settings2 className="h-3 w-3 text-primary" /> Sincronizar Estoque
                    </Label>
                    <p className="text-[9px] text-muted-foreground">Atualizar saldo em todos os marketplaces integrados</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between px-2">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold flex items-center gap-2">
                      <BarChart3 className="h-3 w-3 text-primary" /> Notificar Compras
                    </Label>
                    <p className="text-[9px] text-muted-foreground">Enviar alerta de estoque baixo para o setor de compras</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-6 gap-4 bg-muted/30 border-t border-border shrink-0">
          <div className="mr-auto hidden md:flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
             <InfoIcon className="h-3.5 w-3.5 text-primary/60" /> Preencha os campos obrigatórios para sincronizar com marketplaces
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