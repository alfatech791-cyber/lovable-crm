import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { 
  MessageSquare, Plus, RefreshCw, Power, Trash2, QrCode, 
  CheckCircle2, AlertCircle, Phone, User, Settings2,
  ShieldCheck, Info, Search, Filter, MoreVertical,
  ExternalLink, LogOut, Smartphone
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { evolution, type Instance } from "@/lib/evolution";
import { toast } from "sonner";
import { QrCodeModal } from "@/components/whatsapp/QrCodeModal";

export const Route = createFileRoute("/whatsapp")({
  head: () => ({
    meta: [
      { title: "WhatsApp — ConectaCRM" },
      { name: "description", content: "Gerencie suas conexões do WhatsApp via Evolution API." },
    ],
  }),
  component: WhatsAppPage,
});

export function WhatsAppPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredInstances = useMemo(() => {
    return instances.filter(inst => 
      inst.instanceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.owner?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [instances, searchQuery]);

  const stats = useMemo(() => ({
    total: instances.length,
    connected: instances.filter(i => i.status === "open").length,
    disconnected: instances.filter(i => i.status !== "open").length,
  }), [instances]);

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

  const handleLogout = async (name: string) => {
    if (!confirm(`Deseja realmente desconectar a instância ${name}?`)) return;
    try {
      await evolution.logoutInstance(name);
      toast.success("Instância desconectada!");
      fetchInstances();
    } catch (err) {
      toast.error("Erro ao desconectar.");
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Deseja realmente EXCLUIR permanentemente a instância ${name}?`)) return;
    try {
      await evolution.deleteInstance(name);
      toast.success("Instância excluída!");
      fetchInstances();
    } catch (err) {
      toast.error("Erro ao excluir.");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#f8fafc]">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Gestão de WhatsApp" subtitle="Hub de conexões via Evolution API" />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total de Instâncias</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Conectadas</p>
                <p className="text-2xl font-bold">{stats.connected}</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Desconectadas</p>
                <p className="text-2xl font-bold">{stats.disconnected}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Buscar por nome ou número..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border-none text-sm focus:ring-2 focus:ring-primary/20 transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button 
                onClick={fetchInstances}
                className="h-10 px-4 rounded-xl border border-border hover:bg-muted transition flex items-center gap-2 text-sm font-medium"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 
                <span className="hidden sm:inline">Sincronizar</span>
              </button>
              <button 
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 sm:flex-none h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Nova Conexão
              </button>
            </div>
          </div>

          {loading && instances.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-3xl bg-card animate-pulse border border-border" />
              ))}
            </div>
          ) : filteredInstances.length === 0 ? (
            <div className="rounded-3xl bg-card border border-border shadow-sm p-16 text-center max-w-2xl mx-auto">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">Inicie sua operação</h3>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
                Conecte múltiplas contas do WhatsApp para automatizar seu CRM e gerenciar leads em escala.
              </p>
              <button 
                onClick={handleCreate}
                className="mt-8 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:shadow-xl hover:shadow-primary/20 transition-all"
              >
                Configurar Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredInstances.map((inst) => (
                <div 
                  key={inst.instanceId} 
                  className="group relative rounded-3xl bg-card border border-border p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-2xl bg-muted overflow-hidden flex items-center justify-center ring-4 ring-muted">
                        {inst.profilePictureUrl ? (
                          <img src={inst.profilePictureUrl} alt={inst.instanceName} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-muted-foreground/50" />
                        )}
                        <div className={`absolute bottom-0 right-0 h-4 w-4 border-2 border-card rounded-full ${inst.status === "open" ? "bg-success" : "bg-warning"}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg leading-tight">{inst.instanceName}</h4>
                        <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
                          {inst.status === "open" ? (
                            <><CheckCircle2 className="h-3 w-3 text-success" /> Ativo agora</>
                          ) : (
                            <><AlertCircle className="h-3 w-3 text-warning" /> Aguardando pareamento</>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">Número vinculado</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums">
                        {inst.owner ? `+${inst.owner.split('@')[0]}` : "Pendente"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {inst.status !== "open" ? (
                      <button 
                        onClick={() => setSelectedInstance(inst.instanceName)}
                        className="flex-1 h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <QrCode className="h-4 w-4" /> Conectar WhatsApp
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleLogout(inst.instanceName)}
                          className="flex-1 h-11 rounded-2xl bg-muted text-foreground text-sm font-bold hover:bg-muted/80 transition flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-4 w-4" /> Desconectar
                        </button>
                        <button 
                          onClick={() => handleDelete(inst.instanceName)}
                          className="h-11 w-11 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition flex items-center justify-center"
                          title="Excluir instância"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* API Information */}
          <div className="rounded-3xl bg-slate-900 text-white p-8 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-32 w-32" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-md">
                <div className="flex items-center gap-2 text-primary/80 mb-2">
                  <Info className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest tracking-widest">Evolution API Status</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">Infraestrutura Segura</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Suas conexões são processadas via Evolution API em servidores criptografados, garantindo alta performance e estabilidade para automações.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">API Endpoint</p>
                  <p className="text-xs font-mono text-slate-300 truncate max-w-[180px]">
                    {import.meta.env.VITE_EVOLUTION_API_URL || "API não configurada"}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status Global</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-bold text-success">OPERACIONAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {selectedInstance && (
          <QrCodeModal 
            instanceName={selectedInstance} 
            onClose={() => setSelectedInstance(null)} 
            onSuccess={() => {
              setSelectedInstance(null);
              fetchInstances();
            }}
          />
        )}
      </div>
    </div>
  );
}