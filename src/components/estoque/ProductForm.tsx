import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" defaultValue={product?.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Categoria</Label>
            <Select defaultValue={product?.category || "acessorios"}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smartphones">Smartphones</SelectItem>
                <SelectItem value="acessorios">Acessórios</SelectItem>
                <SelectItem value="pecas">Peças</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Preço Venda</Label>
            <Input id="price" type="number" defaultValue={product?.price} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Estoque Inicial</Label>
            <Input id="stock" type="number" defaultValue={product?.stock} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="min_stock" className="text-right">Estoque Mín.</Label>
            <Input id="min_stock" type="number" defaultValue={product?.min_stock || 2} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imei" className="text-right">IMEI/Serial</Label>
            <Input id="imei" defaultValue={product?.imei} className="col-span-3" placeholder="Opcional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onOpenChange(false)}>Salvar Produto</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}