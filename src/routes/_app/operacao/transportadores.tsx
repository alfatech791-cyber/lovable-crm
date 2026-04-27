import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus, Search, Phone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/operacao/transportadores")({
  component: TransportadoresPage,
});

function TransportadoresPage() {
  const carriers = [
    { id: 1, name: "Correios", type: "Nacional", phone: "0800 725 0100", active: true },
    { id: 2, name: "Jadlog", type: "Privada", phone: "(11) 3356-3100", active: true },
    { id: 3, name: "Loggi", type: "Express", phone: "(11) 4040-4040", active: true },
    { id: 4, name: "Motoboy Próprio", type: "Local", phone: "-", active: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transportadores</h1>
          <p className="text-muted-foreground text-sm">Gerencie parceiros de entrega e logística</p>
        </div>
        <Button className="w-full md:w-auto gap-2">
          <Plus className="h-4 w-4" /> Novo Transportador
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar transportadores..." className="pl-10 max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.map((carrier) => (
                <TableRow key={carrier.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    {carrier.name}
                  </TableCell>
                  <TableCell>{carrier.type}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {carrier.phone}
                  </TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Ativo</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Configurar</Button>
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
