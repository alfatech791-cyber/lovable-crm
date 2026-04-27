import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/dashboard/Header";
import { Sliders, Bell, Lock, Database } from "lucide-react";

export const Route = createFileRoute("/_app/configuracoes/parametros")({
  component: ParametrosPage,
});

function ParametrosPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title="Parâmetros do Sistema" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notificações</CardTitle>
              </div>
              <CardDescription>Configure como e quando você deseja ser avisado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Estoque Baixo</Label>
                  <p className="text-sm text-muted-foreground">Notificar quando um produto atingir o estoque mínimo</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Novas OS por WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Enviar comprovante automaticamente ao abrir OS</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Segurança</CardTitle>
              </div>
              <CardDescription>Configurações de acesso e auditoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação em Duas Etapas</Label>
                  <p className="text-sm text-muted-foreground">Exigir código adicional no login da equipe</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Log de Atividades</Label>
                  <p className="text-sm text-muted-foreground">Registrar todas as alterações críticas no sistema</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Restaurar Padrões</Button>
            <Button>Salvar Configurações</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
