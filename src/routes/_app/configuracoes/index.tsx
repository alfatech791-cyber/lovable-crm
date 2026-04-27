import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Store, ShieldCheck, Bell, Smartphone } from "lucide-react";

export const Route = createFileRoute("/_app/configuracoes/")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurações Gerais</h1>
        <p className="text-muted-foreground text-sm">Ajuste os parâmetros do seu sistema de gestão</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Dados da Loja</CardTitle>
            </div>
            <CardDescription>Informações básicas que aparecem em orçamentos e OS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nome da Loja</Label>
                <Input id="store-name" defaultValue="Conecta Cell" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" defaultValue="00.000.000/0001-00" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue="Av. Principal, 123 - Centro" />
              </div>
            </div>
            <Button className="mt-2">Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Garantia e Termos</CardTitle>
            </div>
            <CardDescription>Configure os prazos padrão para serviços e aparelhos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Garantia Padrão (Dias)</Label>
                <p className="text-sm text-muted-foreground">Prazo automático para novas OS</p>
              </div>
              <Input className="w-24" type="number" defaultValue="90" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Checklist Obrigatório</Label>
                <p className="text-sm text-muted-foreground">Exigir checklist na entrada do aparelho</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
