import { createFileRoute, Link } from "@tanstack/react-router";
 import { useState, useEffect } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { toast } from "sonner";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { UsersRound, Plus, MoreHorizontal, Shield, Mail, Phone, Search, UserCircle } from "lucide-react";
import { InviteMemberModal } from "@/components/team/InviteMemberModal";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/equipe")({
  head: () => ({ meta: [{ title: "Equipe — ConectaCRM" }, { name: "description", content: "Gerencie permissões e membros" }] }),
  component: EquipePage,
});

function EquipePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const [team, setTeam] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('display_name', { ascending: true });
      
      if (error) throw error;
      setTeam(data || []);
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Erro ao carregar equipe');
    } finally {
      setLoading(false);
    }
  };


   const handleInvite = async (newMember: any) => {
     // Em um app real, aqui enviariamos um convite via Edge Function
     // Por agora, vamos apenas recarregar a lista
     toast.success("Convite enviado com sucesso!");
     fetchTeam();
   };

   const handleRemoveMember = async (id: string) => {
     if (!confirm("Tem certeza que deseja remover este membro?")) return;
     
     try {
       const { error } = await supabase.from('profiles').delete().eq('id', id);
       if (error) throw error;
       toast.success("Membro removido");
       fetchTeam();
     } catch (error) {
       toast.error("Erro ao remover membro");
     }
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

           {loading ? (
             <div className="flex justify-center p-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
               {team.map((member) => (
               <div key={member.id} className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elegant transition-all group relative">
                 {member.id === user?.id && (
                   <span className="absolute top-4 right-12 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">VOCÊ</span>
                 )}
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                     <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-white font-bold text-lg grid place-items-center shadow-glow">
                       {member.display_name?.charAt(0) || "U"}
                     </div>
                     <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${member.id === user?.id ? "bg-success" : "bg-muted-foreground"}`} title={member.id === user?.id ? "Online" : "Status desconhecido"} />
                  </div>
                  <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted text-muted-foreground transition"><MoreHorizontal className="h-4 w-4" /></button>
                </div>

                <div className="mb-4">
                   <h3 className="font-bold text-base group-hover:text-primary transition">{member.display_name || "Sem nome"}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield className="h-3 w-3 text-primary" />
                     <span className="text-[11px] font-bold text-primary uppercase tracking-wider">{member.role || "Membro"}</span>
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
                   <button 
                     onClick={() => handleRemoveMember(member.id)}
                     disabled={member.id === user?.id}
                     className="h-9 rounded-lg border border-border text-xs font-bold text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition disabled:opacity-30"
                   >
                     Remover
                   </button>
                 </div>
               </div>
               ))}
             </div>
           )}

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
