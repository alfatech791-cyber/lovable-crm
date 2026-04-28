import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Package, Tag, DollarSign, Layers, Hash, Info, History, CheckCircle2, Plus } from "lucide-react";
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6 pt-4">
          <TabsList className="bg-muted/50 w-full justify-start gap-4 mb-6">
            <TabsTrigger value="general" className="gap-2"><Info className="h-4 w-4" /> Geral</TabsTrigger>
            <TabsTrigger value="stock" className="gap-2"><Layers className="h-4 w-4" /> Estoque</TabsTrigger>
            <TabsTrigger value="tech" className="gap-2"><Smartphone className="h-4 w-4" /> Técnico</TabsTrigger>
          </TabsList>

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