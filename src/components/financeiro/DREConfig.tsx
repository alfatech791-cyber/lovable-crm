import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calculator } from "lucide-react";

export function DREConfig() {
  const dreData = [
    { label: "Receita Bruta de Vendas", value: 85000, type: "revenue" },
    { label: "(-) Impostos sobre Vendas", value: 3500, type: "expense" },
    { label: "Receita Líquida", value: 81500, type: "total" },
    { label: "(-) CPV (Custo de Produtos Vendidos)", value: 52000, type: "expense" },
    { label: "Lucro Bruto", value: 29500, type: "total" },
    { label: "(-) Despesas Operacionais", value: 12000, type: "expense" },
    { label: "(-) Despesas Administrativas", value: 4500, type: "expense" },
    { label: "EBITDA / LAJIDA", value: 13000, type: "total" },
    { label: "(-) Depreciação e Amortização", value: 1200, type: "expense" },
    { label: "Lucro Líquido do Exercício", value: 11800, type: "final" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground font-medium">Receita Bruta</p>
          <p className="text-2xl font-bold text-green-600">R$ 85.000</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground font-medium">Margem Bruta</p>
          <p className="text-2xl font-bold">34.7%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground font-medium">Despesas Fixas</p>
          <p className="text-2xl font-bold text-red-600">R$ 16.500</p>
        </Card>
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-primary font-medium">Lucro Líquido</p>
          <p className="text-2xl font-bold text-primary">R$ 11.800</p>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>DRE Detalhado - Abril 2026</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1"><Calculator className="h-3 w-3" /> Configurar Plano de Contas</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição das Contas</TableHead>
                <TableHead className="text-right">Valor (R$)</TableHead>
                <TableHead className="text-right">% Receita</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dreData.map((item, idx) => (
                <TableRow key={idx} className={item.type === "total" || item.type === "final" ? "bg-muted/50 font-bold" : ""}>
                  <TableCell className="pl-4">
                    {item.type === "expense" && <span className="mr-2 text-muted-foreground">-</span>}
                    {item.label}
                  </TableCell>
                  <TableCell className={`text-right ${item.type === "expense" ? "text-red-600" : item.type === "revenue" || item.type === "final" ? "text-green-600" : ""}`}>
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.value)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {((item.value / 85000) * 100).toFixed(1)}%
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
