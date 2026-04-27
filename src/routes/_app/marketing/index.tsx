import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Instagram, Mail, Target, Plus, Zap } from "lucide-react";
import { Header } from "@/components/dashboard/Header";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/marketing/")({
  component: MarketingPage,
});

const campaigns = [
  { name: "Promocional iPhone 15", channel: "WhatsApp", status: "Em execução", leads: 45, conversion: "12%" },
  { name: "Black Friday Antecipada", channel: "Instagram", status: "Agendada", leads: 0, conversion: "0%" },
  { name: "Recuperação de Carrinho", channel: "E-mail", status: "Ativa", leads: 120, conversion: "8%" },
];

function MarketingPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title="Marketing e Engajamento" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Leads Gerados (Mês)</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">342</span>
                <Target className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversão Média</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">14.5%</span>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Custo por Lead</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">R$ 2,40</span>
                <Target className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campanhas Ativas</h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Nova Campanha
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((camp) => (
              <Card key={camp.name}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      {camp.channel === "WhatsApp" && <MessageSquare className="h-5 w-5 text-green-500" />}
                      {camp.channel === "Instagram" && <Instagram className="h-5 w-5 text-pink-500" />}
                      {camp.channel === "E-mail" && <Mail className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="font-medium">{camp.name}</h3>
                      <p className="text-sm text-muted-foreground">{camp.channel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-medium">{camp.leads}</p>
                      <p className="text-xs text-muted-foreground">Leads</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{camp.conversion}</p>
                      <p className="text-xs text-muted-foreground">Conv.</p>
                    </div>
                    <Badge variant={camp.status === "Em execução" || camp.status === "Ativa" ? "default" : "secondary"}>
                      {camp.status}
                    </Badge>
                    <Button variant="ghost" size="sm">Gerenciar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
