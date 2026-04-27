import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, FileText, Send, Printer, User } from "lucide-react";

export function Quotations() {
  const [searchTerm, setSearchTerm] = useState("");

  const quotations = [
    { id: "ORC-001", customer: "Marcos Vinicius", date: "2024-04-20", value: 3200, status: "pending", items: 2 },
    { id: "ORC-002", customer: "Julia Mendes", date: "2024-04-19", value: 150, status: "approved", items: 1 },
    { id: "ORC-003", customer: "Fernanda Lima", date: "2024-04-18", value: 4500, status: "expired", items: 3 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge variant="secondary" className="bg-green-100 text-green-700">Aprovado</Badge>;
      case "expired": return <Badge variant="destructive">Expirado</Badge>;
      default: return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar orçamento..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Novo Orçamento
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Orçamento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((orc) => (
                <TableRow key={orc.id}>
                  <TableCell className="font-mono font-medium">{orc.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {orc.customer}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(orc.date).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{orc.items} itens</TableCell>
                  <TableCell>{getStatusBadge(orc.status)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(orc.value)}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" title="Imprimir"><Printer className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Enviar WhatsApp"><Send className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Gerar Venda"><FileText className="h-4 w-4" /></Button>
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
