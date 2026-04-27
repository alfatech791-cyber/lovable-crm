import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Search, History } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/operacao/maquininhas")({
  component: MaquininhasPage,
});

function MaquininhasPage() {
  const machines = [
    { id: 1, name: "Moderninha Pro", provider: "PagSeguro", rate: "1.99%", status: "Ativa" },
    { id: 2, name: "SumUp Total", provider: "SumUp", rate: "1.90%", status: "Ativa" },
    { id: 3, name: "Stone S920", provider: "Stone", rate: "1.85%", status: "Manutenção" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maquininhas POS</h1>
          <p className="text-muted-foreground text-sm">Gerencie seus terminais de pagamento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" /> Histórico
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Nova Maquininha
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Operadora</TableHead>
                <TableHead>Taxa Padrão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    {m.name}
                  </TableCell>
                  <TableCell>{m.provider}</TableCell>
                  <TableCell>{m.rate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.status === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {m.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Taxas</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
