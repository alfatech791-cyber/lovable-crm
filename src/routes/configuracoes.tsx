import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { User, Shield, Bell, Zap, Database, Smartphone, Palette, HelpCircle, ChevronRight, Globe, Lock } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — ConectaCRM" }, { name: "description", content: "Ajuste suas preferências e integrações" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const menuSections = [
    {
      title: "Geral",
      items: [
        { icon: User, label: "Perfil da Conta", sub: "Nome, e-mail e foto", color: "bg-blue-500" },
        { icon: Bell, label: "Notificações", sub: "Alertas de leads e mensagens", color: "bg-orange-500" },
        { icon: Palette, label: "Aparência", sub: "Tema escuro, cores e layout", color: "bg-purple-500" },
      ]
    },
    {
      title: "Negócio & Vendas",
      items: [
        { icon: Smartphone, label: "Catálogo de Celulares", sub: "Modelos, estoque e preços", color: "bg-success" },
        { icon: Zap, label: "IA DeepSeek", sub: "Treinamento e chaves de API", color: "bg-primary" },
        { icon: Database, label: "Integrações (Evolution API)", sub: "WhatsApp e CRM Externo", color: "bg-info" },
      ]
    },
    {
      title: "Segurança",
      items: [
        { icon: Shield, label: "Equipe & Permissões", sub: "Gerenciar acessos dos agentes", color: "bg-red-500" },
        { icon: Lock, label: "Segurança & Login", sub: "Senha e autenticação 2FA", color: "bg-slate-700" },
        { icon: Globe, label: "Webhooks", sub: "Conecte com outras ferramentas", color: "bg-emerald-600" },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Configurações" subtitle="Gerencie sua conta e preferências do sistema" />
        <main className="flex-1 overflow-y-auto p-6 max-w-5xl">
          <div className="space-y-8">
            {menuSections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.items.map((item, i) => (
                    <button key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-card hover:shadow-elegant hover:border-primary/20 transition-all text-left group">
                      <div className={`h-10 w-10 rounded-xl ${item.color} text-white grid place-items-center shrink-0`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold text-foreground group-hover:text-primary transition">{item.label}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{item.sub}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Help Card */}
            <div className="rounded-2xl bg-muted/40 border border-border p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-2xl bg-card border border-border grid place-items-center text-primary shadow-sm shrink-0">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">Precisa de ajuda com a configuração?</h4>
                <p className="text-sm text-muted-foreground mb-4">Acesse nossa Central de Ajuda para tutoriais completos sobre como conectar o WhatsApp e treinar sua IA.</p>
                <div className="flex gap-3">
                  <button className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold transition">Acessar Documentação</button>
                  <button className="h-9 px-4 rounded-lg border border-border bg-card text-xs font-bold transition">Falar com Suporte</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
