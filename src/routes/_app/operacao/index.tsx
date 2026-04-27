import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Settings2, Users, Package, CreditCard, Truck, ListChecks, Tags } from "lucide-react";

const operacaoCards = [
  { title: "Tipos de Produtos", desc: "Categorias e variações", icon: Package, href: "/operacao/tipos-produtos" },
  { title: "Transportadores", desc: "Logística e entregas", icon: Truck, href: "/operacao/transportadores" },
  { title: "Maquininhas POS", desc: "Taxas e terminais", icon: CreditCard, href: "/operacao/maquininhas" },
  { title: "Serviços", desc: "Catálogo de mão de obra", icon: ListChecks, href: "/servicos/lista" },
  { title: "Etiquetas", desc: "Modelos e impressão", icon: Tags, href: "/estoque/etiquetas" },
  { title: "Equipe", desc: "Usuários e permissões", icon: Users, href: "/operacao/equipe" },
];

export default function OperacaoPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <Topbar title="Operação" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Configurações de Operação</h2>
          <p className="text-muted-foreground">Ajuste os parâmetros fundamentais do dia a dia da sua loja.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operacaoCards.map((card) => (
            <Link key={card.title} to={card.href}>
              <Card className="border-sidebar-border bg-sidebar/30 hover:bg-sidebar/50 transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <CardDescription className="text-xs">{card.desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
