import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Filter, ArrowUpRight, Shield } from "lucide-react";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — ConectaCRM" }, { name: "description", content: "Métricas avançadas de vendas" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { user } = useAuth();

  if (!user.permissions.reports) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Acesso Negado" subtitle="Você não tem permissão para ver esta página" />
          <main className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Página Restrita</h2>
              <p className="text-muted-foreground mb-8">O seu nível de acesso não permite visualizar relatórios avançados.</p>
              <Link to="/" className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-glow">
                Voltar ao Início
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Métricas & Relatórios" subtitle="Acompanhe o desempenho do seu negócio" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" /> Últimos 30 dias
              </button>
              <button className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" /> Filtrar Agente
              </button>
            </div>
            <button className="h-10 px-4 rounded-xl bg-primary text-white text-sm font-bold shadow-elegant hover:opacity-90 transition flex items-center gap-2">
              <Download className="h-4 w-4" /> Gerar PDF
            </button>
          </div>

          {/* Large Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Receita Total", value: "R$ 0,00", trend: "+0%", icon: DollarSign, color: "text-success" },
              { label: "Novos Leads", value: "2.861", trend: "+12%", icon: Users, color: "text-primary" },
              { label: "Ticket Médio", value: "R$ 0,00", trend: "+0%", icon: TrendingUp, color: "text-info" },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl bg-muted grid place-items-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-success">
                    <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <div className="text-3xl font-bold font-display mt-1">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-base font-bold mb-6">Volume de Vendas Diário</h3>
              <SalesChart />
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              <h3 className="text-base font-bold mb-6">Origem dos Leads</h3>
              <div className="h-[300px] grid place-items-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                  <p className="text-sm text-muted-foreground">Sem dados suficientes para gerar o gráfico.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
