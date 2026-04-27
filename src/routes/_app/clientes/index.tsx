import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Filter, MoreHorizontal, Phone, Mail, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/dashboard/Header";

export const Route = createFileRoute("/_app/clientes/")({
  component: ClientesPage,
});

const mockClientes = [
  { id: 1, name: "João Silva", email: "joao@email.com", phone: "(11) 98888-7777", city: "São Paulo", status: "Ativo", lastOrder: "25/03/2024" },
  { id: 2, name: "Maria Oliveira", email: "maria@email.com", phone: "(11) 97777-6666", city: "Rio de Janeiro", status: "Ativo", lastOrder: "26/03/2024" },
  { id: 3, name: "Pedro Santos", email: "pedro@email.com", phone: "(11) 96666-5555", city: "Curitiba", status: "Inativo", lastOrder: "10/01/2024" },
];

function ClientesPage() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header title="Gestão de Clientes" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome, CPF, e-mail ou telefone..." className="pl-10" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Filtros
              </Button>
              <Button size="sm" className="gap-2 bg-primary">
                <UserPlus className="h-4 w-4" /> Novo Cliente
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Cidade</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {cliente.phone}</div>
                          <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {cliente.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {cliente.city}
                        </div>
                      </TableCell>
                      <TableCell>{cliente.lastOrder}</TableCell>
                      <TableCell>
                        <Badge variant={cliente.status === "Ativo" ? "default" : "secondary"}>
                          {cliente.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
