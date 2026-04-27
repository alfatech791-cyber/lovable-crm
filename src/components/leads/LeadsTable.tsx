import { useState } from "react";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Search, Filter, Plus, MoreHorizontal, MessageSquare, Instagram, Download, ChevronLeft, ChevronRight, Phone } from "lucide-react";

const mockLeads = [
  { id: 1, name: "João Silva", phone: "(11) 99999-9999", email: "joao@email.com", source: "whatsapp", stage: "Novo Contato", date: "27/04/2026" },
  { id: 2, name: "Maria Oliveira", phone: "(21) 98888-8888", email: "maria@email.com", source: "instagram", stage: "Em Atendimento", date: "26/04/2026" },
  { id: 3, name: "Pedro Santos", phone: "(31) 97777-7777", email: "pedro@email.com", source: "whatsapp", stage: "Proposta", date: "25/04/2026" },
  { id: 4, name: "Ana Souza", phone: "(41) 96666-6666", email: "ana@email.com", source: "whatsapp", stage: "Fechado", date: "24/04/2026" },
];

export function LeadsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Todos os Leads" subtitle="Base de dados unificada de contatos" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            {/* Table Header/Toolbar */}
            <div className="p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative max-w-sm w-full">
                  <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    placeholder="Buscar por nome, telefone ou email..." 
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-transparent focus:bg-card focus:border-primary/30 outline-none text-sm transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="h-10 px-4 rounded-xl border border-border hover:bg-muted transition flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="h-4 w-4" /> Filtros
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-10 px-4 rounded-xl border border-border hover:bg-muted transition flex items-center gap-2 text-sm font-semibold">
                  <Download className="h-4 w-4" /> Exportar
                </button>
                <button className="h-10 px-4 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-elegant hover:opacity-95 transition flex items-center gap-2">
                  <Plus className="h-4 w-4" strokeWidth={3} /> Adicionar Lead
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Nome / Contato</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Canal</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Etapa do Funil</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Data de Entrada</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/20 transition cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-primary text-white grid place-items-center font-bold text-sm">
                            {lead.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <div className="text-sm font-bold group-hover:text-primary transition">{lead.name}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{lead.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {lead.source === "whatsapp" ? (
                            <div className="h-7 w-7 rounded-lg bg-success/10 grid place-items-center"><MessageSquare className="h-3.5 w-3.5 text-success" /></div>
                          ) : (
                            <div className="h-7 w-7 rounded-lg bg-pink-500/10 grid place-items-center"><Instagram className="h-3.5 w-3.5 text-pink-500" /></div>
                          )}
                          <span className="text-xs font-medium capitalize">{lead.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          lead.stage === "Fechado" ? "bg-success/10 text-success border-success/20" :
                          lead.stage === "Proposta" ? "bg-primary/10 text-primary border-primary/20" :
                          "bg-muted text-muted-foreground border-border"
                        }`}>
                          {lead.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{lead.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-primary/10 hover:text-primary transition text-muted-foreground"><Phone className="h-4 w-4" /></button>
                          <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-primary/10 hover:text-primary transition text-muted-foreground"><MessageSquare className="h-4 w-4" /></button>
                          <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-muted transition text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-5 border-t border-border flex items-center justify-between bg-muted/10">
              <div className="text-xs text-muted-foreground">Mostrando <span className="font-bold text-foreground">1-4</span> de <span className="font-bold text-foreground">2,861</span> contatos</div>
              <div className="flex items-center gap-2">
                <button className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-card hover:bg-muted transition disabled:opacity-50" disabled><ChevronLeft className="h-4 w-4" /></button>
                <div className="flex items-center gap-1">
                  <button className="h-9 w-9 rounded-lg bg-primary text-white text-xs font-bold shadow-glow">1</button>
                  <button className="h-9 w-9 rounded-lg hover:bg-muted text-xs font-bold transition">2</button>
                  <button className="h-9 w-9 rounded-lg hover:bg-muted text-xs font-bold transition">3</button>
                  <span className="px-1 text-muted-foreground text-xs">...</span>
                  <button className="h-9 w-9 rounded-lg hover:bg-muted text-xs font-bold transition">72</button>
                </div>
                <button className="h-9 w-9 grid place-items-center rounded-lg border border-border bg-card hover:bg-muted transition"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}