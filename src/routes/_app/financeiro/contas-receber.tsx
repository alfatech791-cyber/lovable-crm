import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, Calendar, ArrowRightCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/financeiro/contas-receber")({
  component: ContasReceberPage,
});

function ContasReceberPage() {
  const accounts = [
    { id: 1, client: "João Silva", value: 1200.00, dueDate: "2024-04-10", status: "Pendente", category: "Venda Direta" },
    { id: 2, client: "Empresa ABC", value: 4500.00, dueDate: "2024-04-15", status: "Atrasado", category: "Contrato Mensal" },
    { id: 3, client: "Maria Oliveira", value: 350.00, dueDate: "2024-04-05", status: "Pago", category: "Serviço Avulso" },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <Topbar title="Contas a Receber" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Pendente</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">R$ 5.700,00</h3>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Atrasados</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">R$ 4.500,00</h3>
          </Card>
          <Card className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Recebido no Mês</p>
            <h3 className="text-2xl font-black text-green-600 mt-1">R$ 12.840,00</h3>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Buscar por cliente..." className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <Button variant="outline" className="h-10 rounded-xl">
              <Filter className="h-4 w-4 mr-2" /> Filtros
            </Button>
          </div>
          <Button className="bg-gradient-primary shadow-glow">Novo Recebimento</Button>
        </div>

        <Card className="overflow-hidden border-border">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map(acc => (
                <TableRow key={acc.id}>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {acc.dueDate}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{acc.client}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">{acc.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    R$ {acc.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={acc.status === "Pago" ? "default" : acc.status === "Atrasado" ? "destructive" : "secondary"}>
                      {acc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
