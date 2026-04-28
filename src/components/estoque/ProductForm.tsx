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
  const [activeTab, setActiveTab] = useState("general");
  const [isSmartphone, setIsSmartphone] = useState(product?.category === "Smartphones");

  useEffect(() => {
    if (product) {
      setIsSmartphone(product.category === "Smartphones");
    }
  }, [product]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-sidebar-border bg-sidebar/95 backdrop-blur-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 p-6 pb-0">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-glow">
              {product ? <History className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{product ? "Editar Item" : "Novo Item"}</DialogTitle>
              <DialogDescription className="text-xs">Gerencie os detalhes técnicos e comerciais</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-0 flex-1 overflow-hidden flex flex-col">
          <div className="px-6 py-0 border-b border-sidebar-border/50 bg-muted/20">
            <TabsList className="bg-transparent h-12 p-0 gap-6 w-full justify-start overflow-x-auto scrollbar-none">
              <TabsTrigger 
                value="general" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full gap-2 px-1 transition-all"
              >
                <Info className="h-4 w-4" /> Geral
              </TabsTrigger>
              <TabsTrigger 
                value="stock" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full gap-2 px-1 transition-all"
              >
                <Layers className="h-4 w-4" /> Estoque & Preços
              </TabsTrigger>
              <TabsTrigger 
                value="tech" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full gap-2 px-1 transition-all"
              >
                <Smartphone className="h-4 w-4" /> Ficha Técnica
              </TabsTrigger>
              <TabsTrigger 
                value="fiscal" 
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full gap-2 px-1 transition-all"
              >
                <FileText className="h-4 w-4" /> Fiscal & E-commerce
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <TabsContent value="general" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-5">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Tag className="h-3 w-3" /> Identificação Básica
                    </h3>
                    
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-wider">Título Comercial do Anúncio</Label>
                        <div className="relative">
                           <Input id="name" defaultValue={product?.name} placeholder="Ex: Apple iPhone 15 Pro Max 256GB - Titânio Natural" className="bg-card/50 h-12 border-sidebar-border focus:ring-1 focus:ring-primary/20 text-base font-semibold" />
                           <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground/40 uppercase">0/60</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-wider">Categoria</Label>
                          <Select defaultValue={product?.category || "Acessórios"} onValueChange={(v) => setIsSmartphone(v === "Smartphones")}>
                            <SelectTrigger className="bg-card/50 h-10 border-sidebar-border"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Smartphones">Smartphones</SelectItem>
                              <SelectItem value="Tablets">Tablets</SelectItem>
                              <SelectItem value="Watch">Smartwatches</SelectItem>
                              <SelectItem value="Acessórios">Acessórios</SelectItem>
                              <SelectItem value="Peças">Peças Técnicas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-wider">Fabricante</Label>
                          <Select defaultValue="apple">
                            <SelectTrigger className="bg-card/50 h-10 border-sidebar-border"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apple">Apple Inc.</SelectItem>
                              <SelectItem value="samsung">Samsung</SelectItem>
                              <SelectItem value="xiaomi">Xiaomi</SelectItem>
                              <SelectItem value="motorola">Motorola</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-[10px] font-bold uppercase text-muted-foreground/70 tracking-wider">Status</Label>
                          <Select defaultValue="ativo">
                            <SelectTrigger className="bg-card/50 h-10 border-sidebar-border"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ativo">Disponível</SelectItem>
                              <SelectItem value="rascunho">Rascunho</SelectItem>
                              <SelectItem value="indisponivel">Indisponível</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <InfoIcon className="h-3 w-3" /> Descrição Técnica (E-commerce)
                        </h3>
                        <div className="flex items-center gap-2">
                           <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase gap-1"><Copy className="h-3 w-3" /> Copiar IA</Button>
                           <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase gap-1 text-primary"><Zap className="h-3 w-3 fill-current" /> Gerar com ConectaAI</Button>
                        </div>
                     </div>
                     <textarea className="w-full bg-card/30 border border-sidebar-border rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-primary/20 min-h-[160px] custom-scrollbar" placeholder="Descreva os principais benefícios, diferenciais e o que acompanha o produto..." />
                  </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <section className="bg-muted/10 rounded-2xl border border-sidebar-border/50 p-5 space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" /> Galeria de Fotos
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="aspect-square border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-all cursor-pointer group bg-primary/5">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-glow">
                          <Upload className="h-5 w-5" />
                        </div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Principal</span>
                      </div>
                      <div className="grid grid-cols-2 grid-rows-2 gap-3 aspect-square">
                         {Array.from({ length: 4 }).map((_, i) => (
                           <div key={i} className="border border-dashed border-sidebar-border/50 rounded-xl flex items-center justify-center bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer">
                              <Plus className="h-4 w-4 text-muted-foreground/30" />
                           </div>
                         ))}
                      </div>
                    </div>
                    <div className="p-3 bg-card/40 rounded-xl border border-sidebar-border/30">
                       <p className="text-[10px] text-muted-foreground leading-tight">
                          <strong>Dica:</strong> Fotos com fundo branco aumentam a conversão em até 30% nos marketplaces.
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

            <TabsContent value="stock" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna de Preços */}
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <DollarSign className="h-3 w-3" /> Financeiro
                  </h5>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Venda</Label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 w-10 flex items-center justify-center bg-primary/10 text-primary font-bold text-sm rounded-l-lg border border-r-0 border-sidebar-border group-focus-within:border-primary/50 transition-colors">R$</div>
                        <Input id="price" type="number" defaultValue={product?.price} className="bg-muted/30 h-11 pl-12 rounded-l-none border-sidebar-border focus:ring-1 focus:ring-primary/20 text-base font-bold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Custo Unitário</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-xs font-bold">R$</span>
                          <Input type="number" className="bg-muted/20 h-10 pl-9 border-sidebar-border text-xs" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Margem Bruta</Label>
                        <div className="relative">
                          <Input disabled value="35%" className="bg-muted/10 h-10 pr-9 border-sidebar-border text-xs font-bold text-success" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success/50 text-[10px] font-bold">%</span>
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
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Saldo Inicial</Label>
                        <Input id="stock" type="number" defaultValue={product?.stock} className="bg-muted/30 h-11 border-sidebar-border font-bold text-center" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Mínimo (Alerta)</Label>
                        <Input id="min_stock" type="number" defaultValue={product?.min_stock || 2} className="bg-muted/30 h-11 border-sidebar-border text-center text-warning font-bold" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/20 border border-sidebar-border/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold">Reserva de Segurança</Label>
                          <p className="text-[9px] text-muted-foreground">Bloqueia venda se atingir o mínimo</p>
                        </div>
                        <Switch className="scale-75" />
                      </div>
                      <Separator className="opacity-30" />
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

            <TabsContent value="tech" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <h5 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <Hash className="h-3 w-3" /> Identificação
                  </h5>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">SKU / Código Interno</Label>
                      <Input placeholder="GER-100234" className="bg-muted/20 h-10 border-sidebar-border text-xs" />
                    </div>
                    {isSmartphone && (
                      <div className="grid gap-2">
                        <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">IMEI 1 (Principal)</Label>
                        <Input id="imei" defaultValue={product?.imei} placeholder="35xxxxxxxxxxxxx" className="bg-muted/30 h-11 border-sidebar-border font-mono text-sm tracking-widest" />
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

                    <div className="p-4 rounded-2xl bg-sidebar-primary/5 border border-sidebar-primary/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <History className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-xs font-bold text-primary italic uppercase tracking-tighter">Condição: Seminovo</Label>
                          <p className="text-[9px] text-muted-foreground">Ative para controle de aparelhos usados</p>
                        </div>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" />
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

            <TabsContent value="fiscal" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
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

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-gradient-primary shadow-glow gap-2 px-6 rounded-xl">
            {product ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {product ? "Salvar Alterações" : "Cadastrar Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}