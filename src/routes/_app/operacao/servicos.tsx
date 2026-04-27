import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Wrench, MoreHorizontal, Settings2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Header } from "@/components/dashboard/Header";

export const Route = createFileRoute("/_app/operacao/servicos")({
  component: ServicosOperacaoPage,
});

const mockServicos = [
  { id: 1, name: "Troca de Tela (Original)", category: "Display", price: 450.00, time: "60 min" },
  { id: 2, name: "Troca de Bateria", category: "Energia", price: 180.00, time: "40 min" },
  { id: 3, name: "Limpeza Química", category: "Manutenção", price: 120.00, time: "120 min" },
  { id: 4, name: "Reparo de Placa", category: "Hardware", price: 350.00, time: "2 dias" },
];

function ServicosOperacaoPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title="Configuração de Serviços" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar serviço..." className="pl-10" />
            </div>
            <Button size="sm" className="gap-2 bg-primary">
              <Plus className="h-4 w-4" /> Novo Serviço
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                <CardTitle>Catálogo de Mão de Obra</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tempo Estimado</TableHead>
                    <TableHead className="text-right">Preço Sugerido</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockServicos.map((servico) => (
                    <TableRow key={servico.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          {servico.name}
                        </div>
                      </TableCell>
                      <TableCell>{servico.category}</TableCell>
                      <TableCell>{servico.time}</TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {servico.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
