import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { UsersRound, Plus, MoreHorizontal, Shield, Mail, Phone, Search, UserCircle } from "lucide-react";
import { InviteMemberModal } from "@/components/team/InviteMemberModal";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/equipe")({
  head: () => ({ meta: [{ title: "Equipe — ConectaCRM" }, { name: "description", content: "Gerencie permissões e membros" }] }),
  component: EquipePage,
});

const INITIAL_TEAM = [
  { id: 1, name: "Renato Silva", role: "Administrador", email: "renato@conecta.com", status: "online", avatar: "RS" },
  { id: 2, name: "Carla Souza", role: "Agente", email: "carla@conecta.com", status: "offline", avatar: "CS" },
  { id: 3, name: "Marcos Lima", role: "Agente", email: "marcos@conecta.com", status: "online", avatar: "ML" },
];

function EquipePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, profile } = useAuth();

  const isAdmin = profile?.role === 'admin' || !profile; // Fallback to true if no profile yet for demo

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title="Acesso Negado" subtitle="Você não tem permissão para ver esta página" toggleSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <div className="h-20 w-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Página Restrita</h2>
              <p className="text-muted-foreground mb-8">O seu nível de acesso não permite gerenciar a equipe. Entre em contato com um administrador para solicitar acesso.</p>
              <Link to="/" className="inline-flex h-11 px-6 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-glow">Voltar ao Início</Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleInvite = (newMember: any) => {
    setTeam(prev => [...prev, { ...newMember, id: Date.now() }]);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Equipe & Permissões" subtitle="Gerencie quem acessa o seu CRM" toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-card border border-border p-4 rounded-2xl">
            <div className="flex items-center gap-4">
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative max-w-sm w-full">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Buscar membro..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border outline-none text-sm" />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-elegant hover:opacity-95 transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" strokeWidth={3} /> Convidar Membro
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {team.map((member) => (
              <div key={member.id} className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elegant transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-white font-bold text-lg grid place-items-center shadow-glow">
                      {member.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${member.status === "online" ? "bg-success" : "bg-muted-foreground"}`} />
                  </div>
                  <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground transition"><MoreHorizontal className="h-4 w-4" /></button>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-base group-hover:text-primary transition">{member.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="h-3 w-3 text-primary" />
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{member.role}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> (11) 9****-****
                  </div>
                </div>
                
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button className="h-9 rounded-lg border border-border text-xs font-bold hover:bg-muted transition">Editar</button>
                  <button className="h-9 rounded-lg border border-border text-xs font-bold text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition">Remover</button>
                </div>
              </div>
            ))}
          </div>

          <InviteMemberModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onInvite={handleInvite} 
          />
        </main>
      </div>
    </div>
  );
}
