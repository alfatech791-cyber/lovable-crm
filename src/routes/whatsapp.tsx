import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MessageSquare, Plus, RefreshCw, Power, Trash2, QrCode, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { evolution, type Instance } from "@/lib/evolution";
import { toast } from "sonner";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — ConectaCRM" },
      { name: "description", content: "Gerencie suas conexões do WhatsApp via Evolution API." },
    ],
  }),
  component: WhatsAppPage,
});

function WhatsAppPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      const data = await evolution.getInstances();
      setInstances(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com a Evolution API. Verifique as chaves API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  const handleCreate = async () => {
    const name = prompt("Nome da nova instância (ex: Suporte_01):");
    if (!name) return;

    try {
      setIsCreating(true);
      await evolution.createInstance(name);
      toast.success("Instância criada com sucesso!");
      fetchInstances();
    } catch (error) {
      toast.error("Erro ao criar instância.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Conexões WhatsApp" subtitle="Gerencie seus números via Evolution API" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display">Instâncias Ativas</h2>
            <div className="flex gap-2">
              <button 
                onClick={fetchInstances}
                className="h-9 px-3 rounded-xl border border-border hover:bg-muted transition flex items-center gap-2 text-sm"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
              </button>
              <button 
                onClick={handleCreate}
                disabled={isCreating}
                className="h-9 px-4 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-elegant hover:opacity-95 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Nova Conexão
              </button>
            </div>
          </div>

          {loading && instances.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-muted/30 animate-pulse border border-border" />
              ))}
            </div>
          ) : instances.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border shadow-card p-12 text-center">
              <div className="h-14 w-14 rounded-2xl bg-muted grid place-items-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Nenhuma conexão encontrada</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                Conecte seu primeiro número do WhatsApp usando a Evolution API para começar a receber leads.
              </p>
              <button 
                onClick={handleCreate}
                className="mt-6 h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition"
              >
                Configurar Evolution API
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {instances.map((inst) => (
                <div key={inst.instanceId} className="rounded-2xl bg-card border border-border p-5 shadow-card hover:shadow-elegant transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden grid place-items-center">
                        {inst.profilePictureUrl ? (
                          <img src={inst.profilePictureUrl} alt={inst.instanceName} className="h-full w-full object-cover" />
                        ) : (
                          <MessageSquare className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{inst.instanceName}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`h-2 w-2 rounded-full ${inst.status === "open" ? "bg-success" : "bg-warning"}`} />
                          <span className="text-[11px] font-medium text-muted-foreground uppercase">
                            {inst.status === "open" ? "Conectado" : "Desconectado"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground">
                      <Settings2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Número:</span>
                      <span className="font-medium">{inst.owner || "Não vinculado"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5">
                    {inst.status !== "open" ? (
                      <button className="col-span-2 h-9 rounded-xl bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide hover:bg-primary/20 transition flex items-center justify-center gap-2">
                        <QrCode className="h-4 w-4" /> Gerar QR Code
                      </button>
                    ) : (
                      <>
                        <button className="h-9 rounded-xl bg-muted text-foreground text-xs font-bold uppercase tracking-wide hover:bg-muted/80 transition flex items-center justify-center gap-2">
                          <Power className="h-4 w-4" /> Sair
                        </button>
                        <button className="h-9 rounded-xl bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wide hover:bg-destructive/20 transition flex items-center justify-center gap-2">
                          <Trash2 className="h-4 w-4" /> Excluir
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Guia de Configuração */}
          <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/10 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Configuração da API Evolution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-xs font-bold text-foreground/70">1. URL da API</div>
                <div className="text-[11px] font-mono bg-card border border-border p-2 rounded truncate">
                  {import.meta.env.VITE_EVOLUTION_API_URL || "Configurar no Lovable (Secrets)"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-foreground/70">2. Chave Global</div>
                <div className="text-[11px] font-mono bg-card border border-border p-2 rounded">
                  ••••••••••••••••••••••••
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-bold text-foreground/70">3. Status do Servidor</div>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-xs font-semibold text-success uppercase">Operacional</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Mocking some missing icons/components for simplicity
const Settings2 = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
);
