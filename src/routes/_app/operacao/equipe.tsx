import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, MoreHorizontal, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mockEquipe = [
  { id: 1, nome: "Ricardo Oliveira", cargo: "Técnico Master", email: "ricardo@conecta.com", status: "Ativo", permissao: "Admin" },
  { id: 2, nome: "Beatriz Santos", cargo: "Atendimento", email: "beatriz@conecta.com", status: "Ativo", permissao: "Padrão" },
  { id: 3, nome: "Fabio Lima", cargo: "Técnico Júnior", email: "fabio@conecta.com", status: "Ausente", permissao: "Técnico" },
];

export default function EquipePage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <Topbar title="Equipe" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Gestão de Equipe</h2>
            <p className="text-muted-foreground">Administre usuários, cargos e permissões do sistema.</p>
          </div>
          <Button className="gap-2 shadow-glow bg-gradient-primary">
            <UserPlus className="h-4 w-4" /> Convidar Membro
          </Button>
        </div>

        <Card className="border-sidebar-border bg-sidebar/30">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle>Membros ({mockEquipe.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou email..." className="pl-9 h-9 w-[300px]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sidebar-border bg-white/5">
                    <th className="text-left p-4 font-medium text-muted-foreground">Nome</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Cargo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Permissão</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border">
                  {mockEquipe.map((membro) => (
                    <tr key={membro.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                            {membro.nome.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{membro.nome}</p>
                            <p className="text-xs text-muted-foreground">{membro.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{membro.cargo}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={membro.status === 'Ativo' ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}>
                          {membro.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Shield className="h-3 w-3 text-primary" /> {membro.permissao}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
