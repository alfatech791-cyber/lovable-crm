import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Package, Tag, DollarSign, Layers, Hash, Info, History, CheckCircle2, Plus, Box, ShieldCheck, Palette, Cpu, Upload } from "lucide-react";
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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-sidebar-border bg-sidebar/95 backdrop-blur-xl">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-0">
          <div className="px-6 py-2 border-b border-sidebar-border/50">
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
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="general" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase text-muted-foreground/60 flex items-center gap-2 tracking-wider">
                      <Tag className="h-3.5 w-3.5" /> Nome do Produto
                    </Label>
                    <Input id="name" defaultValue={product?.name} placeholder="Ex: iPhone 15 Pro Max 256GB" className="bg-muted/30 h-11 border-sidebar-border focus:ring-1 focus:ring-primary/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Categoria</Label>
                      <Select defaultValue={product?.category || "Acessórios"} onValueChange={(v) => setIsSmartphone(v === "Smartphones")}>
                        <SelectTrigger className="bg-muted/30 h-11 border-sidebar-border focus:ring-1 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Smartphones">Smartphones</SelectItem>
                          <SelectItem value="Tablets">Tablets</SelectItem>
                          <SelectItem value="Acessórios">Acessórios</SelectItem>
                          <SelectItem value="Peças">Peças</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Marca</Label>
                      <Select defaultValue="apple">
                        <SelectTrigger className="bg-muted/30 h-11 border-sidebar-border focus:ring-1 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="samsung">Samsung</SelectItem>
                          <SelectItem value="xiaomi">Xiaomi</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label className="text-[11px] font-black uppercase text-muted-foreground/60 flex items-center gap-2 tracking-wider">
                    <Box className="h-3.5 w-3.5" /> Imagem do Produto
                  </Label>
                  <div className="border-2 border-dashed border-sidebar-border/50 rounded-2xl h-32 flex flex-col items-center justify-center gap-2 hover:bg-muted/20 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Upload className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Carregar Foto</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold leading-none">Status do Registro</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Este produto será cadastrado na base global e ficará disponível para venda em todos os canais conectados.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stock" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase text-muted-foreground/60 flex items-center gap-2 tracking-wider">
                      <DollarSign className="h-3.5 w-3.5" /> Preço de Venda (R$)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-primary">R$</span>
                      <Input id="price" type="number" defaultValue={product?.price} className="bg-muted/30 h-12 pl-10 border-sidebar-border focus:ring-2 focus:ring-primary/20 text-lg font-bold" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Preço de Custo (Opcional)</Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">R$</span>
                      <Input type="number" className="bg-muted/30 h-12 pl-10 border-sidebar-border" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Qtd. em Estoque</Label>
                      <Input id="stock" type="number" defaultValue={product?.stock} className="bg-muted/30 h-11 border-sidebar-border" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 tracking-wider">Estoque Mínimo</Label>
                      <Input id="min_stock" type="number" defaultValue={product?.min_stock || 2} className="bg-muted/30 h-11 border-sidebar-border" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-sidebar-border/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold">Controlar Validade?</Label>
                      <p className="text-[10px] text-muted-foreground">Útil para peças e baterias</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {isSmartphone ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 flex items-center gap-2 tracking-wider">
                        <Hash className="h-3.5 w-3.5" /> IMEI Principal
                      </Label>
                      <Input id="imei" defaultValue={product?.imei} placeholder="Ex: 356789123456789" className="bg-muted/30 h-11 border-sidebar-border font-mono text-xs tracking-widest" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 flex items-center gap-2 tracking-wider">
                        <Palette className="h-3.5 w-3.5" /> Cor do Aparelho
                      </Label>
                      <Select defaultValue="space-gray">
                        <SelectTrigger className="bg-muted/30 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="space-gray">Cinza Espacial</SelectItem>
                          <SelectItem value="silver">Prateado</SelectItem>
                          <SelectItem value="gold">Dourado</SelectItem>
                          <SelectItem value="blue">Azul Marinho</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-[11px] font-black uppercase text-muted-foreground/60 flex items-center gap-2 tracking-wider">
                        <Cpu className="h-3.5 w-3.5" /> Capacidade / Memória
                      </Label>
                      <Select defaultValue="256gb">
                        <SelectTrigger className="bg-muted/30 h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="64gb">64GB</SelectItem>
                          <SelectItem value="128gb">128GB</SelectItem>
                          <SelectItem value="256gb">256GB</SelectItem>
                          <SelectItem value="512gb">512GB</SelectItem>
                          <SelectItem value="1tb">1TB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-sidebar-primary/10 border border-sidebar-primary/20">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-bold flex items-center gap-2 text-primary">
                          Aparelho Usado
                        </Label>
                        <p className="text-[10px] text-muted-foreground font-medium">Ativar para itens de vitrine ou seminovos</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
                  <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="max-w-[280px]">
                    <h4 className="font-bold text-sm">Ficha Técnica Simplificada</h4>
                    <p className="text-xs text-muted-foreground mt-1">Detalhes avançados como IMEI e memória estão disponíveis apenas para a categoria de smartphones.</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

          <TabsContent value="general" className="space-y-4 mt-0">
            <div className="grid gap-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Tag className="h-3.5 w-3.5" /> Nome</Label>
              <Input id="name" defaultValue={product?.name} className="bg-card/50 h-11" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Categoria</Label>
                <Select defaultValue={product?.category || "Acessórios"} onValueChange={(v) => setIsSmartphone(v === "Smartphones")}>
                  <SelectTrigger className="bg-card/50 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Smartphones">Smartphones</SelectItem>
                    <SelectItem value="Acessórios">Acessórios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Unidade</Label>
                <Select defaultValue="un">
                  <SelectTrigger className="bg-card/50 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                    <SelectItem value="par">Par</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><DollarSign className="h-3.5 w-3.5" /> Preço Venda</Label>
                <Input id="price" type="number" defaultValue={product?.price} className="bg-card/50 h-11" />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Qtd. Atual</Label>
                <Input id="stock" type="number" defaultValue={product?.stock} className="bg-card/50 h-11" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Estoque Mínimo</Label>
                <Input id="min_stock" type="number" defaultValue={product?.min_stock || 2} className="bg-card/50 h-11" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tech" className="space-y-4 mt-0">
            {isSmartphone ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2"><Hash className="h-3.5 w-3.5" /> IMEI / Serial</Label>
                  <Input id="imei" defaultValue={product?.imei} placeholder="35xxxxxxxxxxxxx" className="bg-card/50 font-mono" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold">Produto Usado?</Label>
                    <p className="text-[10px] text-muted-foreground">Seminovo ou de vitrine</p>
                  </div>
                  <Switch />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <Package className="h-10 w-10 mb-2" />
                <p className="text-sm text-center">Especificações avançadas disponíveis apenas para smartphones e tablets</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-gradient-primary shadow-glow gap-2 px-6">
            {product ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {product ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}