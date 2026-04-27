import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, ShoppingCart, Users, Wrench, Download, Calendar } from "lucide-react";
import { Header } from "@/components/dashboard/Header";

export const Route = createFileRoute("/_app/relatorios/")({
  component: RelatoriosPage,
});

const reportCategories = [
  {
    title: "Vendas e Faturamento",
    description: "Análise de performance comercial e lucratividade",
    icon: ShoppingCart,
    reports: ["Vendas por Período", "Produtos Mais Vendidos", "Comissões de Vendedores", "Ticket Médio"]
  },
  {
    title: "Serviços e OS",
    description: "Produtividade técnica e status das ordens",
    icon: Wrench,
    reports: ["OS por Técnico", "Serviços Mais Realizados", "Tempo Médio de Reparo", "Garantias Acionadas"]
  },
  {
    title: "Clientes",
    description: "Base de dados e comportamento do consumidor",
    icon: Users,
    reports: ["Novos Clientes", "Ranking de Compradores", "Clientes Inativos", "Origem de Leads"]
  },
  {
    title: "Financeiro",
    description: "Fluxo de caixa e saúde financeira",
    icon: TrendingUp,
    reports: ["Fluxo de Caixa Mensal", "Contas a Pagar/Receber", "DRE Consolidado", "Taxas de Cartão"]
  }
];

function RelatoriosPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title="Relatórios e Inteligência" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">Selecione uma categoria para gerar relatórios detalhados.</p>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" /> Últimos 30 dias
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportCategories.map((category) => (
            <Card key={category.title} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {category.reports.map((report) => (
                    <Button key={report} variant="ghost" className="justify-between h-9 px-3 hover:bg-primary/5 group">
                      <span className="text-sm">{report}</span>
                      <Download className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
