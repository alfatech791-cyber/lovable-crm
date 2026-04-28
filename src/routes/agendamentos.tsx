import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Plus, User, Search, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const mockAgendamentos = [
  { id: 1, cliente: "Carlos Eduardo", servico: "Troca de Tela - iPhone 14", data: "2024-04-28", hora: "09:00", status: "Confirmado", tecnico: "Ricardo" },
  { id: 2, cliente: "Ana Beatriz", servico: "Avaliação Bateria", data: "2024-04-28", hora: "10:30", status: "Pendente", tecnico: "Beatriz" },
  { id: 3, cliente: "Marcos Paulo", servico: "Reparo Placa", data: "2024-04-28", hora: "14:00", status: "Confirmado", tecnico: "Ricardo" },
];

export const Route = createFileRoute("/agendamentos")({
  component: AgendamentosPage,
});

function AgendamentosPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Agendamentos" toggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Agenda Técnica</h2>
            <p className="text-muted-foreground">Gerencie os horários e serviços agendados.</p>
          </div>
          <Button className="gap-2 shadow-glow bg-gradient-primary">
            <Plus className="h-4 w-4" /> Novo Agendamento
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-sidebar-border bg-sidebar/30">
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-none"
                />
              </CardContent>
            </Card>

            <Card className="border-sidebar-border bg-sidebar/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resumo do Dia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Agendados</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground text-green-500">Confirmados</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground text-yellow-500">Pendentes</span>
                  <span className="font-bold">3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <Card className="border-sidebar-border bg-sidebar/30">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Compromissos</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar cliente..." className="pl-9 h-9 w-[200px]" />
                  </div>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-sidebar-border">
                  {mockAgendamentos.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                          <span className="text-xs font-bold uppercase">{item.hora.split(':')[0]}h</span>
                          <span className="text-[10px]">{item.hora.split(':')[1]}min</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.cliente}</p>
                          <p className="text-xs text-muted-foreground">{item.servico}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <User className="h-3 w-3" /> Técnico: {item.tecnico}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={item.status === 'Confirmado' ? 'default' : 'outline'} className={item.status === 'Confirmado' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20'}>
                          {item.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">Ver Detalhes</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
